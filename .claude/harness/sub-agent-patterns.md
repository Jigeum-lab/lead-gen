# 서브에이전트 패턴 레퍼런스

지금랩 Product Agent 파이프라인에서 사용하는 서브에이전트 협업 패턴 정의.

---

## 1. 병렬 리서치 패턴 (Parallel Research Pattern)

**사용 시점**: 리서치 단계, 독립적인 조사 영역이 3개 이상일 때.

**구조 원칙**:
- 각 에이전트는 **독립적 컨텍스트**를 받는다 — 다른 에이전트의 중간 결과를 기다리지 않음.
- 교차 의존성 없음: Agent A의 결과가 Agent B의 입력이 되면 안 됨.
- 공통 입력(product-context.md)만 공유.

**토큰 관리**:
- 각 에이전트에 전체 컨텍스트가 아닌 **집중 컨텍스트**만 전달.
- 예: 시장 에이전트 → 시장 규모·TAM/SAM/SOM 관련 필드만 / 경쟁사 에이전트 → 경쟁사 관련 필드만.

**통합 방법**:
- 오케스트레이터가 모든 결과 수집.
- 중복·모순 식별 후 단일 보고서로 합성.
- 합성 시 Sonnet 사용 (대용량 컨텍스트 처리 필요).

**파이프라인 적용 예**: `/research` 스킬
```
[오케스트레이터]
    ├─ Sub-agent A: 시장 분석 (TAM/SAM/SOM, 성장률, 트렌드)
    ├─ Sub-agent B: 경쟁사 분석 (상위 5개사 포지셔닝·가격·기능)
    └─ Sub-agent C: 사용자 리서치 (페르소나·Pain Point·행동 패턴)
         ↓ (병렬 완료 후)
    [통합 → research.md]
```

---

## 2. 크리틱 패턴 (Critique Pattern)

**사용 시점**: PRD 초안·디자인 초안 완성 후 품질 검증 필요 시.

**구조 원칙**:
- Generator 에이전트가 초안 생성 → Critic 서브에이전트가 검토.
- Critic 페르소나: **적대적** — 사용자 입장에서 가장 불편한 점, 논리적 허점, 누락 요건을 찾음.
- Critic은 "좋은 점"을 먼저 말하지 않는다. 문제점만 구조화해서 출력.

**피드백 루프 제한**:
- 최대 2회 수정 사이클 (무한 루프 방지).
- 1차 수정 후 Critic이 Major 이슈 0건이면 종료.
- 2차 수정 후에는 Minor 남아도 종료 — `[개선 권고]` 태그로 별도 기록.

**파이프라인 적용 예**: `/prd` 스킬
```
prd-writer → PRD 초안
    ↓
devils-advocate → 반박 목록 (Critical·Major 이슈)
    ↓
prd-writer → 수정 (1차)
    ↓
[Major 이슈 남음?]
    ├─ YES → devils-advocate → 반박 (2차) → prd-writer → 수정 (2차) → 종료
    └─ NO → 종료
```

---

## 3. 전문가 앙상블 패턴 (Expert Ensemble Pattern)

**사용 시점**: 동일 산출물을 다수의 **전문가 관점**에서 동시에 평가해야 할 때.

**구조 원칙**:
- 각 에이전트는 **고유한 전문가 페르소나** + **고유한 평가 프레임워크**를 가짐.
- 모든 에이전트의 출력은 **동일한 스키마** (이슈ID·위치·심각도·권고) — 통합이 용이하도록.
- 에이전트 간 커뮤니케이션 없음. 독립 평가 후 오케스트레이터가 통합.

**통합 방법**:
- 오케스트레이터가 동일 이슈를 여러 에이전트가 발견한 경우 → 가장 심각한 분류로 병합.
- 최종 우선순위: Critical → Major → Minor → Info.
- 통합 판단에는 Sonnet 사용 (뉘앙스 판단 필요).

**파이프라인 적용 예**: `/qa` 스킬
```
[오케스트레이터]
    ├─ Sub-agent A: PRD 컴플라이언스 전문가 (요건 충족 체크)
    ├─ Sub-agent B: 접근성 전문가 (WCAG 2.1 AA)
    └─ Sub-agent C: UX 리서처 (닐슨 10 휴리스틱)
         ↓ (병렬 완료 후)
    [통합 → 이슈 분류 → 수정 로드맵 → qa-review.md]
```

크리틱 패턴과 차이점: 앙상블은 **수정 루프 없음** — 검토만 하고 수정은 사람이 판단.

---

## 4. 검증 패턴 (Validation Pattern — Gemini 연동)

**사용 시점**: 리서치 보고서의 수치·통계·주장을 실시간 웹 데이터로 교차 검증할 때.

**구조 원칙**:
- Claude 에이전트가 리서치 보고서에서 **검증 대상 클레임** 추출.
- Gemini Flash (Google Search 그라운딩)로 각 클레임 검증.
- 결과를 ✅/⚠️/❌로 등급화 후 보고서에 인라인 태그.

**실행 경로** (상세는 `model-routing.md` §Gemini 호출 패턴):
- 인라인 검증 → Claude **WebSearch 툴** (우선).
- 독립 2차 그라운딩 → **Gemini CLI**:
```bash
GEMINI_CLI_TRUST_WORKSPACE=true gemini --skip-trust -m gemini-2.5-flash \
  -p "{검증 주제 + 구체적 클레임 + ✅/⚠️/❌ 등급+출처 요구}" > {출력 경로} 2>/dev/null
```

**클레임 등급**:
| 등급 | 의미 |
|---|---|
| ✅ 확인됨 | 복수 신뢰 출처에서 일치 |
| ⚠️ 불일치 | 일부 출처와 다름 — 수치 재확인 필요 |
| ❌ 반박됨 | 주요 출처에서 반대 데이터 |
| ❓ 미검증 | Gemini도 신뢰 출처 못 찾음 |

**파이프라인 적용 예**: `/research` 스킬 Phase 4
```
research.md (초안)
    ↓
클레임 추출 (시장 규모·성장률·경쟁사 수치)
    ↓
WebSearch 툴로 클레임별 교차 검증
    ↓
등급 태그 인라인 삽입 → research.md (최종)
```

---

## 5. 모델 라우팅 규칙 (Model Routing Rules)

`model-routing.md` 모델 티어링 기준에 따른 실행 규칙.

| 역할 | 모델 | 사용 시나리오 |
|---|---|---|
| 오케스트레이터 | claude-opus-4-8 | 복잡한 판단·아키텍처 결정·에이전트 조율 |
| 작성·설계 | claude-sonnet-4-6 | PRD 작성·와이어프레임·리서치 보고서 합성 |
| 검증·포맷 | claude-haiku-4-5-20251001 | 컨텍스트 압축·게이트 체크·manifest 업데이트·크리틱 반박 |
| 웹 검색 | gemini-2.5-flash | 실시간 데이터 검증·경쟁사 최신 정보 |

**게이트 체크 시**: 파일 존재 여부·frontmatter 확인은 Haiku로.
**병렬 서브에이전트**: 각 에이전트는 작업 복잡도에 따라 Haiku(반복적) 또는 Sonnet(창의적) 선택.
**에스컬레이션**: Major 이슈 3건 이상 시 Opus로 최종 판단 에스컬레이션 권고.

---

## 6. 상태 공유 패턴 (Shared State Pattern)

에이전트 간 직접 메시지 전달 없음 — 파일을 통한 비동기 상태 공유.

**원칙**:
- 모든 에이전트는 **파일에 쓰고, 파일에서 읽는다** — 다른 에이전트에 직접 전달 없음.
- `manifest.md`가 **공유 상태 저장소** 역할.
- 각 에이전트는 시작 전 manifest 읽기 → 완료 후 manifest 업데이트.
- 어떤 에이전트도 manifest를 읽지 않고 다른 에이전트의 완료 상태를 가정하지 않음.

**manifest.md 업데이트 규칙**:
1. 에이전트 시작: 해당 행 `🔄 진행중`으로 변경
2. 에이전트 완료: 해당 행 `✅ 완료` + 버전 + 날짜 기입
3. 에이전트 실패: 해당 행 `❌ 블로킹` + 이유 1줄 기입

**파일 귀속**:
```
product/{project}/manifest.md        ← 공유 상태 (모든 에이전트 읽기·쓰기)
product/{project}/product-context.md ← kickoff 스킬 전용 쓰기
product/{project}/research.md        ← product-researcher 전용 쓰기
product/{project}/PRD.md             ← prd-writer 전용 쓰기
product/{project}/ux/ia-userflow.md  ← ux-designer 전용 쓰기
product/{project}/ux/functional-spec.md ← ux-designer 전용 쓰기
product/{project}/ux/wireframes.md   ← ux-designer 전용 쓰기
product/{project}/qa-review.md       ← qa-reviewer 전용 쓰기
```
