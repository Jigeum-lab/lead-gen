# 컨텍스트·하네스 엔지니어링 원칙 (Skein API · 백엔드)

이 디렉터리(`.claude/harness/`) 전체의 **개념적 기준점**. 나머지 harness 문서(context-engineering·gates·model-routing·sub-agent-patterns)와 모든 스킬은 여기서 정의한 원칙 위에서 동작한다.

> 조사·검증일: 2026-06-15. 1차 출처는 Anthropic 공식 엔지니어링 글에서 **원문 인용 대조**했고, 모델 ID는 현재 실행 환경의 권위값과 대조했다. 출처 목록은 `docs/research-log.md`.

---

## 0. 세 계층: 프롬프트 → 컨텍스트 → 하네스

용어 혼동을 막기 위해 출처를 정확히 둔다.

| 계층 | 무엇을 다루나 | 범위 | 출처/귀속 |
|---|---|---|---|
| **프롬프트 엔지니어링** | 단일 지시문을 잘 쓰는 법 | 1회 상호작용 | 일반 용어 |
| **컨텍스트 엔지니어링** | 추론 시점에 들어갈 토큰 집합의 큐레이션·유지 | 하나의 컨텍스트 윈도우, 여러 턴에 걸쳐 | **Anthropic** 용어 (2025-09-29) |
| **하네스(harness)** | 모델을 둘러싼 실행 환경 — 도구·제어흐름·검증·핸드오프·종료조건 | **여러 컨텍스트 윈도우**에 걸쳐 | Anthropic는 "harness"/"effective harnesses"(2025-11-26). "**harness engineering**"이라는 브랜드 용어는 **OpenAI**(Ryan Lopopolo, 2026-02)에서 나옴 |

**중요한 귀속 주의**:
- "컨텍스트 엔지니어링"은 Anthropic이 정의·대중화한 용어다.
- "하네스 엔지니어링(harness engineering)"은 **Anthropic 용어가 아니다.** Anthropic은 "harness"라고만 쓴다. 브랜드화된 "harness engineering"은 OpenAI Codex 팀에서 나왔고("Humans steer. Agents execute."), 프롬프트→컨텍스트→하네스의 깔끔한 3계층 분류는 **제3자(Augment/Milvus/커뮤니티)의 종합**이다. 본 문서는 그 분류를 채택하되 출처를 분리 표기한다.

이 프로젝트의 `.claude/harness/`는 위 의미의 **하네스 계층**이다 — 스킬·서브에이전트·게이트·모델 라우팅을 통해 모델을 둘러싼 실행 환경을 설계한다.

---

## 1. 컨텍스트 엔지니어링 핵심 원칙 (Anthropic, 원문 대조)

> 1차 출처: Anthropic, "Effective context engineering for AI agents" (2025-09-29). 아래 인용은 원문 WebFetch로 대조함(2026-06-15).

1. **최소 고신호 토큰 집합** — "find the smallest set of high-signal tokens that maximize the likelihood of some desired outcome." 모든 컨텍스트 구성요소(시스템 프롬프트·도구·예시·히스토리)에 적용. 더 많이 넣는 게 아니라, **신호 대비 노이즈를 최소화**한다.

2. **어텐션 예산(attention budget)** — "LLMs have an 'attention budget' that they draw on when parsing large volumes of context." 컨텍스트는 무한 자원이 아니다. 트랜스포머의 n² 토큰 상호작용·짧은 시퀀스 편향 때문에 길수록 비싸진다.

3. **컨텍스트 부패(context rot)** — 윈도우의 토큰 수가 늘수록 정확한 회수 능력이 떨어진다. 그래서 "전부 넣기"가 아니라 **공격적 큐레이션**이 정답.

4. **올바른 고도(right altitude)** — "specific enough to guide behavior effectively, yet flexible enough to provide the model with strong heuristics." 두 실패 모드를 피한다: (a) 깨지기 쉬운 하드코딩 if-else, (b) 신호 없는 막연한 지침. 섹션(배경·지시·도구 가이드·출력 형식)으로 구조화.

5. **도구는 최소·명확·토큰 효율** — "bloated tool sets that cover too much functionality or lead to ambiguous decision points about which tool to use"가 흔한 실패. 도구는 자기완결적이고 파라미터가 모호하지 않아야 한다.

6. **예시는 정전(canonical)만, 엣지케이스 나열 금지** — few-shot은 강력히 권장하되 "laundry list of edge cases"를 채우지 말 것. "examples are the 'pictures' worth a thousand words."

### 장기 작업(long-horizon) 기법

7. **컴팩션(compaction)** — "taking a conversation nearing the context window limit, summarizing its contents, and reinitiating a new context window with the summary." 아키텍처 결정·미해결 버그·구현 디테일은 보존, 중복 도구 출력은 폐기. **회수율(recall) 최대화 먼저, 그 다음 정밀도.**
   - 이 프로젝트 대응: `CLAUDE.md`의 "컴팩션 시 수정 파일·테스트 명령 보존" 규약 + 프로젝트 루트 CLAUDE.md는 컴팩션 후 자동 재주입됨(공식 동작).

8. **구조화된 노트(외부 메모리)** — 에이전트가 컨텍스트 밖 파일에 노트를 쓰고 나중에 다시 불러온다(예: `NOTES.md`).
   - 이 프로젝트 대응: 파이프라인 산출물(`product/{feature}/manifest.md` 등)이 곧 외부 메모리. `sub-agent-patterns.md` §6 참조.

9. **서브에이전트 = 컨텍스트 방화벽(context firewall)** — "Each subagent might explore extensively, using tens of thousands of tokens or more, but returns only a condensed, distilled summary of its work (often 1,000-2,000 tokens)." 메인 에이전트는 고수준 계획만 들고, 탐색·조사는 깨끗한 컨텍스트의 서브에이전트에 위임.
   - 이 프로젝트 대응: 광범위 탐색·리서치·리뷰는 `.claude/agents/`와 병렬 서브에이전트에 위임(`sub-agent-patterns.md`).

10. **JIT(just-in-time) 회수** — "maintain lightweight identifiers (file paths, stored queries, web links, etc.) and use these references to dynamically load data into context at runtime using tools." 전부 미리 적재하지 말고, 파일 경로·식별자만 들고 필요할 때 로드.
    - 이 프로젝트 대응: `.claude/rules/`의 **경로 스코프 규칙**(매칭 파일을 읽을 때만 로드) + `context7` MCP(라이브러리 문서는 메모리 대신 필요 시 조회).

---

## 2. 에이전트/워크플로우 패턴 (Anthropic, "Building effective agents", 2024-12-19)

가장 중요한 조언: **"가능한 가장 단순한 해법을 찾아라."** 성공한 구현은 복잡한 프레임워크가 아니라 "simple, composable patterns"였다. 에이전트적 복잡도는 **증명된 필요가 있을 때만** 추가한다.

| 패턴 | 정의 | 이 프로젝트 적용 |
|---|---|---|
| **프롬프트 체이닝** | 순차 LLM 호출, 단계 사이에 프로그램적 게이트 | 파이프라인 kickoff→research→prd→… (`gates.md`) |
| **라우팅** | 입력 분류 후 전용 경로로 분기 | 스킬 트리거(when_to_use)·서브에이전트 위임 |
| **병렬화(섹셔닝)** | 독립 하위작업 동시 실행 | `/research` 3-에이전트 병렬 (`sub-agent-patterns.md` §1) |
| **병렬화(보팅)** | 같은 작업 여러 번 → 다양한 출력 종합 | DA의 K=3 독립 비평 (`devils-advocate`) |
| **오케스트레이터-워커** | 중앙 LLM이 예측 불가 하위작업을 동적 분해·위임·종합 | 본 세션 같은 리모델링·다영역 리서치 |
| **평가자-최적화자** | 생성 LLM + 평가 LLM 루프 | PRD 크리틱 루프 (`sub-agent-patterns.md` §2) |

---

## 3. 하네스 계층 구성요소 (Anthropic "effective harnesses" + 제3자 종합)

여러 컨텍스트 윈도우/세션에 걸친 작업을 지탱하는 구조물:
- **시스템 프롬프트/규칙 파일** — `CLAUDE.md`(전 세션 자동 로드), `.claude/rules/`(경로 스코프 JIT 주입)
- **도구·MCP 선택** — `.mcp.json`(context7·supabase·github), 미사용 서버는 제거(컨텍스트 비용)
- **서브에이전트(컨텍스트 방화벽)** — `.claude/agents/`
- **훅(결정적 제어)** — `settings.json` hooks. CLAUDE.md는 "유도", 훅은 "강제". 반드시 특정 시점에 실행돼야 하는 것은 훅으로.
- **제약 하네스** — 린터·타입시스템(`npm run lint`/`npm run build`), TypeORM `synchronize: false`
- **피드백 루프** — 구조화된 에러 신호(빌드·테스트·리뷰어 출력)
- **품질/페이즈 게이트** — `gates.md`
- **Plan→Execute→Verify** — 검증 에이전트로 마무리(`verifier`/`test-engineer`)

**원칙**: 모델이 따르길 "바라는" 것은 컨텍스트(CLAUDE.md/rules)로, 반드시 일어나야 하는 것은 하네스(hook/gate/lint)로 — 공식 문서가 명시하듯 CLAUDE.md는 강제 계층이 아니다.

---

## 4. 1차 출처

상세 인용·접근일자는 `docs/research-log.md`. 핵심:
1. Anthropic — "Effective context engineering for AI agents" — anthropic.com/engineering/effective-context-engineering-for-ai-agents — 2025-09-29
2. Anthropic — "Effective harnesses for long-running agents" — anthropic.com/engineering/effective-harnesses-for-long-running-agents — 2025-11-26
3. Anthropic — "Building effective agents" — anthropic.com/research/building-effective-agents — 2024-12-19
4. OpenAI — "Harness engineering" (Ryan Lopopolo) — openai.com/index/harness-engineering — 2026-02 *(harness engineering 용어 출처)*
5. Claude Code Docs — Skills/Memory/Hooks/Settings — code.claude.com/docs — 접근 2026-06-15
