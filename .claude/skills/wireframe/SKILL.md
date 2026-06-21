---
name: wireframe
description: >
  IA·기능명세서를 입력으로 Lo-fi 화면설계서(ASCII 와이어프레임 + Description 패널)를
  작성하고 product/{project}/ux/wireframes.md로 저장하는 스킬.
  "화면설계서 작성", "와이어프레임 만들어줘", "Lo-fi 설계서", "화면 구조 그려줘" 등
  Lo-fi 화면설계·와이어프레임·화면 구조 관련이면 어떤 표현이든 트리거.
  Hi-fi 코드 생성·브랜드 가이드·기능명세서 초안·IA 구조 설계에는 트리거하지 않음.
type: encoded-preference
version: 1.1.0
---

# Wireframe Skill

Lo-fi 화면설계서 작성 → `product/{project}/ux/wireframes.md` 저장.

레퍼런스 이미지:
- `references/phase-on-cover.png` — 표지 스타일
- `references/phase-on-inner-pc.png` — 내지 PC 3-Zone 레이아웃
- `references/phase-on-inner-mobile.png` — 내지 모바일 레이아웃
- `references/phase-on-components.png` — 컴포넌트 스타일 모음
- `references/phase-on-history.png` — 개정 이력 테이블 스타일

## Workflow

### Phase 1 — Input Gate

필수 입력 확인. 없으면 HARD-GATE 중단.

1. **PRD 승인 확인**: `product/{project}/PRD.md` 로드 → `approved: true` 필수
   ```
   ❌ [HARD-GATE] PRD가 미승인(approved: false) 상태입니다.
   PRD 검토 후 approved: true로 변경하세요.
   ```
2. **IA 문서**: `product/{project}/ux/ia-userflow.md` 존재 여부
   ```
   ❌ [HARD-GATE] ia-userflow.md가 없습니다. /user-flow 를 먼저 실행하세요.
   ```
3. **기능명세서**: `product/{project}/ux/functional-spec.md` 존재 여부
   ```
   ❌ [HARD-GATE] functional-spec.md가 없습니다. /functional-spec 을 먼저 실행하세요.
   ```

### Phase 1-B — Output Gate

`product/{project}/ux/wireframes.md` 존재 시:
- 파일 로드 → 버전·완성 화면 수 한 줄 표시
- AUQ: "특정 화면 추가·수정 | 전체 재작성 | 현황 확인만"
- 선택에 따라 분기.

### Phase 2 — Screen Inventory

IA에서 화면 목록 추출 → 화면ID 부여.

| 화면ID | 화면명 | 경로 | 기능ID | 플랫폼 |
|---|---|---|---|---|
| PC200001 | 홈 | / | F001 | PC |
| M200001 | 홈 | / | F001 | Mobile |

PC/Mobile은 별도 항목으로 분리.

### Phase 3 — ASCII 와이어프레임 작성

화면 헤더 블록:
```
화면 경로: /path
화면 ID: PC200001 | 버전: v0.1.0
화면명: [화면명] | 작성일: YYYY.MM.DD
```

박스 문자(`┌ ┐ └ ┘ │ ─ ┬ ┴ ├ ┤ ┼`) + 번호 태그(①②③). 컬러 코드·실제 이미지 금지.

### Phase 4 — Description 패널

각 번호 영역(①②③)에 1:1 매핑:
```
01 [영역명]
• 표출 데이터: ...
• 인터랙션: 클릭 → /path 이동
• 상태: 정상 / 로딩 / 에러(빈 상태)
• 기능 참조: F001
• 사용할 컴포넌트: shadcn Button | Card | ... (힌트)
```

### Phase 5 — 저장

`product/{project}/ux/wireframes.md`에 ASCII 와이어프레임 저장.
`product/{project}/manifest.md` 업데이트: wireframes 행 `✅ 완료`, 완성 화면 수·날짜 기입.

## Constraints

- Lo-fi: 컬러 코드·실제 이미지·브랜드 색상 금지
- Description placeholder("내용 입력") 금지 — 불확실하면 `(확인 필요)` 사용
- PC/Mobile 혼재 금지 — 별도 섹션 분리
- 버전 단일화 — 동일 화면 여러 버전 공존 금지
- 경로 기준: `product/{project}/` (Skein 프로젝트 루트 하위)

## Anti-Triggers

- Hi-fi 코드 생성 → `/hi-fi` 스킬
- 기능명세서 작성 → `/functional-spec` 스킬
- IA 설계 → `/user-flow` 스킬
