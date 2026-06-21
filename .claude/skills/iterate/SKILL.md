---
name: iterate
description: >
  파이프라인 어느 단계든 피드백 기반으로 재작업하는 피드백 루프 스킬.
  Args: /iterate {stage} {feedback(선택)}
  지원 단계: research, prd, user-flow, functional-spec, wireframe, figma
  "수정해줘", "다시 써줘", "피드백 반영해줘", "특정 섹션 바꿔줘",
  "/iterate prd", "/iterate wireframe" 등 기존 산출물 수정·반영 요청이면 어떤 표현이든 트리거.
  처음 작성(초안 생성)·단계 간 이동·Figma 시각적 변경에는 트리거하지 않음.
type: encoded-preference
version: 1.0.0
---

# Iterate Skill

기존 산출물에 피드백을 적용해 새 버전을 생성. 버전 관리 + manifest 업데이트 포함.

---

## Phase 1 — Stage 식별

### Args 파싱

| 입력 형태 | 처리 |
|---|---|
| `/iterate prd 범위 좁혀줘` | stage=prd, feedback="범위 좁혀줘" |
| `/iterate wireframe` | stage=wireframe, feedback 없음 → Phase 2에서 수집 |
| `/iterate` | stage 없음 → AUQ로 선택 |

stage 미지정 시 AUQ: "어느 단계를 수정할까요?"
- research / prd / user-flow / functional-spec / wireframe / figma

### 단계별 파일 매핑

| Stage | 파일 경로 | 담당 에이전트 |
|---|---|---|
| research | `product/{project}/research.md` | product-researcher + ux-researcher |
| prd | `product/{project}/PRD.md` | prd-writer |
| user-flow | `product/{project}/ux/ia-userflow.md` | ux-designer |
| functional-spec | `product/{project}/ux/functional-spec.md` | ux-designer |
| wireframe | `product/{project}/ux/wireframes.md` | ux-designer |
| figma | product-context.md의 Figma URL | /hi-fi 스킬 |

해당 파일 미존재 시:
```
❌ [HARD-GATE] {stage} 산출물({파일경로})이 없습니다.
/prd, /user-flow 등 해당 단계를 먼저 실행하세요.
```

---

## Phase 2 — 피드백 수집

### 피드백이 Args에 있는 경우

그대로 사용. Phase 3으로 진행.

### 피드백이 없는 경우

현재 파일의 핵심 요약 표시 (frontmatter version, 주요 섹션 목록, 기능 수 등).

```
현재 {stage} 상태:
- 버전: {version}
- 최종 수정: {created/updated date}
- 주요 내용: {3줄 요약}

어떤 부분을 수정할까요?
```

피드백 범위 AUQ:
- "전체 섹션 재작성"
- "특정 섹션만 수정"
- "특정 기능/화면만 수정"

"특정 섹션/기능" 선택 시 → 추가 AUQ로 대상 명시 요청.

---

## Phase 3 — PRD 특수 처리

stage=prd이고 `approved: true`인 경우:
```
⚠️ [SOFT-GATE] 이 PRD는 이미 승인(approved: true)된 상태입니다.
수정하면 approved: false로 되돌아가며, /user-flow·/functional-spec 등 하위 단계도
영향을 받을 수 있습니다.
```

AUQ: "수정 진행 (approved: false로 리셋) | 취소"

"수정 진행" 선택 시 Phase 4로. 취소 시 종료.

---

## Phase 4 — Delta Context 조립

현재 파일을 읽어 Delta Context 패키지 구성:

```
=== [DELTA CONTEXT] ===
현재 버전 요약: {파일 핵심 — 기능 ID·섹션명·완료 기준 등 정밀 정보 포함}
변경 요청: {피드백 내용}
변경 대상: {섹션명 또는 기능 ID — "전체"면 "전체 재작성"}
불변 요소: {피드백에서 언급되지 않은 섹션·기능 — 변경하지 말 것}
변경 이유: {사용자 피드백 원문}

=== [LAYER 1: PROJECT CONTEXT] ===
{product-context.md 핵심 — 11개 필드 중 연관 필드만}
```

### 압축 규칙

현재 파일 크기 기준:
- <3,000자: 전체 요약 포함
- 3,000~8,000자: 핵심 섹션만 (변경 대상 섹션 전체 + 나머지 헤더만)
- >8,000자: 변경 대상 섹션 전체 + 나머지 1줄 요약

**절대 압축 금지**: 기능 ID(F001~Fn), 완료 기준, 하드 제약, 수치 데이터

---

## Phase 5 — 에이전트 실행

Stage별 에이전트에 Delta Context 주입:

| Stage | 에이전트 | 참조 스킬 |
|---|---|---|
| research | product-researcher + ux-researcher | — |
| prd | prd-writer | /prd-template |
| user-flow | ux-designer | /user-flow |
| functional-spec | ux-designer | /functional-spec |
| wireframe | ux-designer | /wireframe |
| figma | /hi-fi 스킬 | /wireframe (소스) |

에이전트 지시 추가사항:
```
불변 요소는 수정하지 마세요.
변경 대상 섹션만 재작성하고, 나머지는 원본 그대로 유지하세요.
기능 ID는 기존 것을 그대로 사용하세요 (새 ID 발급 금지).
```

---

## Phase 6 — 버전 관리

### 파일 구조

새 버전 내용을 파일 상단에, 기존 내용을 Archive 섹션으로 이동:

```markdown
---
version: v{N+1}  ← 증가
updated: YYYY-MM-DD
---

{새 버전 내용}

---

## Archive

### v{N} — {날짜} — {변경 요약 1줄}

{이전 버전 전체 내용}
```

버전 증가 규칙:
- 전체 재작성: v1.0 → v2.0
- 특정 섹션 수정: v1.0 → v1.1
- 오탈자·표현 수정: v1.0 → v1.0.1

### manifest.md 업데이트

`product/{project}/manifest.md`의 해당 stage 행:
```
| {stage} | ✅ 완료 (v{N+1}) | {날짜} | {변경 요약} |
```

결정 이력 섹션에 추가:
```
| {날짜} | {stage} v{N} → v{N+1} | {변경 이유} |
```

### PRD 수정 시 추가

frontmatter `approved: false`로 리셋 후:
```
⚠️ PRD가 수정되었습니다 (v{N} → v{N+1}).
approved 상태가 false로 초기화되었습니다.
검토 후 approved: true로 변경하세요.
```

---

## Constraints

- **불변 요소 보호**: Delta Context에 명시된 불변 섹션은 절대 수정 금지
- **기능 ID 연속성**: 기존 F001~Fn 번호 유지. 삭제·추가 시 append (F{n+1})
- **Archive 누적**: 이전 버전 삭제 금지 — 아카이브 섹션에 계속 누적
- **피드백 없이 실행 금지**: 피드백 없이 재작성하면 방향 없는 반복. Phase 2 수집 필수
- **Figma 시각 변경**: `/iterate figma`는 /hi-fi 스킬에 직접 위임 (use_figma 실행)

## Anti-Triggers

- 새 단계 처음 시작 → 해당 스킬 직접 실행 (`/prd`, `/user-flow` 등)
- Figma 레이아웃·컴포넌트 시각적 변경 → /hi-fi 스킬 직접 호출
- 피드백 없이 "더 좋게 해줘" → 먼저 구체적 피드백 요청
- 다른 단계로 이동 (prd → user-flow) → 해당 스킬 실행
