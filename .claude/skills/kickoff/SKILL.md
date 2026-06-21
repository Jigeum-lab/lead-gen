---
name: kickoff
description: >
  파이프라인 진입점. /kickoff {project-name} 실행 시 product/{project}/product-context.md
  존재 여부를 확인하고, 없으면 11개 필드를 수집한다.
  이미 있으면 manifest.md에서 파이프라인 현황을 표시하고 다음 단계를 안내한다.
  "킥오프", "프로젝트 시작", "새 기능 기획", "프로젝트 셋업" 등
  프로젝트·기능 초기화 관련이면 어떤 표현이든 트리거.
  리서치 실행·PRD 작성·와이어프레임 작업에는 트리거하지 않음.
type: encoded-preference
version: 1.1.0
---

# Kickoff Skill — 파이프라인 진입점

신규 프로젝트/기능을 시작하거나 기존 파이프라인 현황을 확인하는 게이트웨이.

## Workflow

### Phase 0 — 프로젝트명 추출

슬래시 명령 인자(`/kickoff {project-name}`)에서 프로젝트명 추출.
없으면 AUQ로 확인.

프로젝트명 규칙: 소문자·하이픈 권장 (`auth-flow`, `dashboard`, `onboarding`)

### Phase 1 — 존재 확인 분기

`product/{project}/product-context.md` 존재 여부로 분기:

**A. 신규** (파일 없음) → Phase 2
**B. 기존** (파일 있음) → Phase 3

### Phase 2 — 신규: 11개 필드 수집

대화 맥락에서 이미 파악한 정보를 먼저 채우고 모르는 것만 질문한다.

필수 11개 필드:
1. `product_name`: 제품/기능명
2. `client`: (Skein 내부 기능이면 "Skein")
3. `problem`: 해결하려는 핵심 문제 (1~2문장)
4. `target_user`: 주요 타깃 사용자
5. `core_value`: 핵심 가치 제안 (USP)
6. `key_features`: 주요 기능 목록 (3~7개)
7. `market`: 목표 시장 및 규모
8. `competitors`: 주요 경쟁사/대안 (2~5개)
9. `constraints`: 기술·예산·일정 제약 (Next.js 16, Tailwind v4, shadcn Base UI)
10. `assumptions`: 검증 필요한 핵심 가정
11. `success_metrics`: 성공 지표 (KPI)

수집 완료 후 디렉토리 및 파일 생성:
- `product/{project}/product-context.md`
- `product/{project}/ux/.gitkeep`
- `product/{project}/manifest.md` (아래 형식)

### Phase 3 — 기존: 현황 표시

`product/{project}/manifest.md` 로드 → Phase 4 대시보드 표시.

manifest.md가 없으면 product-context.md를 읽어 재생성.

### Phase 4 — 파이프라인 대시보드

```
📋 {product_name} 파이프라인 현황
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 01 킥오프         product-context.md v1.0
⏳ 02 리서치          → /research
⏸ 03 PRD            리서치 완료 후
⏸ 04 IA·플로우       PRD 완료 후 → /user-flow
⏸ 05 기능명세        PRD 완료 후 → /functional-spec
⏸ 06 와이어프레임     IA + 기능명세 완료 후 → /wireframe
⏸ 07 코드 생성       와이어프레임 완료 후 → /hi-fi
⏸ 08 QA 검토        코드 생성 완료 후 → /qa
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
다음 단계: /research
```

## manifest.md 형식

```markdown
# {project} 파이프라인 매니페스트

> 프로젝트: {product_name} | 생성일: {today} | 마지막 업데이트: {today}

## 파이프라인 현황

| # | 단계 | 산출물 | 상태 | 버전 | 날짜 |
|---|---|---|---|---|---|
| 01 | 킥오프 | product-context.md | ✅ 완료 | v1.0 | {today} |
| 02 | 리서치 | research.md | ⏳ 미작성 | - | - |
| 03 | PRD | PRD.md | ⏸ 대기 | - | - |
| 04 | IA·플로우 | ux/ia-userflow.md | ⏸ 대기 | - | - |
| 05 | 기능명세 | ux/functional-spec.md | ⏸ 대기 | - | - |
| 06 | 와이어프레임 | ux/wireframes.md | ⏸ 대기 | - | - |
| 07 | 코드 생성 | src/ 파일들 | ⏸ 대기 | - | - |
| 08 | QA 검토 | qa-review.md | ⏸ 대기 | - | - |

**상태 범례**: ✅ 완료 | 🔄 진행중 | ⏳ 미작성 | ⏸ 대기 | ❌ 블로킹

## 결정 이력
| 날짜 | 단계 | 결정 내용 |
|---|---|---|
| {today} | 킥오프 | 프로젝트 시작 |

## 미해결 항목
*(단계별 [확인 필요] 누적)*
```

## Constraints

- 프로젝트명 없이 추측 실행 금지
- 기존 product-context.md 있으면 재수집 금지 — manifest만 표시
- 모든 파일 경로는 `product/{project}/` 기준 (Skein 프로젝트 루트 하위)
- [확인 필요] 마커 — 미수집 필드 임의 기입 금지

## Anti-Triggers

- 리서치 실행 → `/research` 스킬
- PRD 작성 → `/prd` 스킬
- 파이프라인 현황만 확인 → manifest.md 직접 읽기
