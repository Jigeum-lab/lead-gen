---
name: client-brand
description: >
  프로젝트/기능의 브랜드 아이덴티티(색상·타이포·톤)를 추출해
  product/{project}/brand.md로 저장한다.
  Skein 내부 기능이라면 src/app/globals.css 토큰을 오버라이드하는 방식으로 적용.
  "브랜드 색상 뽑아줘", "brand.md 만들어줘", "브랜드 가이드 정리해줘" 등에 트리거.
when_to_use: >
  킥오프 후 브랜드 항목 수집 시. 클라이언트/파트너 브랜드가 있거나
  특정 기능에 독립적인 색상 팔레트가 필요할 때.
type: encoded-preference
version: 1.1.0
---

# 브랜드 가이드라인 스킬

브랜드 아이덴티티를 수집·구조화해 `product/{project}/brand.md`로 저장한다.

**Skein 기본 테마**: 친근 라이트, 소프트 퍼플 액센트 (`oklch(0.55 0.18 292)`), Inter.
→ 별도 브랜드 없으면 이 기본값 사용 — brand.md 불필요.

---

## 수집 항목

### 필수 (없으면 기본값 사용)

| 항목 | 질문 | 기본값 |
|---|---|---|
| Primary 색상 | "주요 브랜드 색상이 있나요?" | Skein 퍼플 토큰 |
| Secondary 색상 | "보조·포인트 색상이 있나요?" | Skein accent 토큰 |
| 폰트 | "사용 폰트가 있나요?" | Inter |

### 선택

| 항목 | 질문 |
|---|---|
| 브랜드 톤 | "느낌: 신뢰감 / 친근함 / 전문성 / 혁신적 중 택1~2" |
| 금지 요소 | "특정 색상·스타일 피해야 하는 것 있나요?" |

---

## 출력 형식 (brand.md 템플릿)

```markdown
---
project: {프로젝트명}
updated: YYYY-MM-DD
source: interview | brand-guide-pdf | website
---

## 색상

- primary: {값 또는 CSS 토큰}
- secondary: {값 또는 CSS 토큰}
- text: #1A1A1A
- background: #FFFFFF

## 타이포그래피

- heading: Inter
- body: Inter

## 브랜드 톤

- 키워드: ...
- 금지: (없으면 생략)

## Skein 토큰 오버라이드

이 브랜드를 반영하려면 src/app/globals.css 에서 아래 토큰 수정:
- --primary: {oklch 변환값}
- --accent: {oklch 변환값}
```

---

## 색상 정보 없을 때 업종별 기본 팔레트

| 업종 | Primary | Secondary |
|---|---|---|
| Tech / AI / SaaS | oklch(0.55 0.18 292) | oklch(0.65 0.15 200) |
| Healthcare | oklch(0.35 0.15 260) | oklch(0.65 0.12 210) |
| F&B | oklch(0.55 0.20 30) | oklch(0.85 0.15 80) |
| Finance | oklch(0.40 0.15 255) | oklch(0.70 0.15 60) |
| Education | oklch(0.50 0.20 270) | oklch(0.65 0.15 210) |
| 기타 | oklch(0.40 0.05 250) | oklch(0.60 0.05 250) |

---

## Constraints

- HEX만 받은 경우 oklch로 변환해 기재 (CSS 변수 호환)
- brand.md 경로: `product/{project}/brand.md` — product-context.md와 같은 디렉토리
- Skein 내부 기능이면 globals.css 오버라이드 섹션 반드시 포함
- 브랜드 색상은 src/app/globals.css 토큰으로만 적용 — 컴포넌트에 직접 하드코딩 금지
