# CLAUDE.md — LeadGenLab 사이트 리모델링

**lead-gen.team** 리모델링 프로젝트. AVO(AI Visibility Optimization) 서비스를 파는 한국어 B2B 마케팅/랜딩 사이트.
기존 사이트의 **콘텐츠만 이관**하고 디자인·구조는 **완전히 새로** 만든다.

## 스택
- **Astro 6** (정적 빌드·SEO·로딩 최적화) + **Tailwind v4** (`@tailwindcss/vite`).
- 인터랙티브가 필요한 곳만 React/Svelte 아일랜드 추가 (기본은 `.astro` 컴포넌트). 섬은 꼭 필요할 때만.
- 패키지매니저 npm. 루트에서 `npm run dev` / `npm run build` / `npm run preview`.

## 구조 규칙
- 페이지: `src/pages/*.astro` (파일=라우트). 공용 셸: `src/layouts/Layout.astro`.
- 재사용 UI: `src/components/`. 섹션 단위 컴포넌트로 쪼갠다.
- 스타일: Tailwind 유틸리티 우선. 전역은 `src/styles/global.css` 한 곳. 디자인 토큰은 `@theme`로 정의.
- 콘텐츠/카피: `src/content/` 또는 컴포넌트 prop으로 주입. 한국어가 기본 언어(`lang="ko"`).

## 절대 규칙
- **콘텐츠 이관 출처**: 기존 사이트 카피는 `docs/source-content.md`에 추출해 둠 — 디자인은 새로, 문구·정보는 이걸 소스로.
- 가정 금지·트레이드오프 표면화·최소 변경(surgical). 안 시킨 기능·추상화·설정 추가 금지.
- 외부 링크(카카오 오픈챗 CTA, FeatPaper 자료 등)는 기존 URL 유지.

## Claude 셋업 주의 (중요)
`.claude/`는 skein(Next.js+FSD+NestJS) 셋업을 **통째 복사**한 것이라 일부가 이 Astro 프로젝트와 안 맞는다.
- **그대로 유효**: `kickoff`·`research`·`prd`·`user-flow`·`wireframe`·`devils-advocate`·`osint-deepsearch`·`iterate`·`theme-factory`·`ui-ux-pro-max`·`product-researcher`/`ux-*`/`content-writer` 에이전트 · harness 전반.
- **Astro용으로 각색 완료**: `hi-fi`(v2.0.0 — Astro 6 + Tailwind v4 코드 생성), `design-system`(v2.0.0 — `src/styles/global.css`의 `@theme` 기준, shadcn 제거). 토큰값은 항상 `src/styles/global.css` 먼저 읽을 것.
- **이 프로젝트에선 미사용**: `fsd-reviewer`·`nestjs-reviewer`·`db-migration`·`api-contract`·`functional-spec`(화면 기준 외)·`pptx` 및 백엔드 전제 항목. 호출하지 말 것.
- 코드 리뷰는 일반 리뷰로(`@security-reviewer`는 폼/외부연동 생길 때 사용 가능).

## 리모델링 파이프라인 (권장 흐름)
`/kickoff lead-gen` → `/research`(시장·경쟁·AVO 포지셔닝 검증) → `/prd` → `/user-flow`(IA·사이트맵) → `/wireframe` → 디자인 토큰(`theme-factory`/`@theme`) → 구현(Astro 컴포넌트) → `/qa`.
산출물 경로: `product/lead-gen/`.
