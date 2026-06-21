---
name: design-system
description: >
  디자인 시스템 토큰(컬러·타이포·간격·컴포넌트·모션) 레퍼런스 — Astro + Tailwind v4.
  코드 생성 시 참조. 실제 토큰 정의는 src/styles/global.css의 @theme가 소스 오브 트루스.
  토큰은 Tailwind 유틸리티(bg-primary 등)로 자동 매핑 — hex 하드코딩 금지.
type: encoded-preference
version: 2.0.0
when_to_use: >
  UI 컴포넌트·페이지 코드 생성 시 자동 참조. "디자인 시스템 확인해줘", "토큰 뭐 써야 해",
  컬러·타이포·스페이싱 결정 시 트리거. /hi-fi, /wireframe 실행 시 자동 포함.
  실제 토큰값은 src/styles/global.css 파일을 항상 먼저 읽을 것.
---

## Astro + Tailwind v4 스택

- **토큰 = Tailwind v4 `@theme`**: 토큰은 `src/styles/global.css`의 `@theme {}`에 CSS 변수로 정의하면
  Tailwind 유틸리티가 자동 생성된다. 이게 shadcn의 CSS-var 규약을 대체한다.
  ```css
  /* src/styles/global.css */
  @import "tailwindcss";
  @theme {
    --color-primary: #2563EB;        /* → bg-primary / text-primary / border-primary */
    --color-primary-hover: #1D4ED8;
    --font-sans: "Pretendard", "Inter", sans-serif;  /* → font-sans */
    --radius-lg: 12px;               /* → rounded-lg */
  }
  ```
- **색상 하드코딩 금지**: hex/oklch/rgb 직접 사용 금지 → `@theme` 토큰 유틸리티만.
  ```html
  <!-- ✅ --> <a class="bg-primary text-white hover:bg-primary-hover border border-border">
  <!-- ❌ --> <a class="bg-[#2563EB]" style="color:#fff">
  ```
- **컴포넌트 = `.astro`**: 재사용 UI는 `src/components/*.astro`. 인터랙션 필요 시에만
  framework 아일랜드(`client:*`). shadcn/React·`npx shadcn add`·`"use client"` 없음.
- **다크모드**: Tailwind `dark:` 변형 + `.dark` 셀렉터에 다크 토큰 재정의로 처리.

## Anti-Triggers

- **PRD·기능명세 작성**: prd-writer 영역
- **유저플로우·와이어프레임 설계**: ux-designer 영역
- **실제 토큰 수정**: src/styles/global.css의 `@theme` 직접 편집

---

# Design System v1.0 (기본값)

클라이언트 브랜드 가이드가 있으면 아래 기본값을 오버라이드한다.
`product/{project}/brand.md` 참조 (없으면 아래 기본 토큰 사용).

---

## 1. Color System

### 1-1. Primitive Palette

**Blue**

| Token | Hex | Usage |
|---|---|---|
| `blue-50` | #EFF6FF | 배경 강조 |
| `blue-100` | #DBEAFE | 선택된 배경 |
| `blue-200` | #BFDBFE | 서브틀 강조 |
| `blue-300` | #93C5FD | — |
| `blue-400` | #60A5FA | — |
| `blue-500` | #3B82F6 | — |
| `blue-600` | #2563EB | Primary (기본) |
| `blue-700` | #1D4ED8 | Hover |
| `blue-800` | #1E40AF | Active |
| `blue-900` | #1E3A8A | 강조 다크 |

**Slate**

| Token | Hex | Usage |
|---|---|---|
| `slate-50` | #F8FAFC | 페이지 배경 |
| `slate-100` | #F1F5F9 | 서피스 |
| `slate-200` | #E2E8F0 | 테두리 기본 |
| `slate-300` | #CBD5E1 | 테두리 강조 |
| `slate-400` | #94A3B8 | 비활성 텍스트 |
| `slate-500` | #64748B | 보조 텍스트 |
| `slate-600` | #475569 | — |
| `slate-700` | #334155 | — |
| `slate-800` | #1E293B | — |
| `slate-900` | #0F172A | 기본 텍스트 |

**Green**

| Token | Hex | Usage |
|---|---|---|
| `green-50` | #F0FDF4 | 성공 배경 |
| `green-100` | #DCFCE7 | 성공 서브틀 |
| `green-200` | #BBF7D0 | — |
| `green-300` | #86EFAC | — |
| `green-400` | #4ADE80 | — |
| `green-500` | #22C55E | — |
| `green-600` | #16A34A | Success 기본 |
| `green-700` | #15803D | Success Hover |
| `green-800` | #166534 | — |
| `green-900` | #14532D | — |

**Red**

| Token | Hex | Usage |
|---|---|---|
| `red-50` | #FEF2F2 | 에러 배경 |
| `red-100` | #FEE2E2 | 에러 서브틀 |
| `red-200` | #FECACA | — |
| `red-300` | #FCA5A5 | — |
| `red-400` | #F87171 | — |
| `red-500` | #EF4444 | — |
| `red-600` | #DC2626 | Danger 기본 |
| `red-700` | #B91C1C | Danger Hover |
| `red-800` | #991B1B | — |
| `red-900` | #7F1D1D | — |

**Yellow**

| Token | Hex | Usage |
|---|---|---|
| `yellow-50` | #FEFCE8 | 경고 배경 |
| `yellow-100` | #FEF9C3 | 경고 서브틀 |
| `yellow-200` | #FEF08A | — |
| `yellow-300` | #FDE047 | — |
| `yellow-400` | #FACC15 | — |
| `yellow-500` | #EAB308 | Warning 기본 |
| `yellow-600` | #CA8A04 | Warning Hover |
| `yellow-700` | #A16207 | — |
| `yellow-800` | #854D0E | — |
| `yellow-900` | #713F12 | — |

**Purple**

| Token | Hex | Usage |
|---|---|---|
| `purple-50` | #FAF5FF | 정보 배경 |
| `purple-100` | #F3E8FF | 정보 서브틀 |
| `purple-200` | #E9D5FF | — |
| `purple-300` | #D8B4FE | — |
| `purple-400` | #C084FC | — |
| `purple-500` | #A855F7 | — |
| `purple-600` | #9333EA | Info 기본 |
| `purple-700` | #7E22CE | Info Hover |
| `purple-800` | #6B21A8 | — |
| `purple-900` | #581C87 | — |

---

### 1-2. Semantic Tokens — Light Mode

**Brand**

| Token | Value | 용도 |
|---|---|---|
| `color-primary` | blue-600 (#2563EB) | 주 CTA, 강조 |
| `color-primary-hover` | blue-700 (#1D4ED8) | 버튼 hover |
| `color-primary-active` | blue-800 (#1E40AF) | 버튼 active/pressed |
| `color-primary-subtle` | blue-50 (#EFF6FF) | 배경 강조 영역 |
| `color-primary-disabled` | blue-200 (#BFDBFE) | 비활성 primary |

**Status**

| Token | Value | 용도 |
|---|---|---|
| `color-success` | green-600 (#16A34A) | 성공 상태 |
| `color-success-subtle` | green-50 (#F0FDF4) | 성공 배경 |
| `color-warning` | yellow-500 (#EAB308) | 경고 상태 |
| `color-warning-subtle` | yellow-50 (#FEFCE8) | 경고 배경 |
| `color-danger` | red-600 (#DC2626) | 에러·위험 |
| `color-danger-subtle` | red-50 (#FEF2F2) | 에러 배경 |
| `color-info` | purple-600 (#9333EA) | 정보 상태 |
| `color-info-subtle` | purple-50 (#FAF5FF) | 정보 배경 |

**Neutral — Background**

| Token | Value | 용도 |
|---|---|---|
| `color-bg-page` | slate-50 (#F8FAFC) | 페이지 배경 |
| `color-bg-surface` | #FFFFFF | 카드·패널 |
| `color-bg-elevated` | #FFFFFF | 드롭다운·모달 |
| `color-bg-overlay` | rgba(0,0,0,0.5) | 모달 오버레이 |

**Border**

| Token | Value | 용도 |
|---|---|---|
| `color-border-default` | slate-200 (#E2E8F0) | 기본 테두리 |
| `color-border-strong` | slate-300 (#CBD5E1) | hover 테두리 |
| `color-border-focus` | blue-600 (#2563EB) | 포커스 링 색상 |
| `color-border-error` | red-600 (#DC2626) | 에러 테두리 |

**Text**

| Token | Value | 용도 |
|---|---|---|
| `color-text-primary` | slate-900 (#0F172A) | 본문 |
| `color-text-secondary` | slate-500 (#64748B) | 부제·설명 |
| `color-text-tertiary` | slate-400 (#94A3B8) | 보조 힌트 |
| `color-text-disabled` | slate-400 (#94A3B8) | 비활성 |
| `color-text-inverse` | #FFFFFF | 다크 배경 위 텍스트 |
| `color-text-link` | blue-600 (#2563EB) | 링크 |
| `color-text-danger` | red-600 (#DC2626) | 에러 메시지 |
| `color-text-success` | green-600 (#16A34A) | 성공 메시지 |

**Icon**

| Token | Value | 용도 |
|---|---|---|
| `color-icon-primary` | slate-700 (#334155) | 주요 아이콘 |
| `color-icon-secondary` | slate-400 (#94A3B8) | 보조 아이콘 |
| `color-icon-disabled` | slate-300 (#CBD5E1) | 비활성 아이콘 |

---

### 1-3. Semantic Tokens — Dark Mode

**Brand**

| Token | Value |
|---|---|
| `color-primary` | blue-400 (#60A5FA) |
| `color-primary-hover` | blue-300 (#93C5FD) |
| `color-primary-active` | blue-200 (#BFDBFE) |
| `color-primary-subtle` | blue-900 (#1E3A8A) |
| `color-primary-disabled` | blue-800 (#1E40AF) |

**Status (Dark)**

| Token | Value |
|---|---|
| `color-success` | green-400 (#4ADE80) |
| `color-success-subtle` | green-900 (#14532D) |
| `color-warning` | yellow-400 (#FACC15) |
| `color-warning-subtle` | yellow-900 (#713F12) |
| `color-danger` | red-400 (#F87171) |
| `color-danger-subtle` | red-900 (#7F1D1D) |
| `color-info` | purple-400 (#C084FC) |
| `color-info-subtle` | purple-900 (#581C87) |

**Neutral — Background (Dark)**

| Token | Value |
|---|---|
| `color-bg-page` | #0F172A |
| `color-bg-surface` | #1E293B |
| `color-bg-elevated` | #334155 |
| `color-bg-overlay` | rgba(0,0,0,0.7) |

**Border (Dark)**

| Token | Value |
|---|---|
| `color-border-default` | slate-700 (#334155) |
| `color-border-strong` | slate-600 (#475569) |
| `color-border-focus` | blue-400 (#60A5FA) |
| `color-border-error` | red-400 (#F87171) |

**Text (Dark)**

| Token | Value |
|---|---|
| `color-text-primary` | slate-50 (#F8FAFC) |
| `color-text-secondary` | slate-400 (#94A3B8) |
| `color-text-tertiary` | slate-500 (#64748B) |
| `color-text-disabled` | slate-600 (#475569) |
| `color-text-inverse` | slate-900 (#0F172A) |
| `color-text-link` | blue-400 (#60A5FA) |
| `color-text-danger` | red-400 (#F87171) |
| `color-text-success` | green-400 (#4ADE80) |

**Icon (Dark)**

| Token | Value |
|---|---|
| `color-icon-primary` | slate-300 (#CBD5E1) |
| `color-icon-secondary` | slate-600 (#475569) |
| `color-icon-disabled` | slate-700 (#334155) |

---

### 1-4. Accessibility Tokens

| Token | Value | 기준 |
|---|---|---|
| `focus-ring-color` | #2563EB | WCAG AA |
| `focus-ring-offset` | 2px | 클릭 영역 명확성 |
| `focus-ring-width` | 3px | 가시성 |
| `error-text` | #DC2626 | 흰 배경 대비 4.5:1 이상 |
| `focus-ring-style` | `0 0 0 3px rgba(37,99,235,0.4)` | box-shadow |

---

## 2. Typography System

### 2-1. Font Families

| 역할 | 폰트 | Weights | 비고 |
|---|---|---|---|
| 한국어 본문·UI | Pretendard | 400, 500, 600, 700 | 한·영 통합 |
| 영어 폴백 | Inter | 400, 500, 600, 700 | Google Fonts |
| 코드·모노스페이스 | JetBrains Mono | 400 | 코드 블록 전용 |

CSS 선언:
```
font-family: 'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

---

### 2-2. Type Scale

| 레벨 | 크기 | 행간 | 굵기 | 자간 | 용도 |
|---|---|---|---|---|---|
| Display-XL | 56px | 64px | 700 | -0.5px | 히어로 타이틀 |
| Display-L | 48px | 56px | 700 | -0.5px | 랜딩 대형 제목 |
| Display-M | 40px | 48px | 700 | -0.25px | 섹션 대형 제목 |
| H1 | 32px | 40px | 700 | -0.25px | 페이지 제목 |
| H2 | 28px | 36px | 700 | 0 | 섹션 제목 |
| H3 | 24px | 32px | 600 | 0 | 서브 섹션 제목 |
| H4 | 20px | 28px | 600 | 0 | 카드 제목 |
| H5 | 18px | 26px | 600 | 0 | 소항목 제목 |
| Body-XL | 18px | 28px | 400 | 0 | 리드 문장 |
| Body-L | 16px | 24px | 400 | 0 | 본문 |
| Body-M | 14px | 22px | 400 | 0 | 보조 텍스트 |
| Body-S | 12px | 18px | 400 | 0 | 캡션·주석 |
| Label-L | 14px | 20px | 500 | 0.1px | 폼 레이블 |
| Label-M | 12px | 16px | 500 | 0.25px | 소형 레이블·배지 |
| Code | 14px | 22px | 400 | 0 | JetBrains Mono |

---

## 3. Spacing & Layout

### 3-1. Spacing Scale (4px Base)

| Token | Value | 용도 |
|---|---|---|
| `space-0.5` | 2px | 미세 간격 |
| `space-1` | 4px | 인접 요소 |
| `space-1.5` | 6px | 소형 간격 |
| `space-2` | 8px | 컴팩트 패딩 |
| `space-2.5` | 10px | — |
| `space-3` | 12px | 인라인 요소 |
| `space-4` | 16px | 기본 패딩 |
| `space-5` | 20px | 섹션 내 간격 |
| `space-6` | 24px | 카드 패딩 |
| `space-8` | 32px | 섹션 간격 |
| `space-10` | 40px | 대형 간격 |
| `space-12` | 48px | 슬라이드 상하 여백 |
| `space-14` | 56px | — |
| `space-16` | 64px | 슬라이드 좌우 여백 |
| `space-20` | 80px | 섹션 패딩 |
| `space-24` | 96px | 대형 섹션 |
| `space-32` | 128px | 히어로 여백 |

---

### 3-2. Grid System

| 브레이크포인트 | 범위 | 컬럼 수 | Gutter | Margin | Max-width |
|---|---|---|---|---|---|
| PC | ≥ 1280px | 12 | 24px | 64px | 1440px |
| Tablet | 768–1279px | 8 | 20px | 32px | — |
| Mobile | ≤ 767px | 4 | 16px | 20px | — |

---

### 3-3. Border Radius

| Token | Value | 용도 |
|---|---|---|
| `radius-none` | 0 | 테이블·전면 요소 |
| `radius-xs` | 2px | 배지·태그 |
| `radius-sm` | 4px | 소형 요소 |
| `radius-md` | 8px | 버튼·인풋 |
| `radius-lg` | 12px | 카드 |
| `radius-xl` | 16px | 모달·패널 |
| `radius-2xl` | 24px | 대형 카드 |
| `radius-full` | 9999px | 칩·아바타·토글 |

---

### 3-4. Shadows

| Token | Value | 용도 |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | 카드 기본 |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | 카드 hover |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | 드롭다운 |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | 모달 |
| `shadow-focus` | `0 0 0 3px rgba(37,99,235,0.4)` | 포커스 링 |

---

## 4. Component Specifications

### 4-1. Button

**Variants**

| Variant | 배경 | 텍스트 | 테두리 | 용도 |
|---|---|---|---|---|
| Primary | `color-primary` | `color-text-inverse` | none | 주 CTA |
| Secondary (Outline) | transparent | `color-primary` | `color-border-focus` | 보조 액션 |
| Ghost | transparent | `color-text-primary` | none | 조용한 액션 |
| Danger | `color-danger` | `color-text-inverse` | none | 삭제·위험 |
| Link | transparent | `color-text-link` | none | 텍스트 링크형 |

**Sizes**

| Size | Height | Padding | Font | Radius |
|---|---|---|---|---|
| SM | 32px | 0 12px | Body-M | radius-md |
| MD | 40px | 0 16px | Body-M | radius-md |
| LG | 48px | 0 20px | Body-L | radius-md |

Icon-only: height = size 높이, width = height (정방형)

**States**

| State | 처리 |
|---|---|
| Default | 기본값 |
| Hover | 배경 1단계 어둡게 (primary-hover) |
| Active | 배경 2단계 어둡게 (primary-active) |
| Focus | shadow-focus (포커스 링) |
| Disabled | opacity 0.4, cursor not-allowed |
| Loading | 텍스트 숨김 + 중앙 spinner (16px) |

**Figma Auto Layout**: Horizontal, Align Center, padding 지정값, radius-md, Min Width = 80px

---

### 4-2. Input / Form Elements

**Text Input Sizes**

| Size | Height | 폰트 | Radius | 패딩 |
|---|---|---|---|---|
| SM | 32px | Body-M | radius-md | 0 12px |
| MD | 40px | Body-M | radius-md | 0 16px |
| LG | 48px | Body-L | radius-md | 0 16px |

**States**

| State | 테두리 | 배경 | 텍스트 |
|---|---|---|---|
| Default | `color-border-default` | white | `color-text-primary` |
| Focus | `color-border-focus` (2px) | white | `color-text-primary` |
| Filled | `color-border-default` | white | `color-text-primary` |
| Error | `color-border-error` (2px) | red-50 | `color-text-primary` |
| Disabled | `color-border-default` | slate-50 | `color-text-disabled` |
| ReadOnly | `color-border-default` | slate-50 | `color-text-secondary` |

**Input Types**

| Type | 특이사항 |
|---|---|
| Text | 기본 |
| Password | 우측 눈 아이콘 — 가시성 토글 |
| Search | 좌측 돋보기 아이콘, 입력 시 우측 × 클리어 버튼 |
| Number | 우측 ▲▼ 스피너 |

**Textarea**: auto-resize, 최소 3행, max-height 200px, Body-M, 동일 상태 처리

**Select/Dropdown**: 커스텀 스타일, 우측 ▼ 화살표, 검색 가능 variant 포함

**Checkbox**

| 속성 | 값 |
|---|---|
| 크기 | 18×18px |
| 기본 | 흰 배경, `color-border-default` 1px |
| Checked | `color-primary` 배경, 흰색 체크마크 SVG |
| Indeterminate | `color-primary` 배경, 흰색 대시 |
| Disabled | slate-100 배경, slate-300 테두리 |

**Radio**

| 속성 | 값 |
|---|---|
| 크기 | 18×18px 원형 |
| Checked | `color-primary` 테두리, 내부 6px 채워진 원 |
| Disabled | slate-300 색상 처리 |

**Toggle/Switch**

| 속성 | 값 |
|---|---|
| 크기 | 44×24px |
| Off | slate-300 배경, 흰 원 좌측 |
| On | `color-primary` 배경, 흰 원 우측 |
| 애니메이션 | 200ms ease-in-out |

**Form Group 구조**: Label (Label-L) → Input → Helper Text 또는 Error Message (Body-S)

---

### 4-3. Card

**Variants**

| Variant | 배경 | 테두리 | 그림자 | Radius |
|---|---|---|---|---|
| Default | `color-bg-surface` | `color-border-default` | shadow-sm | radius-lg |
| Outlined | `color-bg-surface` | `color-border-strong` | none | radius-lg |
| Filled | `color-bg-page` | none | none | radius-lg |
| Elevated | `color-bg-surface` | none | shadow-lg | radius-lg |

**States**

| State | 처리 |
|---|---|
| Default | 기본값 |
| Hover | shadow-md, `color-border-strong` |
| Clickable | cursor pointer, 전체 surface 클릭 가능 |

**패딩**: 24px (기본) / 16px (컴팩트)

**Image Card**: 이미지 비율 16:9 또는 1:1, 이미지 아래 콘텐츠 영역, 오버레이 그라디언트 선택 적용 (`linear-gradient(to top, rgba(0,0,0,0.6), transparent)`)

---

### 4-4. Navigation

**GNB (PC)**

| 속성 | 값 |
|---|---|
| Height | 64px |
| 배경 | white, 하단 `color-border-default` 1px |
| 로고 | 좌측 정렬 |
| 메뉴 | 가운데 또는 우측 정렬 |
| CTA 버튼 | 우측 끝, Primary MD |
| Sticky | scroll 시 shadow-md 추가 |

**GNB (Mobile)**

| 속성 | 값 |
|---|---|
| Height | 56px |
| 방식 1 | 햄버거 → 풀스크린 사이드 드로워 |
| 방식 2 | Bottom Tab Bar 별도 (하단 탭 사용 시 GNB 불필요) |

**Side Nav**

| 속성 | 값 |
|---|---|
| 기본 너비 | 240px |
| 접힌 너비 | 64px (아이콘만) |
| 항목 높이 | 44px |
| 활성 항목 | `color-primary-subtle` 배경, `color-primary` 텍스트 |
| 비활성 hover | slate-100 배경 |

**Bottom Tab Bar (Mobile)**

| 속성 | 값 |
|---|---|
| Height | 56px + iOS safe area |
| 탭 수 | 4–5개 |
| 활성 탭 | `color-primary` 아이콘·레이블 |
| 비활성 탭 | `color-icon-secondary` |
| 레이블 | Label-M |

---

### 4-5. Modal / Dialog

**Sizes**

| Size | 너비 | 용도 |
|---|---|---|
| SM | 400px | 확인 다이얼로그 |
| MD | 560px | 일반 폼 |
| LG | 720px | 복잡한 폼·뷰어 |
| Full-screen | 100vw × 100vh | 모바일·전체화면 |

**구조**

| 레이어 | 스펙 |
|---|---|
| Overlay | `color-bg-overlay`, backdrop-filter blur 4px 권장 |
| Panel | `color-bg-elevated`, shadow-xl, radius-xl |
| Header | H4 제목 + 선택적 × 버튼, 하단 border |
| Body | 스크롤 가능, 패딩 24px |
| Footer | 버튼 우측 정렬, 패딩 16px 24px |

**접근성**: ESC 키 닫기, 열릴 때 포커스 이동, 배경 스크롤 잠금

---

### 4-6. Toast / Alert

**Position**: 우측 상단 고정, 모든 방향 16px 간격

**Variants**

| Variant | 아이콘 | 색상 |
|---|---|---|
| Success | ✓ 원형 | `color-success` |
| Error | ✗ 원형 | `color-danger` |
| Warning | ! 삼각형 | `color-warning` |
| Info | i 원형 | `color-info` |

**구조**: 아이콘(20px) + 메시지(Body-M) + 선택적 액션 버튼(Link variant) + × 닫기 버튼

**자동 닫힘**: 기본 3000ms, hover 시 일시정지

**스택**: 복수 toast 시 12px 간격으로 쌓임, 최대 3개

---

### 4-7. Badge / Tag / Chip

**Badge** (알림·상태 표시)

| Size | Height | 폰트 | Radius |
|---|---|---|---|
| SM | 18px | Label-M | radius-full |
| MD | 24px | Label-L | radius-full |

Colors: Primary, Success, Warning, Danger, Neutral (각 variant 색 적용)

**Tag** (선택 가능한 필터)

- 높이: 28px, 패딩: 0 10px, radius-full
- 선택 상태: `color-primary-subtle` 배경, `color-primary` 텍스트
- × 버튼: 우측 아이콘으로 제거 가능

**Chip** (선택형 필터)

- 높이: 32px, 패딩: 0 12px, radius-full
- Default: `color-border-default` 테두리
- Selected: `color-primary` 테두리, `color-primary-subtle` 배경

---

### 4-8. Table

| 요소 | 스펙 |
|---|---|
| 헤더 배경 | `color-bg-page` (slate-50) |
| 헤더 텍스트 | `color-text-secondary`, Label-L |
| 정렬 아이콘 | ↑↓ 인라인, 정렬 시 `color-primary` |
| 행 높이 | 52px (기본) |
| 셀 패딩 | 12px 16px |
| 행 hover | slate-50 배경 |
| 행 selected | blue-50 배경 |
| 줄무늬 (선택) | 짝수 행 slate-50 |
| 구분선 | `color-border-default` 1px 수평 |

**반응형**: 모바일에서 수평 스크롤 (overflow-x: auto)

---

### 4-9. Empty State

**레이아웃**: 수직 중앙 정렬 (Flex column, gap 16px)

| 요소 | 스펙 |
|---|---|
| 아이콘 | 64px, `color-icon-secondary` |
| 제목 | H4, `color-text-primary` |
| 설명 | Body-M, `color-text-secondary`, 최대 너비 320px |
| CTA 버튼 | Primary MD, 선택적 |

---

### 4-10. Loading States

**Spinner**

| Size | 직경 | 선 굵기 | 용도 |
|---|---|---|---|
| SM | 16px | 2px | 인라인·버튼 내부 |
| MD | 24px | 3px | 카드·섹션 |
| LG | 40px | 4px | 페이지 전체 |

색상: `color-primary`, 배경 트랙: slate-200, 360° 회전 애니메이션 800ms linear infinite

**Skeleton**

- 배경: slate-200, shimmer 효과: `linear-gradient(90deg, slate-200, slate-100, slate-200)`
- 애니메이션: 1500ms linear infinite
- radius: 콘텐츠 형태에 맞춤 (텍스트 → radius-sm, 이미지 → radius-lg)

**Progress Bar**

- 높이: 8px (기본) / 4px (슬림)
- 배경: slate-200
- 진행: `color-primary`
- 퍼센트 텍스트: Label-M, 우측 정렬 (선택)
- radius-full

---

### 4-11. Avatar

**Sizes**

| Size | 직경 | 폰트 |
|---|---|---|
| XS | 24px | Label-M |
| SM | 32px | Label-M |
| MD | 40px | Label-L |
| LG | 48px | Body-L |
| XL | 64px | H4 |

**Fallback**: 이름에서 이니셜 추출 (최대 2자), 이름 해시 기반 배경 색상 (6가지 파스텔 팔레트)

**Group**: 4px씩 겹침 (negative margin), 초과 시 +N 표시 (동일 크기, slate-200 배경)

---

## 5. Motion / Animation

### 5-1. Duration Tokens

| Token | 값 | 용도 |
|---|---|---|
| `duration-instant` | 0ms | 애니메이션 없음 |
| `duration-fast` | 100ms | hover, 소형 상태 전환 |
| `duration-normal` | 200ms | 대부분의 트랜지션 |
| `duration-slow` | 300ms | 모달 열기, 페이지 전환 |
| `duration-slower` | 500ms | 복잡한 애니메이션 |

---

### 5-2. Easing Curves

| Token | cubic-bezier | 용도 |
|---|---|---|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 요소 진입 (enter) |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 요소 퇴장 (exit) |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 요소 이동 |
| `spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | 경쾌한 피드백 |

---

### 5-3. Usage Rules

| 상황 | Duration | Easing |
|---|---|---|
| Enter animation | duration-normal | ease-out |
| Exit animation | duration-fast | ease-in |
| Layout shift | duration-slow | ease-in-out |
| Hover state | duration-fast | ease-out |
| Modal open | duration-slow | ease-out |
| Modal close | duration-normal | ease-in |
| Toast enter | duration-normal | spring |
| Toast exit | duration-fast | ease-in |

**prefers-reduced-motion 준수**: `@media (prefers-reduced-motion: reduce)` 시 모든 애니메이션 duration-instant로 오버라이드

---

## 6. Figma-specific Instructions

### 6-1. Auto Layout 설정

| 컴포넌트 | 방향 | Align | Gap | Padding |
|---|---|---|---|---|
| Button | Horizontal | Center | 8px | (size별 지정값) |
| Input | Horizontal | Center | 8px | 0 16px |
| Card | Vertical | Stretch | 16px | 24px |
| Form Group | Vertical | Stretch | 8px | 0 |
| GNB | Horizontal | Center | 16px | 0 64px |
| Bottom Tab Bar | Horizontal | Stretch | 0 | 0 |
| Modal | Vertical | Stretch | 0 | 0 |
| Toast | Horizontal | Center | 12px | 14px 16px |

---

### 6-2. Component Naming Convention

```
{컴포넌트}/{Variant}/{Size}/{State}
```

예시:
- `Button/Primary/LG/Default`
- `Button/Primary/LG/Hover`
- `Input/Text/MD/Error`
- `Card/Default/Hover`
- `Nav/GNB/PC/Scrolled`
- `Nav/GNB/Mobile/Default`
- `Modal/MD/Default`
- `Toast/Success/Default`
- `Avatar/MD/Image`
- `Avatar/MD/Fallback`

---

### 6-3. Variant Property Names (정확한 이름 사용)

| Property | 허용 값 |
|---|---|
| `Variant` | Primary, Secondary, Ghost, Danger, Link, Default, Outlined, Filled, Elevated, Success, Error, Warning, Info |
| `Size` | XS, SM, MD, LG, XL |
| `State` | Default, Hover, Active, Focus, Disabled, Loading, Error, ReadOnly, Filled, Selected |
| `Type` | Text, Password, Search, Number, Textarea |
| `Platform` | PC, Mobile, Tablet |

---

### 6-4. Layer Naming Convention (코드 생성 영향)

| 레이어명 | 역할 |
|---|---|
| `.bg` | 배경 레이어 |
| `.border` | 테두리 오버레이 |
| `.label` | 텍스트 레이어 |
| `.icon` | 아이콘 레이어 |
| `.icon-left` | 좌측 아이콘 |
| `.icon-right` | 우측 아이콘 |
| `.placeholder` | 플레이스홀더 텍스트 |
| `.overlay` | 모달 배경 오버레이 |
| `.thumb` | 토글 핸들 |
| `.track` | 토글 트랙 |

---

## 7. 발표자료 슬라이드 기본값

| 속성 | 값 |
|---|---|
| 비율 | 16:9 (1920×1080px 또는 1280×720px) |
| 배경 | `color-bg-surface` (흰색) 또는 `color-bg-page` |
| 여백 | 상하 48px, 좌우 64px |
| 제목 슬라이드 | Display-L + Body-XL 부제 + `color-primary` 강조 |
| 본문 슬라이드 | H2 + Body-L 불릿 (최대 5줄) |
| 구분선 | `color-border-default` 1px |
| 강조 색상 | `color-primary` 언더라인 또는 배경 |
