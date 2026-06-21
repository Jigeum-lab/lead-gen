---
name: seo-geo
description: >
  LeadGenLab 사이트의 SEO + GEO(생성형 엔진 최적화) 규칙 — Astro 정적 사이트 기준.
  페이지/컴포넌트 작성·수정 시 자동 참조. 헤딩 계층(H1 단일·비스킵), 인용가능 콘텐츠 구조,
  최소 JSON-LD(Organization/WebSite/Breadcrumb/Service), OG/메타, 기각된 통념(하지 말 것)까지 포함.
  근거: 적대적 검증 딥서치(2026-06). 출처는 문서 하단.
type: encoded-preference
version: 1.0.0
when_to_use: >
  .astro 페이지·섹션·레이아웃을 만들거나 고칠 때, 헤딩·메타·구조화 데이터·랜딩 카피 구조를
  정할 때 자동 적용. "SEO 봐줘", "GEO 최적화", "헤딩 구조", "메타 태그", "구조화 데이터",
  "검색 노출", "AI 답변 노출" 등에 트리거. 콘텐츠 문구 자체 작성(content-writer)·디자인 토큰엔 미적용.
---

# SEO / GEO 규칙 (LeadGenLab · Astro)

> 모든 규칙은 적대적 검증 딥서치(2026-06)에서 **confirmed**된 것만 채택. 검증에서 **기각**된 인기 통념은
> "§6 하지 말 것"에 명시. 새 SEO 주장을 추가하기 전, 1차 출처(Google Search Central·W3C·Astro Docs)로 재확인.

## 0. 한 줄 요지

**GEO는 사실상 SEO 기본기다.** Google은 AI 기능 노출에 "AI 전용 기술 요건·특수 스키마·콘텐츠 청킹·llms.txt가
필요 없다"고 공식 확인했다. AI 노출의 진짜 변수는 **(1) 정적 HTML 렌더링**과 **(2) 콘텐츠 구조/품질**뿐이다.

## 1. 렌더링 — AI 크롤러는 JS를 실행하지 않는다 ★최우선

- Perplexity·ChatGPT(GPTBot)·Claude 등 **서드파티 AI 크롤러는 자바스크립트를 실행하지 않는다.**
  JS로 렌더된 텍스트는 이들에게 **보이지 않는다.** (Google/Gemini는 Chrome 기반이라 JS 실행 가능 — 예외)
- **규칙**: 인용·색인되어야 할 모든 텍스트(헤드라인·본문·FAQ·서비스 설명·연락처)는 **정적 HTML**에 둔다.
  - Astro 기본 `.astro` 출력 = 정적 HTML → 그대로 충족.
  - **React/Svelte 아일랜드 안에 SEO/GEO 핵심 텍스트를 두지 말 것.** 아일랜드는 인터랙션 전용.
  - `client:only`로 렌더되는 콘텐츠는 HTML에 안 남으므로 색인 대상 텍스트엔 금지.
- 빠른 점검: `npm run build` 후 `dist/<page>/index.html`을 열어 **핵심 문구가 HTML에 실제로 있는지** 확인.

## 2. 헤딩 최적화 ★중점

검증된 규칙:

1. **H1은 페이지당 정확히 하나.** 페이지의 주제목. (복수 H1이 순위를 "떨어뜨리진" 않지만 — Mueller 확인 —
   명료성·접근성을 위해 1개로 유지. "복수 H1이 토픽 신호를 약화한다"는 주장은 기각됨 → 그 프레이밍 쓰지 말 것.)
2. **계층을 건너뛰지 않는다.** `H1 → H2 → H3` 순서. **H1 다음 H3, H2 다음 H4 금지.** (W3C)
   - H2 = 챕터, H3~H6 = 그 아래 중첩 하위 섹션. 시각적 크기 때문에 레벨을 바꾸지 말 것(크기는 클래스로).
3. **타깃 키워드를 헤딩에 자연스럽게.** 단, 키워드 스터핑 금지. 사람이 읽는 문장이 우선.
4. **서술형(descriptive) 헤딩.** "특징"보다 "AVO가 브랜드를 AI 답변에 배치하는 방식"처럼 내용을 그대로 요약.
   AI가 사실을 추출하기 쉬워진다. (질문형 헤딩이 AEO에 특별히 유리하다는 주장은 검증에서 기각 1-2 →
   유용할 때만 쓰되 "마법 레버"로 취급하지 말 것. FAQ 섹션의 질문 헤더는 §3 참조.)

페이지 작성 시 헤딩 체크:

- [ ] H1이 정확히 1개인가
- [ ] 레벨 건너뜀(H1→H3, H2→H4)이 없는가
- [ ] 각 헤딩이 아래 내용을 서술하는가 (장식·키워드 나열이 아님)
- [ ] H1에 페이지 핵심 주제(예: "AVO", "AI 가시성 최적화")가 자연스럽게 들어가는가
- [ ] 헤딩 텍스트가 정적 HTML인가 (아일랜드 내부 아님)

## 3. 인용가능(citeable) 콘텐츠 구조

- AI 인용을 좌우하는 건 **마크업 트릭이 아니라 콘텐츠 구조**다: **서술형 헤딩 + 리스트 + 표 + FAQ형 Q&A.**
- **FAQ 형식**: 질문을 헤더로, 답을 바로 아래 단락으로. 이 *포맷*은 AI 답변에 그대로 인용될 수 있다
  (FAQ *스키마*의 노출 효과와는 별개 — §4 참조).
- 표/리스트는 사실·수치를 행 단위로 추출하기 좋게 만든다.
- 본문은 사람을 위해 쓴다(E-E-A-T). 전문성·실제 사례·출처가 신뢰를 만든다.

## 4. 구조화 데이터 (JSON-LD) — 최소·기반용

- 스키마는 **저비용 기반 인프라**다. 클래식 검색의 리치결과 자격 + 검색엔진 기반 AI(Bing Copilot 등)의
  콘텐츠 이해를 돕는다. **단, AI 인용을 보장하지 않으며 필수도 아니다.** 과투자 금지.
- **이 사이트 최소 세트**(이게 전부면 충분):
  - **Organization** + **WebSite** — 사이트 전역(홈/Layout). → 구현: `src/components/seo/JsonLd.astro` 참조.
  - **BreadcrumbList** — 하위 페이지가 생기면 페이지별.
  - **Service** — 서비스 상세 페이지(AVO 서비스)에 1개.
- **FAQPage 스키마**: Google 리치결과는 사실상 폐지(2023 제한 → 2026 제거). **추가 SERP 공간을 노리고 넣지 말 것.**
  온페이지 FAQ가 실제로 유용할 때만 마크업 유지 가능(해는 없음). GEO엔 *마크업*보다 *Q&A 포맷*이 일을 한다.
- JSON-LD는 `<script type="application/ld+json">`로 정적 출력. Layout의 `slot="head"`로 주입.

## 5. 기술 SEO 체크리스트 (Astro) — 현재 상태

- [x] `astro.config.mjs` `site` 설정 (canonical·sitemap 기준) — `https://lead-gen.team`
- [x] `@astrojs/sitemap` — 빌드 시 `sitemap-index.xml` 생성, 내부 `/ui` 제외
- [x] `public/robots.txt` — sitemap 링크 + AI 크롤러 정책(§7)
- [x] `Layout.astro` — `<title>`, meta description, **canonical**, **OG**(og:title/description/image/url),
      **Twitter Card**(summary_large_image), `lang="ko"`, head 슬롯
- [ ] 페이지마다 고유한 `title`·`description` (50–60자 / 120–160자 권장, 중복 금지)
- [ ] OG 이미지 `public/og.png`(1200×630) 추가
- [ ] JSON-LD: 홈에 Organization+WebSite, 서비스 페이지에 Service
- **Core Web Vitals(2026)**: **LCP < 2.5s, INP < 200ms, CLS < 0.1**.
  ⚠️ FID는 2024년 폐지되고 **INP로 대체**됨 — "FID < 100ms"는 옛 기준이니 쓰지 말 것.
  Astro 정적+아일랜드 최소화로 대부분 자연 충족.

## 6. 하지 말 것 (딥서치에서 기각된 통념)

근거 없이 떠도는 GEO "꿀팁"들 — 적대적 검증에서 **기각(refuted)**됨. 규칙으로 채택 금지:

- ❌ **콘텐츠 청킹 / llms.txt** 생성 (Google: 불필요).
- ❌ "**복수 H1이 토픽 신호를 약화한다**" 프레이밍.
- ❌ "**답을 첫 60단어/첫 1/3에 넣으면 인용 44%↑**" 같은 위치 규칙.
- ❌ **질문형 헤딩 = AEO 특효** 단정.
- ❌ Princeton 연구의 구체 수치(**전문가 인용 +41%, 통계 +32%, 출처 +30%**) — 방향성만 참이고 수치는 미검증.
- ❌ **비교형 글("Best X", "A vs B") 우선** 전략.
- ❌ **TL;DR/불릿/표 + FAQPage/HowTo 스키마**를 "인용 트리거"로 신봉.
- ❌ **ProfessionalService + OfferCatalog(가격대) / SpeakableSpecification** 등 화려한 스키마 과투자.
- ❌ "**AI는 실시간으로 검색 색인에서 출처를 가져온다**" 단정(검증 기각).
- ❌ "**AI 크롤러를 막으면 무조건 노출이 사라진다**" 단정 → robots는 비즈니스 결정(§7).

## 7. 미해결 — 런칭 전 결정 필요

1. **한국어/네이버 트랙**: 검증 출처는 모두 Google/영어 기준. 타깃이 네이버·구글·AI 중 어디를 쓰는지에 따라
   별도 네이버 SEO 트랙(검색등록·블로그 등)이 필요할 수 있음. → 비즈니스 확인 필요.
2. **robots의 AI 크롤러 정책**: 현재 `robots.txt`는 브랜드 AI 노출 목적상 GPTBot·PerplexityBot·Google-Extended·
   ClaudeBot **허용**으로 둠. 이는 규칙이 아니라 **선택** — 브랜드 세이프티 관점에서 재확인 가능.
3. **OG 이미지·페이지별 메타**: 콘텐츠 페이지가 생길 때 각 페이지 고유 title/description/og:image 확정.

## 출처 (1차 우선)

- Google Search Central — AI Optimization Guide / AI features (1차, 2026-06 업데이트)
- W3C WAI — Headings (1차)
- Astro Docs — @astrojs/sitemap (1차)
- Vercel — The Rise of the AI Crawler (1차 데이터: AI 크롤러 JS 미실행)
- Search Engine Journal — Header Tags / Yoast / Conductor (헤딩, 2차)
- Jakob Nielsen (NN/g) — GEO; Princeton·Georgia Tech GEO study (ACM KDD 2024)
- Google Search Central Blog — FAQ/HowTo 변경(2023-08), FAQ 리치결과 제거(2026)
