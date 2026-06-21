---
name: hi-fi
description: >
  Lo-fi 와이어프레임(wireframes.md)을 입력으로 실제 Next.js + shadcn/ui + react-bits 코드를 생성하는 스킬.
  "Hi-fi 만들어줘", "컴포넌트 코드 생성해줘", "와이어프레임 구현해줘", "/hi-fi" 등
  화면 설계를 실제 코드로 변환하는 모든 요청에 트리거.
  Lo-fi 와이어프레임 작성·PRD·기능명세 초안에는 트리거하지 않음.
type: encoded-preference
version: 1.0.0
---

# Hi-Fi Code Generation Skill

Lo-fi 와이어프레임 → Next.js + shadcn/ui + react-bits 코드 생성.

---

## Phase 1 — Input Gate

**HARD-GATE**: `product/{project}/ux/wireframes.md` 존재 필수
→ 없으면 즉시 중단:
```
❌ [HARD-GATE] wireframes.md가 없습니다. /wireframe을 먼저 완료하세요.
```

**SOFT-GATE**: `src/app/globals.css` 확인
→ 항상 읽어서 현재 디자인 토큰 파악 (색상·폰트·간격 오버라이드 기준).

---

## Phase 1.5 — 디자인 시스템 파악

```bash
# 현재 Skein 디자인 토큰 확인
cat src/app/globals.css
```

`ui-ux-pro-max` 스킬로 해당 화면 유형에 맞는 디자인 방향 조회:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "{화면 유형 키워드}" --design-system -f markdown --stack shadcn
```

---

## Phase 2 — 스타일 방향 결정

AUQ: 구현할 화면 우선순위
- 모든 화면 순서대로
- 핵심 화면 3~5개 먼저
- 특정 화면 지정

---

## Phase 3 — 컴포넌트 준비

### shadcn/ui 컴포넌트 확인
```bash
ls src/components/ui/
```
필요한 컴포넌트가 없으면 설치:
```bash
npx shadcn@latest add <component-name>
```

### react-bits 애니메이션 컴포넌트 (필요 시)
```bash
npx shadcn@latest add "https://reactbits.dev/r/<ComponentName>-TS-TW"
```
설치 후 `src/components/<Name>.tsx` 상단에 `"use client"` 추가.

---

## Phase 4 — 코드 생성

### 파일 구조
```
src/
  app/
    {route}/
      page.tsx        ← 서버 컴포넌트 (데이터 페칭)
      _components/    ← 해당 페이지 전용 클라이언트 컴포넌트
  components/
    ui/               ← shadcn 컴포넌트 (수정 금지)
    {FeatureName}.tsx ← 공용 컴포넌트
```

### 코드 생성 규칙 (AGENTS.md 준수)

**색상 하드코딩 절대 금지**:
```tsx
// ✅
<div className="bg-primary text-primary-foreground border-border">
// ❌
<div className="bg-[#7C3AED]" style={{color: 'oklch(0.55 0.18 292)'}}>
```

**shadcn Base UI render prop** (asChild 금지):
```tsx
// ✅
<Button render={<Link href="/path" />}>이동</Button>
// ❌
<Button asChild><Link href="/path">이동</Link></Button>
```

**react-bits 컴포넌트**: 다크 하드코딩된 색상은 토큰으로 교체 후 사용:
```tsx
// SpotlightCard의 bg-neutral-900 → bg-card 로 변경
```

**Three.js 기반 컴포넌트** (Beams 등): `next/dynamic` + `ssr: false` 래핑:
```tsx
const Beams = dynamic(() => import('@/components/Beams'), { ssr: false })
```

### 화면당 생성 순서
1. 레이아웃 구조 (서버 컴포넌트)
2. 인터랙티브 부분 (클라이언트 컴포넌트, `"use client"`)
3. 로딩 상태 (`loading.tsx` 또는 skeleton)
4. 에러 상태 (`error.tsx` 또는 빈 상태 UI)

---

## Phase 5 — 품질 체크리스트

생성 후 확인:

### 코드 품질
- [ ] hex/oklch/rgb 직접 사용 없음 (globals.css 토큰만)
- [ ] shadcn 컴포넌트에 asChild 없음 (render prop 사용)
- [ ] `"use client"` 필요한 곳에만 (서버 컴포넌트 최대화)
- [ ] 이미지: `next/image` 사용, alt 텍스트 있음
- [ ] 링크: `next/link` 사용

### 접근성
- [ ] 클릭 가능 요소 44px 이상 터치 타겟
- [ ] 키보드 포커스 상태 visible
- [ ] aria-label (아이콘 버튼)

### 반응형
- [ ] 모바일 375px, 태블릿 768px, 데스크톱 1440px 동작 확인

---

## Phase 6 — 저장 및 보고

생성 완료 후:
1. `product/{project}/manifest.md` Hi-fi 행 `✅ 완료` 업데이트
2. 생성된 파일 목록 + 미결 사항 보고

---

## Constraints

- 화면당 파일 단위로 생성 — 전체를 한 번에 시도 금지
- shadcn `src/components/ui/` 파일 직접 수정 금지 — 래퍼 컴포넌트 생성
- react-bits 컴포넌트의 하드코딩된 다크 색상 반드시 토큰으로 교체
- Three.js 컴포넌트 반드시 `ssr: false` dynamic import

## Anti-Triggers

- Lo-fi 와이어프레임 작성 → `/wireframe` 스킬
- PRD·기능명세 작성 → `/prd`, `/functional-spec` 스킬
- QA 검토 → `/qa` 스킬
- 단순 버그 수정 → 직접 편집
