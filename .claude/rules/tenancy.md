---
paths:
  - "src/modules/**/*.ts"
  - "src/auth/**/*.ts"
  - "src/common/**/*.ts"
---

# 테넌시·인증 불변식 (모듈·인증·공통 코드 편집 시 자동 로드)

> 경로 스코프 규칙(JIT). `src/modules/**`·`src/auth/**`·`src/common/**` 파일을 읽거나 편집할 때만 컨텍스트에 들어온다. 근거·상세: `.claude/harness/backend-reference.md`. 1차 인가는 앱 계층 — RLS는 방어선일 뿐.

## 데이터 접근 (위반 = 리뷰 반려)
- 새 데이터 모듈의 서비스 메서드는 **첫 줄에서** `tenancy.assertWorkspaceMember(userId, workspaceId)` 또는 `resolveBrandWorkspace(userId, brandId)` 호출. 멤버십 검증 없는 `find/save` 금지.
- 클라이언트가 보낸 id(workspace/brand/리소스)는 **매번 이 유저가 이 객체에 권한 있는지** 검증(OWASP API1 BOLA/IDOR). 세션 유저 id 비교만으로 불충분.
- NestJS는 service_role로 붙어 **RLS를 우회**한다 — DB 안전망 없음. 인가는 전적으로 서버 책임.

## 인증
- `SupabaseJwtGuard`(전역, `APP_GUARD`)가 검증, `req.user.id = sub`. `@Public()`만 예외.
- JWT는 **비대칭 JWKS 엔드포인트로 검증**(공유 HS256 시크릿 아님). `jose`의 `createRemoteJWKSet`+`jwtVerify`. 클레임 `aud/exp/iss/sub/role` 확인.

## DTO·입력 검증
- 모든 DTO `class-validator` 검증. 전역 `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
- 서버 소유 필드(크레딧 단가·tenant id·role)는 `OmitType`/`PickType`로 write-DTO에서 구조적 배제 — mass-assignment 차단.
- 컨트롤러는 얇게(검증·라우팅), 로직은 서비스. `@ApiTags/@ApiOperation/@ApiBearerAuth`.

## 과금·동시성
- 크레딧/과금 단가는 서버에서 결정(`CREDIT_COST`), 클라이언트 입력 신뢰 금지.
- 크레딧 차감은 원자적으로: 트랜잭션 내 `SELECT … FOR UPDATE`(`setLock('pessimistic_write')`) 또는 조건부 `UPDATE … WHERE balance >= :cost`. 결제/크레딧 POST는 멱등성 키.
- 트랜잭션 안에서는 콜백 `manager`의 리포지토리 사용(전역 주입 리포지토리는 트랜잭션 이탈).

## 보안 (위반 = 차단)
- `DATABASE_URL`·`SUPABASE_SERVICE_ROLE_KEY`/`sb_secret_*`·JWT secret을 로그·응답·클라이언트에 절대 노출 금지.
- 비동기·장시간 작업은 BullMQ+Redis 워커로(HTTP 핸들러 블로킹 금지).
