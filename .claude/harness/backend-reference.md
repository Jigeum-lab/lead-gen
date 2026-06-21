# 백엔드 레퍼런스 (Skein API · 검증된 사실)

NestJS 11 · TypeORM · Supabase · Cloud Run 스택의 **공식문서 검증된 사실**을 한곳에 모은 레퍼런스. 리뷰어 에이전트(`nestjs-reviewer`·`security-reviewer`·`db-migration`)와 구현/계약 스킬이 참조한다.

> 조사·검증일: 2026-06-15. 1차 출처 = 각 벤더 공식문서 + `context7` MCP 버전 사실. 전체 인용·접근일자는 `docs/research-log.md`. **메모리 의존 금지** — 라이브러리 API/버전은 항상 `context7`로 재확인.

---

## 1. Supabase service_role + RLS 보안 모델 (가장 중요)

**전제 검증 = 확인됨(CONFIRMED).** "NestJS가 service_role로 붙어 RLS를 우회하므로 앱 계층 테넌트 검증이 필수, RLS는 방어선일 뿐"이라는 CLAUDE.md의 전제는 Supabase 공식문서와 일치한다.

- **service_role는 Postgres 역할 수준에서 RLS를 우회한다.** 공식: secret/`service_role` 키는 `BYPASSRLS` 속성을 가져 "skipping any and all Row Level Security policies." `anon`/`authenticated`는 RLS 적용 대상, `service_role`/`postgres`는 아님.
- **앱 계층 인가가 필수 — DB 안전망 없음.** Supabase 공식: secret 키는 "servers that implement prior authorization themselves" 용도. 즉 RLS 우회 키를 쓰면 **서버가 인가를 책임진다.** → 이것이 정확히 `TenancyService.assertWorkspaceMember(userId, workspaceId)` 패턴.
- **secret/service 키 노출 절대 금지** — 브라우저·로그·응답·클라이언트에 절대 노출 금지(localhost 포함).
- **RLS 모범사례(방어선)**: deny-by-default(정책 없으면 접근 0); `USING`(기존 행 필터: SELECT/UPDATE/DELETE) vs `WITH CHECK`(신규/변경 행 검증: INSERT/UPDATE); 작업별 분리 정책(`FOR ALL` 지양); `TO authenticated` 한정; `auth.uid()`는 `(select auth.uid())`로 감싸 initPlan 캐시; 정책 컬럼에 인덱스(대형 테이블 100배+).

### JWT 검증 — 비대칭 키가 현재 권장 ⚠️ (CLAUDE.md 교정 사항)
- Supabase는 공유 HS256 → **비대칭 키(RS256/ES256, 권장 P-256/ES256)**로 이동. HS256은 "Not recommended for production."
- **2025-10-01부터 신규 프로젝트는 비대칭 JWT 기본값**, 기존 프로젝트 자동 마이그레이션.
- `SupabaseJwtGuard`는 **공유 시크릿이 아니라 JWKS 엔드포인트로 검증**해야 한다:
  `https://<project>.supabase.co/auth/v1/.well-known/jwks.json` (Auth 서버 왕복 없이 로컬 검증). 표준 클레임 검증: `aud`·`exp`·`iss`·`sub`·`role`.
  - 이 프로젝트는 `jose`(^6.2.3)가 설치돼 있음 → `createRemoteJWKSet` + `jwtVerify`로 JWKS 검증 구현 가능.
- **신규 API 키 체계**: `sb_publishable_…`(←`anon`, RLS 적용), `sb_secret_…`(←`service_role`, RLS 우회, 개별 폐기 가능). **레거시 `anon`/`service_role` 키는 2026년 말 폐기 예정** → service 키 마이그레이션 계획 필요.

---

## 2. 멀티테넌트 격리 & OWASP API 보안

- **OWASP API Security Top 10 (2023): API1 = Broken Object Level Authorization(BOLA/IDOR)가 1위.** API3=객체 속성 수준 인가(대량 노출+mass-assignment 병합), API4=무제한 자원 소비, API5=함수 수준 인가, API6=무제한 민감 비즈니스 플로우 접근.
- **BOLA/IDOR 방지**: 공식 — "check if the logged-in user has access to perform the requested action on the record **in every function** that uses an input from the client." 세션 유저 ID 비교만으로는 불충분 — *이 유저가 이 특정 객체에* 권한이 있는지 매번 검증. 추측 어려운 GUID 사용, 인가 테스트 작성 후 실패 시 배포 금지. → `assertWorkspaceMember`/`resolveBrandWorkspace` 매핑.
- **멱등성(Stripe 패턴)**: 모든 크레딧/결제 POST에 idempotency key; `(workspace_id, key)`로 첫 응답(status+body) 저장; 재사용 시 파라미터 비교로 불일치 거부; 24h+ 후 정리.
- **레이트리밋(API4)**: `@nestjs/throttler`(`getTracker` 오버라이드로 userId/workspaceId 키잉); Cloud Run 다중 인스턴스 분산 제한은 Redis+Lua 토큰버킷(이미 Redis 사용). *[throttler/토큰버킷 세부는 커뮤니티 출처 — API4 근거만 OWASP 확정]*
- **감사 로그(OWASP Logging)**: 인증 성공+실패, 접근통제 위반(멤버십 단언 실패), actor/action/target+tenant/outcome 기록; append-only/무결성 보호; **PII·시크릿 절대 로깅 금지**(`DATABASE_URL`/service 키/JWT 미로깅 규칙 강화).
- **서버측 가격/크레딧(API6)**: 클라이언트 가격 신뢰 금지 → 서버 소유 `CREDIT_COST`로 계산; 원자적 차감(§3)으로 경쟁·음수잔액 방지; 멱등성과 결합해 재시도 이중 차감 방지.

---

## 3. NestJS 11 실무

- **전역 가드는 `APP_GUARD`로** — `{ provide: APP_GUARD, useClass: SupabaseJwtGuard }`(DI 가능). `app.useGlobalGuards()`는 DI 주입 불가.
- **`@Public()`** — `SetMetadata`; 가드에서 `reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [getHandler(), getClass()])`(메서드>클래스 우선). **v11 주의: `getAllAndOverride`가 `T | undefined` 반환**(과거 `T`) → truthy 체크로 처리.
- **DI 스코프**: `DEFAULT`(싱글턴, 최속) 권장. `REQUEST` 스코프는 "application performance"에 악영향 + **주입 체인 위로 전파**(의존 대상도 모두 request-scoped). 테넌트 컨텍스트는 **AsyncLocalStorage(전부 싱글턴 유지)** 또는 **Durable Providers**(`Scope.REQUEST`+`durable:true`)로.
- **ValidationPipe(전역)** — `new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, transformOptions: { enableImplicitConversion: true } })`.
  - `whitelist`: 미장식 속성 제거 = **mass-assignment 방어**(주입된 `isAdmin`/`workspaceId`/`credits` 차단).
  - `forbidNonWhitelisted`: 제거 대신 400.
  - `transform`: 실제 DTO 클래스 인스턴스화 + 타입 강제.
  - **서버 소유 필드(크레딧 단가·테넌트 id·역할)는 `OmitType`/`PickType`로 write-DTO에서 구조적으로 배제.**
- **Swagger**(`@nestjs/swagger` 11.4.x): 컨트롤러에 `@ApiTags`/`@ApiOperation`/`@ApiBearerAuth`, DTO에 `@ApiProperty(Optional)`; `nest-cli.json`에 CLI 플러그인(`plugins:['@nestjs/swagger']`)으로 메타 자동 추론.
- **Config**(`@nestjs/config` 4.0.x): `forRoot({ isGlobal: true, cache: true, validationSchema: Joi…, validationOptions: { allowUnknown: false, abortEarly: true } })`. **v4 주의: 우선순위가 내부 config→검증 env→`process.env`로 변경**, `ignoreEnvVars` 폐기.
- **예외 필터/인터셉터**: 컨트롤러별 try/catch보다 전역 1개(`APP_FILTER`); 응답 봉투/타이밍은 인터셉터(`APP_INTERCEPTOR`). 실행 순서: 미들웨어→가드→인터셉터(pre)→파이프→핸들러→인터셉터(post)→예외필터.

### v11 파괴적 변경 (context7 마이그레이션 가이드 확인)
- **Node.js v20 최소** (v16/v18 드롭).
- **Express 5 기본**: 네임드 와일드카드 필수 — `@Get('users/*')` → `@Get('users/*splat')`; `forRoutes('*')` → `forRoutes('{*splat}')`. 중첩 쿼리스트링 기본 미파싱(`app.set('query parser','extended')`로 복원).
- **Fastify 5**(platform-fastify).
- **캐시 모듈 → Keyv**(`stores:`로 이동) — Redis 캐시 추가 시 해당.
- `getAllAndOverride`→`T|undefined`; 종료 라이프사이클 훅 역순 실행; 전역 모듈 미들웨어 먼저 실행.

---

## 4. TypeORM 함정 & 실무

- **`synchronize: false` 프로덕션 고정(절대 변경 금지)** — `true`는 데이터 있는 상태에서 컬럼/테이블을 조용히 드롭. 마이그레이션이 스키마 소스 오브 트루스.
  - **이 프로젝트 주의**: SQL을 Supabase SQL Editor로 적용하므로 TypeORM `migration:run` 추적 테이블에 반영 안 됨 → `db/migrations/*.sql` 순서·버전 규율을 직접 유지.
- **eager 관계 함정**: `eager:true`는 모든 `find*`에 LEFT JOIN, **QueryBuilder에선 조용히 무시**(`leftJoinAndSelect` 필요). 한쪽에만 허용. 블랭킷 eager 금지 — 쿼리별 명시 로드.
- **N+1**: `find({ relations: { posts: true } })` 또는 `leftJoinAndSelect`로 한 쿼리에. `relationLoadStrategy: "query"`(분리 쿼리, 행 곱 방지) vs 기본 `"join"`.
- **find vs QueryBuilder**: 단순 읽기는 `find/findOne`(파라미터화·주입 안전). 조인+WHERE/집계/락은 QueryBuilder — **항상 파라미터화**: `where("user.id = :id", { id })`, 사용자 입력 문자열 연결 금지, 파라미터명 재사용 금지(뒤 값이 덮음).
- **트랜잭션**: `DataSource.transaction(cb)`/`EntityManager.transaction(cb)` 또는 `QueryRunner`. `@Transaction()` 데코레이터는 제거됨. **트랜잭션 안에서는 콜백의 `manager`/그 리포지토리를 반드시 사용** — DI 주입 전역 리포지토리는 트랜잭션을 벗어남. 격리수준은 첫 인자.
- **원자적 크레딧 차감**: 트랜잭션 내 비관적 락 — `setLock("pessimistic_write")` → `SELECT … FOR UPDATE`(트랜잭션 없으면 `PessimisticLockTransactionRequiredError`). 패턴: BEGIN→`SELECT … FOR UPDATE` 크레딧 행→확인→UPDATE→COMMIT. 대안: 단일 `UPDATE … SET balance = balance - :cost WHERE balance >= :cost` + 영향행 수 확인(음수잔액 방지).
- **기타 함정**: `save()`는 SELECT 후 INSERT/UPDATE(2쿼리, 구독자 발화)·컬럼 덮어쓰기 가능 → 알려진 작업은 `insert()`/`update()`; `cascade`는 의도적으로만; `take`/`skip`+조인은 `SELECT DISTINCT` 서브쿼리로 감쌈(`limit`/`offset` 대신 `take`/`skip`); 소프트삭제는 `withDeleted:true`; `DataSource`는 인스턴스당 1회 초기화(콜드스타트 비용), 요청마다 금지.

---

## 5. Cloud Run / 서버리스 DB

- **커넥션 관리(최대 함정)**: 총 커넥션 = 인스턴스 수 × 인스턴스당 풀 크기 ≤ Postgres `max_connections`(또는 풀러 `default_pool_size`). Supabase 공식: **Supavisor 트랜잭션 모드 풀러 :6543**("ideal for serverless or edge functions"). **트랜잭션 모드는 prepared statement 미지원 → 드라이버에서 비활성화.** TypeORM 풀은 작게 `extra: { max: <작게, ~1–5>, idleTimeoutMillis, connectionTimeoutMillis }`. (2025-02-28부터 :6543=트랜잭션 전용, :5432=세션.) PgBouncer는 Supabase에서 폐기.
- **콜드 스타트**: **min-instances**로 웜 유지(0→1 콜드만 제거); **Startup CPU Boost**로 Node/NestJS 모듈 init 가속.
- **동시성**: 기본 vCPU당 80 동시요청. 높을수록 인스턴스↓·비용↓(I/O 바운드 REST에 유리) — 단 풀 크기를 동시성에 맞춰.
- **시크릿**: Secret Manager 호출 권장(이미지에 굽지 말 것); env 주입 시 **`latest`가 아니라 특정 버전 핀**(`process.env` 로깅으로 누출 위험).

---

## 6. 확정 버전 사실 (context7/npm 확인)
- NestJS 11: Node 20 최소 · Express 5 + Fastify 5 · 캐시 Keyv · `getAllAndOverride`→`T|undefined`.
- `@nestjs/swagger` 11.4.x · `@nestjs/config` 4.0.x(우선순위 변경+`ignoreEnvVars` 폐기).
- TypeORM: `synchronize:false`+`migrations`, `setLock('pessimistic_write')`→FOR UPDATE, 풀 `max`(`extra`), eager `relationLoadStrategy` join|query — 확인됨.
- Supabase: 비대칭 JWT 신규 기본값 2025-10-01 · 레거시 anon/service_role 키 폐기 2026년 말 · Supavisor :6543 트랜잭션 전용 2025-02-28.

> ⚠️ 미검증/주의: 레이트리밋 throttler·토큰버킷 세부(커뮤니티), 원자적 차감 conditional-UPDATE 변형(표준 관행), `maxInstances×poolSize≤max_connections` 공식(표준 가이드, 축자 인용 아님)은 `docs/research-log.md`에 한계 명시. 패키지의 `typeorm: "^1.0.0"`는 실제 TypeORM(0.3.x)과 불일치로 보이므로 설치 시 버전 확인 필요.
