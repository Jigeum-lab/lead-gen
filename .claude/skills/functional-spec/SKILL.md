---
name: functional-spec
description: >
  승인된 PRD를 기반으로 기능명세서를 7컬럼 표 형식으로 작성하는 스킬.
  기능 ID(F001~Fn) 부여, 브레이크포인트 분기(Mobile/PC), 엣지케이스 4종 정의.
  "기능명세서 작성해줘", "functional spec 만들어줘", "기능 ID 부여해줘",
  "입력/처리/출력 명세", "엣지케이스 정의해줘" 등
  기능명세·기능 ID·엣지케이스 관련이면 어떤 표현이든 트리거.
  PRD 없이 기능 나열, 와이어프레임·디자인 작업에는 트리거하지 않음.
type: encoded-preference
version: 1.0.0
---

# Functional Spec (기능명세서)

PRD 승인 후, 각 화면의 기능을 입력/처리/출력/엣지케이스 단위로 표 형식으로 작성.

상세 형식·예시: `references/spec-format.md`, `references/spec-example.md`

## Workflow

### Phase 1 — PRD Gate

`product/{project}/PRD.md` 로드 → `approved: true` 확인.

미승인 시 HARD-GATE:
```
❌ [HARD-GATE] PRD가 미승인(approved: false) 상태입니다.
PRD 검토 후 approved: true로 변경하세요.
```

PRD에서 추출: 기능 목록, MVP 스코프, 화면 목록.

### Phase 1-A: ia-userflow.md 확인 (SOFT-GATE)

`product/{project}/ux/ia-userflow.md` 존재 여부 확인.

없으면:
```
⚠️ [SOFT-GATE] ia-userflow.md가 없습니다. IA 없이 기능명세서를 작성하면
화면-기능 매핑이 불완전할 수 있습니다.
```
AUQ: "/user-flow 먼저 진행 | ia-userflow.md 없이 기능명세서 작성"

### Phase 1-B — Output Gate

`product/{project}/ux/functional-spec.md` 존재 시:
- 파일 로드 → 버전·날짜 한 줄 표시
- AUQ: "기존 버전 수정 | 다음 단계(wireframe)로 진행 | 아카이브 후 새로 작성"
- 선택에 따라 분기. 새로 작성 선택 시에만 아래 Phase 진행.

### Phase 2 — Feature Extraction

PRD 기능 요구사항(Must-Have → Should-Have 순)에서 항목 추출 → F001~Fn 기능 ID 부여.

| 기능ID | 기능명 | 화면명 | 우선순위 | PRD 참조 |
|---|---|---|---|---|
| F001 | 목록 조회 | 홈 | Must-Have | §3.1 |

기능 간 의존성 명시 (예: F003은 F001 완료 후 진입 가능).

### Phase 3 — Spec Writing

각 화면 섹션 구성:

**1. 표출 정보** — 화면에 노출되는 UI 요소 번호 목록

**2. 인터랙션 명세 (7컬럼 표 필수)**

| 기능ID | 화면명 | 트리거 | 입력값 | 처리 | 출력 | 엣지케이스 |
|---|---|---|---|---|---|---|
| F001 | 홈 | 페이지 진입 | user_id | `GET /api/items?limit=10` | 카드 그리드 | 데이터 없음 → 빈 상태 / API 실패 → [다시 시도] |

**3. 상태 정의** (4종 필수)

| 상태 | 조건 | UI 처리 |
|---|---|---|
| 정상 | 데이터 로드 성공 | 목록 렌더링 |
| 로딩 | API 응답 대기 | 스켈레톤 UI |
| 빈 상태 | 항목 0개 | 안내 메시지 + CTA |
| 에러 | API 실패 | 오류 메시지 + [다시 시도] |

### Phase 4 — Breakpoint Coverage

모든 기능에 브레이크포인트 분기 명시:

| 구분 | Mobile (≤767px) | PC (≥768px) |
|---|---|---|
| 레이아웃 | 1열 리스트 | 3열 그리드 |
| 네비게이션 | 하단 탭바 | 좌측 사이드바 |

동일하면 "Mobile/PC 공통" 표기.

### Phase 5 — 저장

`product/{project}/ux/functional-spec.md` 저장 후 `product/{project}/manifest.md` 업데이트:
- functional-spec 행: `✅ 완료`, 현재 버전·날짜 기입

`product/{project}/ux/functional-spec.md` 내용:

```yaml
---
project: {프로젝트명}
type: functional-spec
created: YYYY-MM-DD
version: v1.0
prd_version: {참조 PRD 버전}
approved: false
---
```

## Constraints

- **7컬럼 표 강제** — 불릿 나열 방식 금지
- **기능 ID 필수** — F001~Fn 없이 기능명만 나열 금지
- **엣지케이스 4종** — 빈 상태·에러·권한 없음·로딩 각 기능별 정의
- **브레이크포인트 필수** — 동일하면 "공통" 명시
- **상태 분리** — 로그인/비로그인, 권한 있음/없음, 데이터 있음/없음 별도 행(F001-A, F001-B)
- **Figma 텍스트 임베딩 금지** — 본문은 md 파일 저장, Figma에는 링크만

## Anti-Triggers

- PRD 없이 기능 나열 → prd-writer 먼저
- IA·유저 플로우 → user-flow 스킬
- 와이어프레임·디자인 → wireframe 스킬
