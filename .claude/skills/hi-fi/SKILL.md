---
name: hi-fi
description: >
  Lo-fi 와이어프레임(wireframes.md)을 입력으로 실제 Astro + Tailwind v4 코드를 생성하는 스킬.
  "Hi-fi 만들어줘", "컴포넌트 코드 생성해줘", "와이어프레임 구현해줘", "/hi-fi" 등
  화면 설계를 실제 코드로 변환하는 모든 요청에 트리거.
  Lo-fi 와이어프레임 작성·PRD·기능명세 초안에는 트리거하지 않음.
type: encoded-preference
version: 2.0.0
---

# Hi-Fi Code Generation Skill (Astro)

Lo-fi 와이어프레임 → **Astro 6 + Tailwind v4** 코드 생성. 기본은 서버 렌더 `.astro`,
인터랙션이 필요한 곳만 framework 아일랜드(`client:*`).

---

## Phase 1 — Input Gate

**HARD-GATE**: `product/{project}/ux/wireframes.md` 존재 필수
→ 없으면 즉시 중단:
```
❌ [HARD-GATE] wireframes.md가 없습니다. /wireframe을 먼저 완료하세요.
```

**SOFT-GATE**: `src/styles/global.css` 확인
→ 항상 읽어서 현재 `@theme` 디자인 토큰 파악 (색상·폰트·간격·radius 기준).

---

## Phase 1.5 — 디자인 시스템 파악

```bash
# 현재 디자인 토큰 확인 (Tailwind v4 @theme = 소스 오브 트루스)
cat src/styles/global.css
```

`design-system` 스킬로 토큰 체계·컴포넌트 스펙 참조.
`ui-ux-pro-max`로 해당 화면 유형에 맞는 디자인 방향 조회:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "{화면 유형 키워드}" --design-system -f markdown --stack astro
```

토큰이 비어 있으면 먼저 `@theme`에 정의(또는 `theme-factory`/`brand.md` 산출물 반영) 후 진행.

---

## Phase 2 — 스타일 방향 결정

AUQ: 구현할 화면 우선순위
- 모든 화면 순서대로
- 핵심 화면 3~5개 먼저
- 특정 화면 지정

---

## Phase 3 — 컴포넌트·인터랙션 준비

### 정적 UI (기본)
별도 설치 없음. `src/components/{Name}.astro`로 섹션 단위 컴포넌트 작성.

### 인터랙션이 필요한 경우에만 (아일랜드)
필요한 화면에 한해 framework integration 추가:
```bash
npx astro add react --yes     # 또는 svelte / vue — 한 가지로 통일 권장
```
인터랙티브 컴포넌트는 `src/components/{Name}.tsx`(아일랜드)로 만들고,
페이지에서 `<Counter client:visible />`처럼 **필요한 섹션에만** 하이드레이션.

### 애니메이션
- 1순위: **CSS/Tailwind 트랜지션·`@keyframes`·`transition:` 디렉티브** (View Transitions API).
- 무거운 캔버스/Three.js 효과는 지양. 꼭 필요하면 React 아일랜드 안에서 `client:only="react"`로 격리.
- (참고) react-bits는 React 전용 — Astro에선 기본 사용 안 함.

---

## Phase 4 — 코드 생성

### 파일 구조
```
src/
  pages/
    {route}.astro      ← 라우트 = 파일 (예: index.astro, solutions.astro)
  layouts/
    Layout.astro       ← 공용 셸 (global.css import, <head>, lang="ko")
  components/
    {Section}.astro    ← 섹션 단위 정적 컴포넌트 (Hero, Pricing, Faq ...)
    {Name}.tsx         ← 인터랙션 아일랜드 (필요 시에만)
  styles/
    global.css         ← @import "tailwindcss" + @theme 토큰 (수정 시 design-system 준수)
```

### 코드 생성 규칙 (CLAUDE.md/AGENTS.md 준수)

**색상 하드코딩 절대 금지** — `@theme` 토큰 유틸리티만:
```html
<!-- ✅ --><div class="bg-primary text-white border border-border hover:bg-primary-hover">
<!-- ❌ --><div class="bg-[#2563EB]" style="color:#fff">
```

**페이지는 Layout으로 감싼다**:
```astro
---
import Layout from "../layouts/Layout.astro";
import Hero from "../components/Hero.astro";
---
<Layout title="..." description="...">
  <Hero />
</Layout>
```

**링크·이미지는 표준/Astro 네이티브**:
- 링크: 일반 `<a href="...">` (next/link 없음). 외부 CTA URL은 `docs/source-content.md` 기준 유지.
- 이미지: `astro:assets`의 `<Image />` 사용, `alt` 필수. (`import { Image } from "astro:assets"`)

**서버 우선**: 기본은 JS 없는 `.astro`. `client:*`는 실제 상호작용(모바일 메뉴 토글, 폼, 캐러셀 등)에만.

### 화면당 생성 순서
1. 섹션 컴포넌트들(`.astro`)로 레이아웃 분해
2. 페이지(`src/pages/{route}.astro`)에서 Layout + 섹션 조립
3. 인터랙션 아일랜드(필요 시, `client:visible`/`client:idle`)
4. 빈 상태·에러/폼 검증 UI (해당 시)

---

## Phase 5 — 품질 체크리스트

생성 후 확인:

### 코드 품질
- [ ] hex/oklch/rgb 직접 사용 없음 (`@theme` 토큰 유틸리티만)
- [ ] 페이지가 `Layout.astro`로 래핑됨, `lang="ko"` 적용
- [ ] `client:*`는 상호작용 필요한 섬에만 (정적 섹션은 순수 `.astro`)
- [ ] 이미지: `astro:assets <Image>` + `alt`
- [ ] `npm run build` 통과 (정적 빌드 에러 없음)

### 접근성
- [ ] 클릭 가능 요소 44px 이상 터치 타겟
- [ ] 키보드 포커스 상태 visible (focus-ring 토큰)
- [ ] aria-label (아이콘 버튼), 시맨틱 태그(`<nav> <main> <section> <footer>`)

### 반응형
- [ ] 모바일 375px, 태블릿 768px, 데스크톱 1440px 동작 확인 (Tailwind `sm:`/`md:`/`lg:`)

---

## Phase 6 — 저장 및 보고

생성 완료 후:
1. `product/{project}/manifest.md` Hi-fi 행 `✅ 완료` 업데이트
2. `npm run build` 결과 + 생성된 파일 목록 + 미결 사항 보고

---

## Constraints

- 화면·섹션 단위로 생성 — 전체를 한 번에 시도 금지
- 기본은 서버 렌더 `.astro` — 아일랜드(`client:*`)는 최소화, 정당화될 때만
- 색상·간격·radius는 반드시 `@theme` 토큰 유틸리티 (하드코딩 금지)
- shadcn/`npx shadcn add`/react-bits/`next/*` 사용 금지 (이 프로젝트는 Astro)
- 무거운 Three.js/캔버스 효과 지양 — 필요 시 React 아일랜드로 격리(`client:only`)

## Anti-Triggers

- Lo-fi 와이어프레임 작성 → `/wireframe` 스킬
- PRD·기능명세 작성 → `/prd`, `/functional-spec` 스킬
- QA 검토 → `/qa` 스킬
- 단순 버그 수정 → 직접 편집
