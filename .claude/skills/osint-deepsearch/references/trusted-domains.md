# 신뢰 도메인 화이트리스트

Phase 2-A에서 `site:` 한정 쿼리로 사용하는 1차 출처 도메인 목록.

> 라이브러리 API/버전 사실은 `context7` MCP가 1순위. 아래는 동향·비교·심층 사례·표준 확인용.

## 기술·표준 1차 출처 (백엔드·스택)

| 도메인 | 대상 |
|---|---|
| `site:docs.nestjs.com` | NestJS 공식 문서 |
| `site:typeorm.io` | TypeORM 공식 |
| `site:supabase.com/docs` | Supabase (Auth·RLS·커넥터) |
| `site:postgresql.org/docs` | PostgreSQL 공식 |
| `site:cloud.google.com/run/docs` | Cloud Run |
| `site:datatracker.ietf.org` | RFC·표준 (OAuth·JWT·HTTP) |
| `site:owasp.org` | 보안 표준·치트시트 |
| `site:github.com` | 릴리스 노트·이슈·레퍼런스 구현 |

## 한국 정부·공공 1차 출처

| 도메인 | 기관 |
|---|---|
| `site:go.kr` | 정부 통합 — 기재부·산업부·국토부 등 |
| `site:fsc.go.kr` | 금융위원회 |
| `site:fss.or.kr` | 금융감독원 |
| `site:bok.or.kr` | 한국은행 |
| `site:kosis.kr` | 통계청 |
| `site:keit.re.kr` | 산업기술평가관리원 |
| `site:kisa.or.kr` | 한국인터넷진흥원 (보안·개인정보) |
| `site:pipc.go.kr` | 개인정보보호위원회 |
| `site:nia.or.kr` | 한국지능정보사회진흥원 |
| `site:kotra.or.kr` | 대한무역투자진흥공사 |

## 글로벌 1차 출처

| 도메인 | 기관 |
|---|---|
| `site:arxiv.org` | 학술 프리프린트 |
| `site:github.com/anthropics` | Anthropic 공식 |
| `*.edu` / `*.ac.kr` | 대학·학계 |
| `site:oecd.org` | OECD |
| `site:imf.org` | IMF |
| `site:worldbank.org` | 세계은행 |

## 적용 규칙

- 기술·표준 주제: 기술 그룹 최소 1회 탐색
- 보안·개인정보 주제: OWASP + KISA/PIPC 병행
- 한국 시장·정책 주제: 한국 그룹 최소 1회 탐색
- 글로벌 기술·학술 주제: 글로벌 그룹 적용
- 양쪽 해당 시: 양쪽 모두 탐색
- 결과 0건이어도 쿼리는 트랜스크립트에 보존 (시도 자체가 검증 일부)
