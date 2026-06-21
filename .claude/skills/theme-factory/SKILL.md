---
name: theme-factory
description: >
  발표자료·문서·HTML 등 산출물에 10개 pre-set 테마(컬러·폰트 세트)를 적용하는 스킬.
  theme-showcase.pdf로 테마 선택 후 일관된 스타일 적용. 커스텀 테마 생성도 지원.
type: encoded-preference
version: 1.0.0
when_to_use: >
  "테마 적용해줘", "슬라이드 스타일 잡아줘", "색상·폰트 통일해줘",
  발표자료·리포트·HTML 결과물 스타일링 시 트리거.
---

# Theme Factory Skill

10개 pre-set 테마로 발표자료·문서·리포팅·HTML 랜딩 페이지 등 산출물을 스타일링한다.
테마는 컬러 팔레트 + 폰트 페어링 세트로 구성됨.

## Usage

1. **테마 쇼케이스 표시**: `theme-showcase.pdf`를 유저에게 보여준다 (수정 금지, 그대로 표시)
2. **선택 요청**: 어떤 테마를 적용할지 확인
3. **선택 대기**: 명확한 확인 후 진행
4. **테마 적용**: `themes/` 폴더의 해당 테마 파일을 읽어 컬러·폰트 적용

## Available Themes (10개)

| # | 테마명 | 특성 |
|---|---|---|
| 1 | Ocean Depths | 전문적·차분한 해양 테마 |
| 2 | Sunset Boulevard | 따뜻하고 생동감 있는 선셋 컬러 |
| 3 | Forest Canopy | 자연적·안정적인 어스 톤 |
| 4 | Modern Minimalist | 깔끔한 현대적 그레이스케일 |
| 5 | Golden Hour | 풍부하고 따뜻한 가을 팔레트 |
| 6 | Arctic Frost | 시원하고 깨끗한 겨울 테마 |
| 7 | Desert Rose | 소프트하고 세련된 더스티 톤 |
| 8 | Tech Innovation | 굵고 모던한 테크 미학 |
| 9 | Botanical Garden | 신선하고 유기적인 가든 컬러 |
| 10 | Midnight Galaxy | 드라마틱한 코스믹 딥 톤 |

각 테마 상세 스펙: `themes/{테마명}.md`

## Custom Theme

기존 테마가 안 맞을 때: 입력 기반으로 새 테마 생성.
- 설명 받기 → 유사 테마 스타일로 컬러·폰트 생성
- 테마명(느낌·분위기 표현) 부여
- 검토 후 확인 → 산출물에 적용

## Anti-Triggers

- **클라이언트 브랜드 가이드 있을 때**: brand-guidelines 스킬 우선 적용, theme-factory는 보조
- **Figma 디자인 시스템 설정**: design-system 스킬 영역
- **코드·스크립트 스타일링**: CSS·코드 포맷팅은 별도 처리
