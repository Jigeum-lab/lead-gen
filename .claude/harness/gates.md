# 게이트 패턴 레퍼런스

지금랩 Product Agent 파이프라인에서 사용하는 게이트 패턴 정의.
모든 스킬은 이 문서의 게이트 패턴을 따른다.

---

## 1. HARD-GATE

### 정의

선행 조건이 충족되지 않으면 작업을 완전히 중단한다. 우회 옵션 없음.

### 언제 사용

- 필수 입력 파일이 없는 경우 (product-context.md, PRD.md 미존재)
- 승인 상태가 충족되지 않은 경우 (approved: false인 PRD로 다음 단계 진입 시도)
- 논리적으로 불가능한 실행 순서인 경우 (research.md 없이 PRD 작성 요청은 SOFT-GATE이지만, product-context.md 없이 어떤 단계든 시작은 HARD-GATE)

### 오류 메시지 형식

```
❌ [HARD-GATE] {이유 — 무엇이 없거나 잘못됐는지}.
{선행 작업} 먼저 완료하세요.
```

예시:
```
❌ [HARD-GATE] product-context.md가 없습니다.
/kickoff {프로젝트명} 으로 클라이언트 온보딩을 먼저 완료하세요.
```

```
❌ [HARD-GATE] PRD가 미승인 상태(approved: false)입니다.
PRD 검토 후 frontmatter의 approved: false → true로 변경하세요.
```

```
❌ [HARD-GATE] ia-userflow.md가 없습니다.
/user-flow 를 먼저 실행하세요.
```

### HARD-GATE 통과 조건

오류 메시지에 명시된 선행 작업 완료 후 다시 스킬 실행.
HARD-GATE는 자동으로 재시도하지 않는다.

---

## 2. SOFT-GATE

### 정의

권장 선행 조건이 충족되지 않았지만, 사용자 선택으로 진행 가능하다.
경고를 표시하고 AUQ로 의사 결정을 위임한다.

### 언제 사용

- 선택적 입력이 없는 경우 (research.md 없이 PRD 작성)
- 승인된 산출물을 수정하려는 경우 (approved PRD를 /iterate로 변경)
- 권장 순서를 건너뛰는 경우 (user-flow 없이 wireframe 시작)
- 되돌리기 어려운 작업 전 확인이 필요한 경우

### 오류 메시지 형식

```
⚠️ [SOFT-GATE] {경고 내용 — 무엇이 부족하고 어떤 영향이 있는지}
```

이후 바로 AUQ:
- "{권장 선행 작업} 먼저 진행"
- "{현재 요청} 그대로 진행"

예시:
```
⚠️ [SOFT-GATE] research.md가 없습니다. 리서치 없이 PRD를 작성하면
시장 검증·경쟁사 분석이 빠진 요구사항이 될 수 있습니다.
```

```
⚠️ [SOFT-GATE] 이 PRD는 이미 승인(approved: true)된 상태입니다.
수정하면 approved: false로 되돌아가며, 하위 단계(/user-flow, /functional-spec)도
재작업이 필요할 수 있습니다.
```

### SOFT-GATE 통과 조건

사용자가 AUQ에서 "그대로 진행" 선택 시 즉시 통과.
통과 사실을 로그에 남긴다:
```
[SOFT-GATE 통과] {이유} — 사용자 선택으로 진행.
```

---

## 3. Output Gate

### 정의

대상 파일이 이미 존재할 때 작업 방향을 사용자에게 확인한다.
덮어쓰기 사고를 방지하는 게이트.

### 언제 사용

모든 스킬의 첫 번째 또는 두 번째 Phase에서, 출력 파일 존재 여부 확인 후 실행.

### 파일 존재 시 표시 내용

```
{파일명} 이 이미 존재합니다.
- 버전: {frontmatter version}
- 최종 수정: {created/updated date}
- 상태: {approved: true/false 또는 완성 화면 수 등}
```

### 표준 AUQ 옵션 (3종)

스킬에 따라 일부 조정 가능:

| 옵션 | 의미 |
|---|---|
| 기존 수정 (/iterate {stage}) | 현재 파일 유지하며 피드백 기반 수정 |
| 다음 단계 진행 | 현재 파일을 입력으로 다음 파이프라인 단계 실행 |
| 새로 작성 (기존 아카이브) | 기존 내용 Archive 섹션으로 이동 후 초안부터 재작성 |

### Output Gate 통과 후

- "기존 수정" → /iterate {stage} 실행
- "다음 단계" → 해당 다음 스킬 실행 또는 안내
- "새로 작성" → 기존 내용을 파일 하단 `## Archive` 섹션으로 이동 후 Phase 진행

---

## 4. Quality Gate

### 정의

에이전트 산출물이 완료된 후 품질 기준을 점검하는 게이트.
기준 미달 시 해당 에이전트를 재실행하거나 사용자에게 통보한다.

### 언제 사용

각 스킬의 마지막 저장 단계 전, 에이전트 출력물을 검토할 때.

### PRD 품질 게이트

```
PRD 품질 게이트:
☐ P0 기능 전체에 완료 기준 있음
☐ 각 P0 기능에 엣지케이스 3개 이상 (빈 상태·에러·권한 없음 포함)
☐ [확인 필요] / [결정 필요] 항목이 있으면 §6 개방 질문 섹션에 등록됨
☐ 비기능 요구사항 섹션(§5) 있음
☐ 비목표(§1) 명시됨
☐ 수치 없는 일정·공수에 [확인 필요] 마커 붙어 있음
```

### 기능명세서 품질 게이트

```
기능명세서 품질 게이트:
☐ 모든 기능에 F001~Fn ID 부여됨
☐ 7컬럼 표 형식 유지 (기능ID·화면명·트리거·입력값·처리·출력·엣지케이스)
☐ 4종 상태 정의 (정상·로딩·빈 상태·에러)
☐ 브레이크포인트 분기 (Mobile/PC) 또는 "공통" 명시
☐ 기능 간 의존성 명시 (있는 경우)
```

### 와이어프레임 품질 게이트

```
와이어프레임 품질 게이트:
☐ 화면 ID 체계 (PC200001, M200001) 적용됨
☐ ASCII 와이어프레임에 번호 태그 (①②③) 있음
☐ Description 패널이 번호 태그와 1:1 매핑됨
☐ 각 영역에 표출 데이터·인터랙션·상태 명시됨
☐ placeholder("내용 입력") 없음
```

### 품질 게이트 미달 시 처리

```
⚠️ [QUALITY GATE 미달] 다음 항목이 기준을 충족하지 않습니다:
- {미달 항목 1}
- {미달 항목 2}

→ 자동 재작업: {해당 에이전트} 재실행 중...
```

자동 재작업이 2회 이상 실패하면 사용자에게 보고하고 중단.

---

## 5. Approval Gate

### 정의

frontmatter의 `approved` 필드로 단계 진입을 통제하는 게이트.
현재 `approved` 필드를 사용하는 파일: PRD.md, functional-spec.md

### 규칙

| 상태 | 의미 | 허용 작업 |
|---|---|---|
| `approved: false` | 검토 대기 / 미승인 | /iterate (수정), 동일 단계 재작업 |
| `approved: true` | 승인 완료 | 다음 단계 진입 가능 |

### PRD Approval Gate

다음 스킬은 PRD.md의 `approved: true` 확인 후 실행:
- /user-flow
- /functional-spec
- /wireframe (ia-userflow.md도 필요)

approved: false 상태에서 진입 시도:
```
❌ [HARD-GATE] PRD가 미승인 상태(approved: false)입니다.
PRD 검토 후 frontmatter의 approved: false → true로 변경하세요.
```

### Approved PRD 수정 시 (Approval Gate Reset)

/iterate prd 실행 시 approved: true → false 자동 리셋 + 사용자 고지:
```
⚠️ PRD가 수정되었습니다 (v{N} → v{N+1}).
approved 상태가 false로 초기화되었습니다.
검토 후 approved: true로 변경하세요.
다음 단계 스킬(/user-flow, /functional-spec)은 재승인 후 실행 가능합니다.
```

---

## 6. Model Selection Gate

### 정의

작업 유형에 따라 적절한 모델을 선택하는 게이트.
비용·속도·품질의 트레이드오프를 최적화한다.

### 모델 선택 기준

| 모델 | 용도 | 작업 유형 |
|---|---|---|
| claude-opus-4-8 | 오케스트레이터 | 복잡한 판단·계획·에이전트 조율·모호한 요구사항 해석 |
| claude-sonnet-4-6 | 주력 작성·설계 | PRD 작성, IA 설계, 기능명세서, 와이어프레임 ASCII, 비평 |
| claude-haiku-4-5-20251001 | 검증·포맷·압축 | 컨텍스트 압축, 품질 게이트 체크리스트, 마커 확인, 형식 교정 |

### Model Selection Gate 규칙

**Haiku 사용 조건**:
- 컨텍스트 압축 (5,000자 이상 문서 요약)
- 품질 게이트 체크리스트 실행
- frontmatter 파싱·버전 증가 계산
- 단순 포맷 변환 (불릿 → 표 등)

**Sonnet 사용 조건**:
- 모든 창작·작성·설계 작업
- devils-advocate Phase 1·3 (초안·합성)
- Delta Context 기반 수정

**Opus 사용 조건**:
- 파이프라인 전체 조율 (오케스트레이터 역할)
- 복수 에이전트 간 충돌 해소
- 모호한 요구사항의 해석 결정

### 비용 절감 원칙

반복적·기계적 작업은 Haiku로 먼저 시도.
Haiku 결과가 품질 기준 미달 시에만 Sonnet으로 에스컬레이션.
Opus는 판단이 필요한 경우에만 — 문서 작성에 Opus 사용 금지.
