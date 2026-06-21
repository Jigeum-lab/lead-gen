---
project: lead-gen
type: brand
source: theme-factory (custom — LeadGenLab 실측 도출)
tokens_location: src/styles/global.css (@theme)
created: 2026-06-21
---

# LeadGenLab 브랜드 토큰

라이브 사이트(lead-gen.team)에서 도출한 브랜드 아이덴티티. **소스 오브 트루스는
`src/styles/global.css`의 `@theme`** — 이 문서는 근거·의도 기록용. 값 변경은 global.css에서.

## 아이덴티티 요약
- 성격: AI Commerce 시대의 AVO(AI Visibility Optimization) 전문 B2B SaaS. 신뢰·전문·테크-포워드.
- 무드: 딥 네이비/니어블랙 기반 + 일렉트릭 블루·시안 액센트 + 화이트 여백. 고대비, 깔끔.
- theme-factory 근접 프리셋: **Tech Innovation** (electric blue / neon cyan / dark gray / white).

## 컬러 (→ Tailwind 유틸리티)
| 역할 | 토큰 | 값 | 유틸리티 예 | 비고 |
|---|---|---|---|---|
| Primary (CTA·링크) | `--color-primary` | #0057FF | `bg-primary` `text-primary` | white 텍스트 대비 5.4:1 (AA) |
| Primary hover | `--color-primary-hover` | #0042CC | `hover:bg-primary-hover` | |
| Primary active | `--color-primary-active` | #0036A8 | | |
| Primary subtle | `--color-primary-subtle` | #EAF1FF | `bg-primary-subtle` | 강조 배경 |
| On primary | `--color-on-primary` | #FFFFFF | `text-on-primary` | |
| Accent (장식) | `--color-accent` | #00D4FF | `text-accent`(다크 위)·그래픽 | **흰 배경 텍스트 금지** (대비 부족) |
| Accent soft | `--color-accent-soft` | #B9F1FF | | |
| Ink (다크 섹션) | `--color-ink` | #0A0A0A | `bg-ink` | 푸터·히어로 밴드 |
| Ink soft | `--color-ink-soft` | #16181D | | |
| Page bg | `--color-page` | #FFFFFF | `bg-page` | |
| Surface | `--color-surface` | #FFFFFF | `bg-surface` | 카드 |
| Muted bg | `--color-muted` | #F4F6F9 | `bg-muted` | 섹션 구분 |
| Text | `--color-fg` | #0A0A0A | `text-fg` | 19:1 |
| Text muted | `--color-fg-muted` | #5B6472 | `text-fg-muted` | ~5:1 (AA) |
| Text subtle | `--color-fg-subtle` | #8A93A2 | `text-fg-subtle` | 대형/힌트 전용 |
| On dark | `--color-on-dark` | #FFFFFF | `text-on-dark` | 다크 위 본문 |
| On dark muted | `--color-on-dark-muted` | #B4BCC8 | `text-on-dark-muted` | |
| Border | `--color-border` | #E2E8F0 | `border-border` | |
| Border strong | `--color-border-strong` | #CBD5E1 | `border-border-strong` | |
| Success/Warning/Danger | `--color-success/-warning/-danger` | #16A34A/#F59E0B/#DC2626 | | |

## 타이포그래피
- 본문/UI: **Pretendard** (한국어 기본). 폴백 Inter → system-ui. `--font-sans` / `font-sans`.
- 로드: `Layout.astro`에서 Pretendard variable dynamic-subset CDN.
- 모노: JetBrains Mono (`--font-mono`).
- 스케일·행간은 `design-system` 스킬 §2 Type Scale 사용.

## Radius / Shadow
- radius: md 8px(버튼·인풋) · lg 12px(카드) · xl 16px(패널) · 2xl 24px(대형).
- shadow: `shadow-card`(카드 기본) · `shadow-lift`(hover/부상).

## 사용 규칙
- **하드코딩 금지**: hex/rgb 직접 사용 금지 → 위 토큰 유틸리티만 (design-system·hi-fi 준수).
- accent(시안)는 다크 배경·그래픽·아이콘 강조에만. 흰 배경 위 본문/버튼 텍스트로 사용 금지.
- 다크 섹션: `bg-ink` + `text-on-dark`(보조 `text-on-dark-muted`).
- 다크모드 전역 토글은 현재 미적용(필요 시 `.dark` 토큰 재정의로 확장).
