# 8개 검색 각도 가이드

Phase 2에서 각 하위 질문마다 이 8개 각도를 커버해 사각지대를 제거한다.
각도 1~3만 쓰면 "찾기 쉬운 것"만 찾게 됨 — 각도 5·8은 불편하지만 심사위원이 공격할 포인트를 미리 파악하는 데 필수.

## 각도 목록

| # | 각도 | 목적 | 쿼리 예시 |
|---|---|---|---|
| 1 | 세만틱 핵심 | 주제 의미·개념 탐색 | `"LLM 에이전트" 평가 방법론 정의` |
| 2 | 기술 키워드 | 용어·구현·API 세부 | `eval pipeline LLM benchmark 2025` |
| 3 | 최신 동향 | 최근 12~18개월 | `LLM agent evaluation after:2024-11-01` |
| 4 | 학술·공식 | 논문·정부 보고서 | `site:arxiv.org LLM evaluation framework` |
| 5 | 반대 관점 | 비판·경쟁 접근 | `LLM evaluation criticism limitations` |
| 6 | 정량 데이터 | 수치·통계·성과 지표 | `TAM 한국 핀테크 시장 규모 통계` |
| 7 | 비즈니스 사례 | 시장·도입 현황 | `LLM agent enterprise deployment 사례` |
| 8 | 한계·실패 | 알려진 문제·실패 사례 | `LLM hallucination failure known issues` |

## 리소스 제약 시 우선순위

**항상 커버 (Quick 모드):** 1 세만틱 핵심 + 3 최신 동향 + 6 정량 데이터

**Standard 모드 추가:** 2 기술 키워드 + 4 학술/공식 + 7 비즈니스 사례

**Deep 모드 추가 (심층):** 5 반대 관점 + 8 한계/실패

## 한국 주제 특이사항

각도 4(학술·공식)는 Phase 2-A 신뢰 도메인(`trusted-domains.md`)으로 대체 가능.
각도 6(정량 데이터)은 `site:kosis.kr`, `site:bok.or.kr`를 함께 사용.

## 백엔드·기술 주제 특이사항

각도별 백엔드 예시: 2 `TypeORM transaction isolation`, 4 `site:docs.nestjs.com guards` / `site:supabase.com RLS`, 5 `service_role bypass RLS security risk`, 8 `TypeORM eager loading N+1 pitfall`.
- 각도 4(공식·표준)는 라이브러리 1차 출처(`docs.nestjs.com`·`typeorm.io`·`supabase.com/docs`·`postgresql.org/docs`)를 우선. 단, API/버전 단순 조회는 `context7` MCP가 더 정확.
- 각도 6(정량)은 공식 벤치마크·릴리스 노트를 우선, 블로그 벤치마크는 ⚠️ 신뢰도 C 이하로 처리.
