---
name: research
description: >
  product-context.md를 입력으로 시장 분석·경쟁사 분석·사용자 리서치를 3개 서브에이전트로
  병렬 실행하고 Gemini로 교차 검증 후 research.md로 통합하는 스킬.
  "리서치 해줘", "시장 조사", "경쟁사 분석", "사용자 리서치", "/research" 등
  리서치·시장조사·페르소나 관련이면 어떤 표현이든 트리거.
  PRD 작성·기능명세서 작성·와이어프레임 작업에는 트리거하지 않음.
type: encoded-preference
version: 1.0.0
when_to_use: >
  product-researcher와 ux-researcher 에이전트가 리서치 단계 실행 시 자동 참조.
  product-context.md 완료 후 시작.
---

# Research Skill — 병렬 리서치 + Gemini 교차 검증

3개 서브에이전트 병렬 실행 → Gemini 그라운딩 → research.md 통합 합성.

## Workflow

### Phase 1 — Input Gate (HARD-GATE)

`product/{project}/product-context.md` 존재 여부 확인.

없으면 즉시 중단:
```
❌ [HARD-GATE] product-context.md가 없습니다. /kickoff {프로젝트명} 을 먼저 완료하세요.
```

있으면 파일 전체 로드 → 아래 항목 추출:
- `target_user` → 사용자 리서치 방향
- `market` → 시장 규모·트렌드 쿼리
- `competitors` → 경쟁사 분석 대상
- `assumptions` / `constraints` → 검증 우선순위

### Phase 1-B — Output Gate

`product/{project}/research.md` 존재 시:
- 파일 로드 → 버전·날짜 한 줄 표시
- AUQ: "기존 리서치 보완·업데이트 | 다음 단계(PRD)로 진행 | 전체 재실행"
- 선택에 따라 분기. 재실행 선택 시에만 아래 Phase 진행.

### Phase 2 — 컨텍스트 조립

product-context.md에서 각 서브에이전트용 프롬프트 조립.

**공통 Layer 1 (모든 에이전트 동일):**
```
=== [LAYER 1: PROJECT CONTEXT] ===
{product-context.md 전체 내용}
```

**에이전트별 Layer 2·3:**

**Sub-agent A (시장 분석):**
```
=== [LAYER 2: RESEARCH FOCUS] ===
분석 영역: 시장 분석
시장 키워드: {product-context의 market 필드}
제품 카테고리: {product_name}이 속한 시장

=== [LAYER 3: TASK] ===
아래 항목을 조사하여 research/market.md에 저장하세요.
출력 경로: product/{project}/research/market.md

1. 시장 규모 및 성장률 (TAM/SAM/SOM, CAGR)
2. 핵심 트렌드 (기술·규제·소비자 행동 변화)
3. 기회 영역 (언더서브드 세그먼트, 신흥 니즈)
4. 시장 진입 장벽

수치는 반드시 출처 명시. 불확실한 수치는 (추정) 태그 부착.
완료 기준: 4개 항목 모두 작성, 출처 URL 포함.
```

**Sub-agent B (경쟁사 분석):**
```
=== [LAYER 2: RESEARCH FOCUS] ===
분석 영역: 경쟁사 분석
1차 경쟁사: {product-context의 competitors 필드}
제품의 핵심 기능: {key_features 필드}

=== [LAYER 3: TASK] ===
아래 항목을 조사하여 research/competitor.md에 저장하세요.
출력 경로: product/{project}/research/competitor.md

1. 주요 경쟁사 프로파일 (최대 5개): 설립연도, 규모, 주요 기능, 가격, 타깃
2. 기능 매트릭스: 우리 제품 vs 경쟁사 (핵심 기능 비교표)
3. 포지셔닝 갭: 경쟁사가 해결 못 하는 영역
4. 각 경쟁사의 강점·약점

수치(MAU, 매출, 가격)는 출처 명시. 불확실하면 (추정) 태그.
완료 기준: 경쟁사 최소 3개 분석, 기능 매트릭스 표 포함.
```

**Sub-agent C (사용자 리서치):**
```
=== [LAYER 2: RESEARCH FOCUS] ===
분석 영역: 사용자 리서치 및 페르소나
타깃 사용자: {product-context의 target_user 필드}
핵심 문제: {problem 필드}

=== [LAYER 3: TASK] ===
아래 항목을 조사하여 research/user.md에 저장하세요.
출력 경로: product/{project}/research/user.md

1. 페르소나 2~3개 (이름, 나이, 직업, 목표, 불편함, 사용 기기·채널)
2. JTBD (Jobs To Be Done): 기능적·감정적·사회적 잡 각 2~3개
3. Pain Point 우선순위 (심각도 × 빈도 매트릭스)
4. 사용자 행동 패턴 (언제, 어디서, 어떻게 유사 제품 사용)

가상 페르소나임을 명시. 실제 리서치 데이터 인용 시 출처 표기.
완료 기준: 페르소나 2개 이상, JTBD 5개 이상.
```

### Phase 3 — 병렬 서브에이전트 실행

아래 3개 서브에이전트를 동시에 실행한다 (Agent 툴을 3번 병렬 호출):

| 에이전트 | 역할 | 출력 파일 |
|---|---|---|
| Sub-agent A | product-researcher — 시장 분석 | `product/{project}/research/market.md` |
| Sub-agent B | product-researcher — 경쟁사 분석 | `product/{project}/research/competitor.md` |
| Sub-agent C | ux-researcher — 사용자 리서치 | `product/{project}/research/user.md` |

`product/{project}/research/` 디렉토리 없으면 사전 생성.

각 에이전트는 Phase 2에서 조립한 컨텍스트(Layer 1~3)를 그대로 받아 실행.

### Phase 4 — 교차 검증 (WebSearch)

서브에이전트 3개 완료 후, WebSearch 툴로 핵심 수치·주장 교차 검증.

**검증 쿼리 (WebSearch 툴 직접 사용):**
- `"{제품명} {시장명} market size TAM 2024 2025 report"`
- `"{경쟁사명} MAU revenue 2024 site:crunchbase.com OR site:similarweb.com"`
- `"{시장명} CAGR growth rate 2024 {지역}"`

검증 항목:
- 시장 규모 수치 (TAM/SAM/SOM)
- 경쟁사 MAU·매출 등 주요 지표
- 성장률·CAGR 수치

검증 결과를 `product/{project}/research/validation.md`에 저장.
신뢰도 낮음 수치는 `(확인 필요)` 마커 부착.

### Phase 5 — research.md 통합 합성

**model: opus** Agent를 스폰하여 market.md + competitor.md + user.md + validation.md를 읽고 research.md로 통합.

통합 원칙:
- 중복 내용 제거, 상충 내용은 양쪽 관점 병기
- WebSearch 검증에서 불일치 수치 → `(확인 필요)` 마커 부착
- Executive Summary는 3~5개 핵심 인사이트로 압축
- 전략적 시사점은 오케스트레이터가 직접 작성 (서브에이전트 의존 금지)

**research.md 출력 형식:**

```markdown
---
project: {프로젝트명}
type: research
created: {today}
version: v1.0
---

# {프로젝트명} 리서치 보고서

## Executive Summary
- {핵심 인사이트 1}
- {핵심 인사이트 2}
- {핵심 인사이트 3}
(최대 5개)

## 1. 시장 분석
### 1-1. 시장 규모 및 성장률
### 1-2. 핵심 트렌드
### 1-3. 기회 영역

## 2. 경쟁사 분석
### 2-1. 주요 경쟁사 (최대 5개)
### 2-2. 기능 매트릭스
### 2-3. 포지셔닝 갭

## 3. 사용자 리서치
### 3-1. 페르소나 (2~3개)
### 3-2. JTBD (Jobs To Be Done)
### 3-3. Pain Point 우선순위

## 4. 전략적 시사점
### 4-1. 제품 방향 권고
### 4-2. [확인 필요] 항목

## 출처
```

### Phase 6 — 품질 게이트 + 저장

**품질 확인 (저장 전):**
- `[확인 필요]` 마커 항목 수집 → manifest.md 미해결 항목 섹션에 기록
- 출처 없는 수치 → `(추정)` 또는 `(확인 필요)` 마커 추가
- 페르소나 2개 미만이면 Sub-agent C 재실행 요청

**파일 저장:**
- `product/{project}/research.md` — 통합 보고서
- `product/{project}/research/` — 서브에이전트 원본 파일 보존

**manifest.md 업데이트:**
- 02 리서치 행: `✅ 완료`, v1.0, 오늘 날짜
- 03 PRD 행: `⏳ 미작성`
- 미해결 항목 섹션에 `[확인 필요]` 목록 추가

**완료 안내:**
```
✅ 리서치 완료: product/{project}/research.md
[확인 필요] 항목: {n}개 → manifest.md 참조
다음 단계: /prd 로 PRD 작성
```

## Constraints

- **HARD-GATE 엄수** — product-context.md 없이 리서치 시작 금지
- **병렬 실행 필수** — 3개 에이전트를 순차가 아닌 동시 실행
- **수치 출처 필수** — 출처 없는 수치는 `(추정)` 태그, 임의 생성 금지
- **Gemini 검증 생략 금지** — 핵심 수치 교차검증은 필수 단계
- **서브에이전트 원본 보존** — research/ 폴더 삭제 금지
- **오케스트레이터 직접 합성** — 통합본(research.md)은 메인 Claude가 작성

## Anti-Triggers

- PRD 작성 → `prd-writer` 에이전트
- IA·유저 플로우 → `user-flow` 스킬
- 단순 웹 검색 → WebSearch 툴 직접 사용
