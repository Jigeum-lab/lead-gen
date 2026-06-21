# Claude Code 셋업 — Skein API (딥서치 기반)

이 디렉터리의 Claude Code 구성과 근거. (조사일: 2026-06-14)

## 무엇을 깔았나
| 구성 | 파일 | 목적 |
|---|---|---|
| 프로젝트 규약 | `CLAUDE.md` | 아키텍처·테넌트 격리·보안·명령어·컨벤션. 모든 세션에 자동 로드 |
| 서브에이전트 | `.claude/agents/*.md` | `nestjs-reviewer`·`security-reviewer`·`test-engineer`·`db-migration` |
| 권한 | `.claude/settings.json` | 안전 명령 allow + `.env`/`.pem` Read deny(시크릿 보호) |
| MCP | `.mcp.json` | `context7`(문서)·`supabase`(공식 커넥터, read-only)·`github` |

## 근거 (조사 요약)
- **서브에이전트는 프로젝트 스코프(`.claude/agents/`)로 커밋**해 팀이 컨벤션을 공유. 도구를 최소로 제한하면 안전·예측가능. 코드베이스 탐색을 위임해 컨텍스트 절약. ([Claude Code Docs](https://code.claude.com/docs/en/sub-agents), [Best practices](https://code.claude.com/docs/en/best-practices))
- **리뷰·테스트 에이전트 분리**가 표준: 읽기전용 리뷰어 + 실행 가능한 테스트러너. 코드 작성 직후 리뷰어 호출. ([Tembo 2026 가이드](https://www.tembo.io/blog/claude-code-subagents))
- **Supabase는 공식 Claude 커넥터(2026-02)**, 32개 툴(SQL·스키마·엣지함수). LLM-DB 연결은 위험하니 **`--read-only`** 권장. ([Supabase 발표](https://supabase.com/blog/supabase-is-now-an-official-claude-connector))
- **Postgres/DB MCP는 restricted(read-only) 모드 필수** — 거버넌스 없는 쓰기 접근은 사고 위험. ([Strac](https://www.strac.io/blog/postgres-mcp-server)) → 여기선 Supabase MCP(read-only)로 통합, 별도 Postgres MCP는 고급 튜닝 필요 시 `postgres-mcp`(Crystal DBA, `--access-mode=restricted`) 추가.
- **CLAUDE.md에 컴팩션 규칙 명시**(수정 파일·테스트 명령 보존)로 장기 세션 컨텍스트 보호. ([SmartScope](https://smartscope.blog/en/generative-ai/claude/claude-code-best-practices-advanced-2026/))

## 활성화 (MCP 키 — 시크릿이라 커밋 안 함)
MCP 서버는 `.mcp.json`에 env 플레이스홀더만 있다. 아래를 셸 env 또는 `.claude/settings.local.json`(gitignore)에 넣어야 동작:
```
SUPABASE_PROJECT_REF=<ref>
SUPABASE_ACCESS_TOKEN=<personal access token>   # Supabase 대시보드 → Account → Access Tokens
GITHUB_PERSONAL_ACCESS_TOKEN=<github PAT>
```
`context7`는 키 불필요(바로 동작).

## 사용 팁
- 코드 작성 후: `@nestjs-reviewer`로 리뷰, 인증/DB 변경엔 `@security-reviewer`.
- 새 테이블: `@db-migration`. 새 모듈 로직 후: `@test-engineer`.
- NestJS/TypeORM/Supabase API가 헷갈리면 `context7`로 최신 문서 조회(메모리 의존 금지).

---

## 엔지니어링 계층 + 설계 파이프라인 전수 (2026-06-14 추가)

front-end(`skein_front-end/.claude/`)의 **Product Agent 엔지니어링**을 NestJS 백엔드 도메인으로 각색해 이식. 기존 셋업(CLAUDE.md·agents·settings·MCP)은 그대로 유지하고 **추가**만 했다.

### 추가된 것
| 구성 | 위치 | 목적 |
|---|---|---|
| **harness/** (4) | `.claude/harness/` | 메타 엔지니어링 — `context-engineering`(4-레이어 컨텍스트·압축·델타·오염방지), `gates`(HARD/SOFT/Output/Quality/Approval/Model), `model-routing`(Opus 4.8/Sonnet 4.6/Haiku 4.5/Fable 5/WebSearch), `sub-agent-patterns`(병렬리서치·크리틱루프·전문가앙상블·파일기반 상태공유) |
| **skills/** (6) | `.claude/skills/` | `kickoff`(파이프라인 진입), `research`, `prd`(API 요구), `devils-advocate`(적대적 비평), `osint-deepsearch`(딥서치+레퍼런스 2종), `iterate`(피드백 루프) |

### 백엔드 API 설계 파이프라인
`kickoff → research → prd → api-contract → data-model → 구현 → qa`
- 01~03은 전수된 스킬(`/kickoff` `/research` `/prd`)이 담당. 비평은 `/devils-advocate`, 심층 리서치는 `/osint-deepsearch`, 수정은 `/iterate`.
- 04 API 계약(`api-contract.md`)은 현재 전용 스킬 미구현 — Sonnet 수동 + `gates.md` 계약 품질 게이트로 검증.
- 05 데이터 모델은 `@db-migration`, 07 QA는 리뷰어 앙상블(`@nestjs-reviewer`+`@security-reviewer`+`@test-engineer`, `sub-agent-patterns.md` §3).
- 산출물 경로: `product/{feature}/`.

### 의도적으로 제외 (프론트/디자인 전용 — 백엔드 부적합)
`wireframe`·`hi-fi`·`design-system`·`theme-factory`·`ui-ux-pro-max`·`brand-guidelines`·`user-flow`·`functional-spec`(화면 기준) 및 ux-designer/ux-researcher/content-writer 에이전트.

---

## 딥서치 리모델링 완료 (2026-06-15)

위 인계 TODO 5개를 딥서치(4개 병렬 서브에이전트) + **1차 출처 원문 재대조**로 수행. 근거 원장: `docs/research-log.md`.

| 인계 TODO | 처리 |
|---|---|
| 1. 모델 ID 재대조 | ✅ 실행 환경 권위값과 대조 완료 — `claude-opus-4-8`/`sonnet-4-6`/`haiku-4-5-20251001`/`fable-5`. model-routing·gates 디스클레이머 제거 |
| 2. Karpathy 스킬 참고 | ✅ 실체 확인(단일 스킬 4원칙, author=forrestchang) → `skills/karpathy-guidelines/` 백엔드 각색 신설 |
| 3. api-contract 등 전용 스킬 | ✅ `skills/api-contract/`(04 단계 공백) 신설. data-model→`@db-migration`, qa→리뷰어 앙상블 유지(설계상 충분) |
| 4. 공식문서 기반 전반 개선 | ✅ `harness/backend-reference.md` 신설(검증된 NestJS11/TypeORM/Supabase/OWASP 사실), CLAUDE.md JWT·MCP 교정 |
| 5. 딥서치 + 재검토 | ✅ Anthropic 원문 인용 축자 대조, Karpathy/skills 원문 대조, 한계는 research-log §6에 분리 |

### 이번에 추가/변경된 것
| 구성 | 위치 | 목적 |
|---|---|---|
| **principles.md** (신설) | `.claude/harness/` | 개념 기준점 — 프롬프트→컨텍스트→하네스 3계층(정확한 출처 귀속) + Anthropic 핵심 원칙 |
| **backend-reference.md** (신설) | `.claude/harness/` | 검증된 백엔드 사실 — 리뷰어·계약/구현 스킬이 참조 |
| **karpathy-guidelines** (신설) | `.claude/skills/` | 4원칙(Think/Simplicity/Surgical/Goal) 백엔드 각색 |
| **api-contract** (신설) | `.claude/skills/` | 파이프라인 04 계약 설계 — 게이트+DA+품질게이트 내장 |
| **rules/tenancy.md** (신설) | `.claude/rules/` | 경로 스코프(JIT) — 모듈·인증·공통 코드 편집 시 테넌시 불변식 주입 |
| **PostToolUse 훅** | `.claude/settings.json` | 편집된 `.ts` 한정 `eslint --fix`(결정적 제어) |
| harness 4종 + CLAUDE.md | (편집) | 출처 그라운딩·모델ID 검증·JWT 비대칭 교정 |

### 핵심 개념 교정
- "harness engineering"은 **OpenAI 용어**(Anthropic 아님). Anthropic은 "context engineering" + "harness". → principles.md §0에 분리 표기.
- JWT는 **비대칭 JWKS**로 검증(공유 HS256 아님). Supabase 신규 기본값 2025-10-01~.

### 다음 재검토 후보 (선택)
- 레거시 Supabase service_role 키 → `sb_secret_*` 마이그레이션(2026년 말 폐기 전).
- `package.json`의 `typeorm: "^1.0.0"` 버전 불일치 확인(리모델 범위 밖).
