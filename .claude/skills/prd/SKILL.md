---
name: prd
description: >
  product-context.md를 기반으로 PRD(제품 요구사항 문서)를 작성하는 전체 파이프라인 스킬.
  컨텍스트 조립 → prd-writer 초안 → devils-advocate 비평 → 수정 → 저장 순서로 실행.
  "PRD 작성해줘", "제품 요구사항 문서 만들어줘", "기능 요구사항 정리해줘", "PRD 써줘",
  "요구사항 정의" 등 PRD·제품 요구사항 관련이면 어떤 표현이든 트리거.
  prd-template(형식 참조용)·functional-spec(PRD 완성 후 다음 단계)·user-flow와 혼용 금지.
type: encoded-preference
version: 1.0.0
---

# PRD Skill

product-context.md → research.md(선택) → PRD 초안 → DA 비평 → 수정 → PRD.md 저장.

포맷 참조: `/prd-template` 스킬 (문서 구조·섹션 순서·작성 원칙)

---

## Phase 1 — Input Gate

### Phase 1-A: HARD-GATE (필수)

`product/{project}/product-context.md` 존재 여부 확인.

미존재 시:
```
❌ [HARD-GATE] product-context.md가 없습니다.
/kickoff {프로젝트명} 으로 클라이언트 온보딩을 먼저 완료하세요.
```

### Phase 1-B: SOFT-GATE (research.md)

`product/{project}/research.md` 미존재 시:
```
⚠️ [SOFT-GATE] research.md가 없습니다. 리서치 없이 PRD를 작성하면 시장 검증이 빠집니다.
```
AUQ: "리서치 먼저 진행 | 리서치 없이 PRD 작성"

→ "리서치 없이 PRD 작성" 선택 시 Layer 2 컨텍스트 없이 진행.

### Phase 1-C: Output Gate

`product/{project}/PRD.md` 존재 시:
- 파일 로드 → frontmatter의 version·approved 상태 한 줄 표시
- AUQ: "기존 PRD 수정(/iterate prd) | 다음 단계(/user-flow)로 진행 | 새로 작성 (기존 아카이브)"

"새로 작성" 선택 시만 아래 Phase 진행.

---

## Phase 2 — Context Assembly

### 2-A: Layer 1 — 프로젝트 컨텍스트

`product/{project}/product-context.md` 전체 읽기 → 주입 템플릿에 포함.

### 2-B: Layer 2 — 리서치 컨텍스트 (있는 경우)

`product/{project}/research.md` 읽기 후 크기 기반 처리:

| 크기 | 처리 방법 |
|---|---|
| <5,000자 | 전체 포함 |
| 5,000~15,000자 | Haiku 모델로 30% 압축 |
| >15,000자 | 섹션별 요약 + "전체 내용은 research.md 참조" 명시 |

압축 프롬프트 (Haiku용):
```
다음 리서치 문서의 핵심만 {원본의 30%} 이내로 요약하세요.
수치·경쟁사명·시장 규모·핵심 인사이트는 반드시 포함하세요.
---
{research.md 내용}
```

### 2-C: 주입 템플릿 조립

```
=== [LAYER 1: PROJECT CONTEXT] ===
{product-context.md 전체}

=== [LAYER 2: STAGE INPUTS] ===
{research.md 전체 또는 압축본 — 없으면 이 섹션 생략}

=== [LAYER 3: CURRENT TASK] ===
다음 조건으로 PRD를 작성하세요:
- 형식: /prd-template 스킬의 7개 섹션 구조 준수
- P0 기능 전체에 완료 기준·정상 흐름·엣지케이스·에러 처리 포함 (필수)
- 미확인 사항은 [확인 필요: {내용}] / [결정 필요: {내용}] 마커 사용
- 수치 근거 없는 일정·공수 임의 기재 금지
- "혁신적", "차별화된" 같은 빈 수식어 금지

출력 경로: product/{project}/PRD.md
완료 기준: P0 기능 전체 + 엣지케이스 + 완료 기준 포함
```

---

## Phase 3 — PRD 초안 작성 (prd-writer 에이전트)

Phase 2에서 조립한 컨텍스트를 prd-writer 에이전트에 주입하여 초안 생성.

prd-writer 산출물 필수 조건 (각 P0 기능당):
- **완료 기준**: 공수·범위·제약 한 줄 명시
- **정상 흐름**: 단계별 동작 설명
- **엣지케이스**: 3개 이상 (빈 상태 / 권한 없음 / 입력 오류 포함)
- **에러 처리**: API 실패·네트워크 오류·타임아웃

초안 완성 시 임시 저장 후 Phase 4 진행 (사용자에게 노출하지 않음).

---

## Phase 4 — Devils Advocate 비평

PRD 초안 완성 직후 devils-advocate 스킬을 PRD 특화 모드로 실행. **model: opus** Agent로 스폰.

비평 집중 질문:
1. 범위가 불명확한 기능은? (P0/P1 경계 모호한 것)
2. product-context.md의 기술 제약과 충돌하는 기능은?
3. 누락된 엣지케이스는? (특히 인증·권한·데이터 없음 케이스)
4. 완료 기준이 검증 불가능한 기능은?
5. 비목표 섹션에 있어야 할 것이 기능으로 들어온 것은?

devils-advocate Phase 1~3 실행 후 비평 리포트 생성:
```
## PRD 비평 리포트

### 수정 필요 (High)
- [기능명/섹션]: {구체적 문제} → {권고 수정 방향}

### 검토 권장 (Medium)
- [기능명/섹션]: {문제} → {권고}

### 참고 (Low)
- [내용]

### 판정: {수정 권장 | 일부 수정 후 저장 | 그대로 저장}
```

비평 리포트를 사용자에게 표시.

---

## Phase 5 — 수정 결정

비평 리포트 표시 후 AUQ:
- "비평 전체 반영해서 수정"
- "특정 항목만 선택해서 수정"
- "비평 무시하고 그대로 저장"

### "비평 전체 반영" 선택 시

Delta Context 조립 후 prd-writer 재실행:
```
=== [DELTA CONTEXT] ===
현재 PRD 요약: {초안 핵심 요약 — 기능 목록 + P0 개수}
변경 요청: {비평 리포트 High+Medium 항목 전체}
변경 대상: {해당 섹션 또는 기능명}
불변 요소: {비평에서 언급되지 않은 섹션 전체}
변경 이유: devils-advocate 비평 결과 반영
```

### "특정 항목만 수정" 선택 시

수정할 비평 항목 번호 선택 → 해당 항목만 Delta Context에 포함.

### "그대로 저장" 선택 시

Phase 6으로 바로 진행.

---

## Phase 6 — 저장

### PRD.md frontmatter

```yaml
---
project: {프로젝트명}
type: PRD
created: YYYY-MM-DD
version: v1.0
approved: false
scope: P0 기능 {N}개
prd_writer: prd-writer
da_reviewed: true
---
```

### 저장 후 필수 고지

```
⚠️ PRD 검토 후 frontmatter의 approved: false → true로 변경하세요.
approved: true가 되어야 다음 단계(/user-flow, /functional-spec) 진행 가능합니다.

현재 상태: approved: false (검토 대기)
다음 단계: PRD 내용 검토 → approved: true 변경 → /user-flow 또는 /functional-spec 실행
```

### manifest.md 업데이트

`product/{project}/manifest.md` PRD 행:
```
| PRD | 🔄 검토 대기 (approved: false) | {날짜} | v1.0 | P0 {N}개 |
```

---

## Constraints

- **prd-template 형식 강제**: 7개 섹션 구조 준수. 섹션 누락·순서 변경 금지
- **P0 기능 4요소 필수**: 완료 기준·정상 흐름·엣지케이스·에러 처리 — 하나라도 빠지면 Phase 3 재실행
- **[확인 필요] 마커**: 수치·일정·기술 스펙 미확인 항목 반드시 표기
- **approved: false 초기값**: 저장 시 항상 false. 수동으로만 true 변경
- **DA 생략 금지**: Phase 4는 항상 실행. 사용자가 "비평 없이 바로 저장" 요청해도 DA 리포트는 표시

## Anti-Triggers

- 기능명세서 작성 → `/functional-spec` 스킬
- IA·유저 플로우 설계 → `/user-flow` 스킬
- PRD 부분 수정·피드백 반영 → `/iterate prd` 스킬
- 형식만 필요 → `/prd-template` 스킬
