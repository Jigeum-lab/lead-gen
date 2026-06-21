# AGENTS.md — LeadGenLab (Astro)

- 스택: **Astro 6 + Tailwind v4**. 페이지=`src/pages/*.astro`, 셸=`src/layouts/Layout.astro`, UI=`src/components/`, 전역 스타일=`src/styles/global.css`(디자인 토큰은 `@theme`).
- 기본은 `.astro` 컴포넌트(서버 렌더). 인터랙션 필요 시에만 framework 아일랜드(`client:*`) 추가.
- 명령: `npm run dev` / `npm run build` / `npm run preview`.
- 콘텐츠는 새로 쓰지 말고 `docs/source-content.md`(기존 사이트 추출본)를 소스로 사용. 한국어 기본.
- `.claude/`는 skein에서 복사됨 — Astro 비호환 스킬/에이전트 목록은 `CLAUDE.md` "Claude 셋업 주의" 참조. FSD/NestJS/DB 관련 호출 금지.
