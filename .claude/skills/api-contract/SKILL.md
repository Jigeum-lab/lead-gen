---
name: api-contract
description: >
  승인된 PRD를 바탕으로 API 계약(리소스·엔드포인트·DTO·에러 모델·테넌시 경계)을 설계하는
  파이프라인 04 단계 스킬. "어떻게(시그니처·스키마)"를 확정한다. 컨텍스트 조립 → 계약 초안 →
  devils-advocate 비평 → 수정 → 계약 품질 게이트 → 저장 순서로 실행.
  "API 계약 설계", "엔드포인트 정의", "DTO 설계", "/api-contract" 등에 트리거.
when_to_use: >
  PRD가 approved:true인 뒤, 데이터 모델/구현 전. 리소스 모델·엔드포인트 시그니처·요청/응답 DTO·
  에러 코드·테넌시 스코프를 확정해야 할 때.
version: 1.0.0
---

# API Contract Skill — 파이프라인 04 (계약 설계)

PRD가 정의한 "무엇을/왜"를 받아 **"어떻게"**(엔드포인트 시그니처·DTO·에러 모델)를 확정한다. 이전까지 전용 스킬이 없던 공백 단계를 채운다. 패턴: `sub-agent-patterns.md` §2(크리틱 루프). 게이트/모델: `gates.md`·`model-routing.md`. 검증 사실: `backend-reference.md`.

## Gate (Phase 0)
- **HARD-GATE**: `product/{feature}/PRD.md` 없으면 중단 → `/prd`
- **HARD-GATE (Approval)**: PRD `approved: false`면 중단 → "PRD 검토 후 approved: true로 변경하세요."
- **Output Gate**: `api-contract.md` 이미 있으면 AUQ (기존 수정 `/iterate api-contract` / 다음 단계 / 새로 작성)

## Workflow

### Phase 1 — 컨텍스트 조립 (`context-engineering.md` 템플릿)
- L0: CLAUDE.md 모듈 규약 + `backend-reference.md` §1·§2·§3(테넌시·OWASP·ValidationPipe)
- L1: product-context.md 전체
- L2: PRD.md(승인본)
- L3: 계약 설계 지시 + 출력 경로 + 완료 기준

### Phase 2 — 계약 초안 (Sonnet)
PRD의 각 P0 역량을 리소스·엔드포인트로 사상. 추측 금지 — 미확인 `[확인 필요]`, 미결 `[결정 필요]`.

### Phase 3 — devils-advocate 비평 (Opus)
`/devils-advocate` 5축, 계약 실패 모드 집중: 에러 모델 불일치·버저닝/하위호환 파괴·테넌시 경계 누수·멱등성 결여·페이지네이션 부재·DTO 검증 누락·과금 우회. → Critical/Major/Minor.

### Phase 4 — 수정 루프 (Sonnet, 최대 2회)
1차 후 Major 0건이면 종료. 2차 후 Minor는 `[개선 권고]`.

### Phase 5 — 계약 품질 게이트 + 저장 (`gates.md` §4)
아래 체크리스트 통과 후 `product/{feature}/api-contract.md` 저장(`approved: false`), manifest 04행 갱신.

```
API 계약 품질 게이트:
☐ 모든 엔드포인트에 메서드+경로+버전 (POST /v1/brands) — Express 5 네임드 와일드카드 주의
☐ 각 엔드포인트: 인증 요구(@Public 여부)·요청 DTO·응답 스키마·에러 코드 명시
☐ 테넌시 경계 명시 (어떤 workspace/brand 스코프 — assertWorkspaceMember/resolveBrandWorkspace)
☐ 요청 DTO에 서버 소유 필드 배제 (OmitType/PickType — 크레딧 단가·tenant id·role)
☐ ValidationPipe 전제 명시 (whitelist + forbidNonWhitelisted)
☐ 멱등성(크레딧/결제 POST)·페이지네이션·정렬 규약 (해당 시)
☐ 표준 에러 모델 일관 (HTTP status + 코드 + 메시지)
☐ 크레딧/과금 엔드포인트에 서버측 단가 결정(CREDIT_COST) 명시
☐ Swagger 데코레이터 계획 (@ApiTags/@ApiOperation/@ApiBearerAuth/@ApiProperty)
```

## api-contract.md 구조
```markdown
---
feature: {feature}
version: v1.0
approved: false
created: {today}
---
# {service_name} API 계약

## 1. 리소스 모델 (엔티티 ↔ 리소스 매핑)
## 2. 공통 규약 (버저닝·인증·에러 모델·페이지네이션·멱등성)
## 3. 엔드포인트 (각: 메서드·경로·인증·테넌시 스코프·요청 DTO·응답·에러 코드)
## 4. DTO 정의 (필드·검증 규칙·서버 소유 필드 배제)
## 5. 개방 질문 ([확인 필요]/[결정 필요])
```

## Constraints
- DB 스키마(컬럼·인덱스·RLS) 확정은 다음 단계(data-model → `@db-migration`).
- 승인 전(`approved: false`) 다음 단계 진입 불가.
- 모든 client-facing 입력 필드는 BOLA 방지를 위해 테넌시 검증 대상임을 명시.

## Anti-Triggers
- PRD 작성 → `/prd` · 데이터 모델/마이그레이션 → `@db-migration`
- 기존 계약 수정 → `/iterate api-contract`
