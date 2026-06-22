// 다국어 사전 — 컴포넌트는 Astro.currentLocale로 lang을 받아 ui[lang]에서 문자열을 읽는다.
export const languages = { ko: "한국어", en: "English" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "ko";

export const ui = {
  ko: {
    nav: {
      links: [
        ["솔루션", "/solutions/"],
        ["AVO", "/ai-visibility-optimization/"],
        ["가격", "/pricing/"],
        ["용어집", "/glossary/"],
        ["회사소개", "/about/"],
      ] as [string, string][],
      cta: "무료 진단 요청",
      menuOpen: "메뉴 열기",
      menuClose: "메뉴 닫기",
      home: "LeadGenLab 홈",
    },
    hero: {
      badge: "AI Visibility Optimization",
      title1: "AI가 추천하는 브랜드,",
      title2: "그 구조에 브랜드를 배치합니다",
      rotatorPre: "당신의 브랜드는",
      rotatorPost: "에 노출되고 있나요?",
      lead: "AI 추천 최적화로 Agentic Commerce 변화에 먼저 대응하세요. AI 답변 내 브랜드 언급량과 점유율(SoV), 추천 순위를 측정하고 개선합니다.",
      ctaPrimary: "AI 가시성 무료 진단 요청",
      ctaSecondary: "회사소개서 보기",
    },
    stats: [
      { to: 32, suffix: "+", label: "함께한 브랜드·고객사" },
      { to: 5, suffix: "", label: "주요 AI 엔진 커버" },
      { to: 6, suffix: "단계", label: "AVO 프레임워크" },
    ],
    logos: {
      caption: "SK · 하나 · KB · 두산 등 32개+ 브랜드와 함께합니다",
      pause: "로고 흐름 일시정지",
      play: "로고 흐름 재생",
    },
    problems: {
      eyebrow: "왜 지금인가",
      title: "검색이 AI 대화로 바뀌고 있습니다",
      lead: "소비자는 더 이상 링크를 클릭해 비교하지 않습니다. AI에게 묻고, AI의 요약을 읽고, AI의 추천을 신뢰합니다. 브랜드가 AI 후보군에 없으면 존재하지 않는 것과 같습니다.",
      items: [
        { t: "고객은 더 이상 탐색하지 않습니다", d: "소비자의 정보 탐색 방식이 근본적으로 바뀌고 있습니다. 검색창이 아닌 AI 채팅창에 질문을 입력합니다." },
        { t: "AI가 비교하고 압축하고 추천합니다", d: "AI가 대신 비교하고, 압축하고, 추천합니다. 고객과 브랜드가 만나는 시작점이 ‘AI 답변’으로 이동하고 있습니다." },
        { t: "장바구니까지 AI가 채우는 시대입니다", d: "Agentic Commerce 시대에는 구매 결정부터 실행까지 AI가 대신합니다. 브랜드가 AI 후보군에 없으면 존재하지 않는 것과 같습니다." },
      ],
    },
    framework: {
      eyebrow: "AVO Framework",
      title: "AI가 브랜드를 선택하게 만드는 6단계",
      lead: "무작정 노출을 늘리는 콘텐츠 살포가 아니라, AI 의사결정 퍼널 안에 브랜드를 전략적으로 배치하는 구조 설계입니다.",
      steps: [
        ["01", "AI 질문 구조 분석", "소비자가 AI에게 던지는 질문 유형을 분류합니다."],
        ["02", "브랜드 엔티티 재정의", "AI가 브랜드를 정확히 인식하도록 구조화된 엔티티 데이터를 설계합니다."],
        ["03", "콘텐츠 아키텍처 설계", "AI가 이해하고 재사용할 수 있는 구조로 콘텐츠를 설계합니다."],
        ["04", "Authority Seeding", "AI가 신뢰 신호로 판단할 수 있는 외부 근거를 축적합니다."],
        ["05", "Conversion Alignment", "AI 추천 흐름 안에서 자연스럽게 전환이 일어나는 구조를 만듭니다."],
        ["06", "Measurement & Optimization", "AI 노출과 선택 데이터를 기반으로 구조를 지속 강화합니다."],
      ],
    },
    metrics: {
      eyebrow: "성과 측정",
      title: "추상적 보고가 아니라, 데이터로 증명합니다",
      lead: "AI가 실제로 브랜드를 어떻게 다루는지 구조적으로 측정하고, 측정 → 분석 → 개선 → 재설계의 루프로 점유율을 만듭니다.",
      items: [
        ["브랜드 언급률", "주요 질문군에서 AI가 브랜드를 언급하는 빈도 개선"],
        ["비교 질문 포함률", "비교 질문에서 후보군에 포함되는 비율 상승"],
        ["최종 추천 선택 확률", "추천 맥락에서 브랜드가 최종 선택되는 확률 증가"],
        ["쿼리 커버리지", "산업 질문군 대비 브랜드 노출 질문 범위 확장"],
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "자주 묻는 질문",
      items: [
        ["AI 가시성, 왜 중요한가요?", "소비자는 이제 검색 결과를 일일이 클릭하지 않고, AI에게 질문하고 요약·비교·추천을 받습니다. AI Commerce 시대에는 ‘AI가 추천할 확률’이 곧 경쟁력입니다."],
        ["AVO는 SEO와 무엇이 다른가요?", "SEO가 검색 결과 상위 노출을 목표로 한다면, AVO는 AI가 답변을 생성할 때 브랜드를 비교·추천 구조 안에 포함시키는 것입니다. 두 전략은 대체 관계가 아니라 통합되어야 합니다."],
        ["AI 답변에 우리 브랜드가 포함되는지 어떻게 확인하나요?", "AI 답변 내 브랜드 언급률, 비교 포함 여부, 추천 단계 포함 여부 등을 정기적으로 분석해 구조적으로 확인합니다."],
        ["콘텐츠를 AI 자동화로 제작하나요?", "아닙니다. 인터뷰·자료 분석·구조 설계를 통해 AI 인용에 적합한 콘텐츠를 수작업으로 제작합니다."],
        ["지금 시작하지 않으면 어떻게 되나요?", "AI 학습은 누적 구조입니다. AI Commerce 환경에서는 선점 속도 자체가 전략 자산이 됩니다."],
      ],
    },
    cta: {
      title: "AI가 대신 구매하는 시대, 최적화를 마치셨나요?",
      lead: "아직 시작하지 않으셨다면, 리드젠랩이 가장 빠른 해결책을 찾아드립니다.",
      ctaPrimary: "AI 가시성 무료 진단 요청",
      ctaSecondary: "Case Study 보기",
    },
    footer: {
      tagline: "AI Visibility Optimization No.1 전문 기업",
      desc: "AI가 추천하는 브랜드가 되도록, AVO Framework로 AI 가시성을 설계·실행·측정합니다.",
      cols: [
        { title: "서비스", links: [["솔루션", "/solutions/"], ["AI 가시성 최적화(AVO)", "/ai-visibility-optimization/"], ["AI Commerce", "/ai-commerce/"], ["가격 안내", "/pricing/"]] },
        { title: "리소스", links: [["AI 검색 용어집", "/glossary/"], ["고객사·파트너", "/partners/"], ["비전", "/vision/"]] },
        { title: "회사", links: [["회사소개", "/about/"], ["문의하기", "/contact/"]] },
      ] as { title: string; links: [string, string][] }[],
      addr1: "대표 이효석 · 사업자등록번호 109-19-69346",
      addr2: "서울시 성동구 성수일로 99 서울숲AK밸리 8층 · 강남 가로수길 72 · 인천 송도 글로벌 GTM센터",
    },
  },

  en: {
    nav: {
      links: [
        ["Solutions", "/solutions/"],
        ["AVO", "/ai-visibility-optimization/"],
        ["Pricing", "/pricing/"],
        ["Glossary", "/glossary/"],
        ["About", "/about/"],
      ] as [string, string][],
      cta: "Free diagnosis",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      home: "LeadGenLab home",
    },
    hero: {
      badge: "AI Visibility Optimization",
      title1: "Become the brand AI recommends —",
      title2: "we place you inside that structure",
      rotatorPre: "Is your brand visible on",
      rotatorPost: "?",
      lead: "Get ahead of the shift to Agentic Commerce with AI recommendation optimization. We measure and improve your brand's mention volume, Share of Voice (SoV), and recommendation ranking inside AI answers.",
      ctaPrimary: "Request a free AI visibility diagnosis",
      ctaSecondary: "View company profile",
    },
    stats: [
      { to: 32, suffix: "+", label: "Brands & clients served" },
      { to: 5, suffix: "", label: "Major AI engines covered" },
      { to: 6, suffix: "-step", label: "AVO Framework" },
    ],
    logos: {
      caption: "Trusted by 32+ brands including SK, Hana, KB, and Doosan",
      pause: "Pause logo motion",
      play: "Play logo motion",
    },
    problems: {
      eyebrow: "Why now",
      title: "Search is shifting to AI conversation",
      lead: "Consumers no longer click links to compare. They ask AI, read its summary, and trust its recommendation. If your brand isn't in the AI candidate set, it effectively doesn't exist.",
      items: [
        { t: "Customers no longer browse", d: "How consumers discover information is fundamentally changing. They type questions into an AI chat, not a search bar." },
        { t: "AI compares, condenses, and recommends", d: "AI does the comparing, condensing, and recommending. The first touchpoint between customer and brand is moving to the ‘AI answer.’" },
        { t: "AI now even fills the cart", d: "In the Agentic Commerce era, AI handles everything from the purchase decision to execution. A brand missing from the AI candidate set is as good as nonexistent." },
      ],
    },
    framework: {
      eyebrow: "AVO Framework",
      title: "Six steps that make AI choose your brand",
      lead: "Not blindly flooding content for exposure, but structurally placing your brand inside the AI decision funnel.",
      steps: [
        ["01", "AI question structure analysis", "We classify the types of questions consumers ask AI."],
        ["02", "Brand entity redefinition", "We design structured entity data so AI recognizes your brand accurately."],
        ["03", "Content architecture design", "We structure content so AI can understand and reuse it."],
        ["04", "Authority Seeding", "We accumulate external evidence AI reads as trust signals."],
        ["05", "Conversion Alignment", "We build a structure where conversion happens naturally within the AI recommendation flow."],
        ["06", "Measurement & Optimization", "We continuously strengthen the structure based on AI exposure and selection data."],
      ],
    },
    metrics: {
      eyebrow: "Measurement",
      title: "Not abstract reports — proof in data",
      lead: "We structurally measure how AI actually treats your brand, and build share through a measure → analyze → improve → redesign loop.",
      items: [
        ["Brand mention rate", "Improving how often AI mentions your brand across key question sets"],
        ["Comparison inclusion rate", "Raising the rate of being included as a candidate in comparison queries"],
        ["Final recommendation rate", "Increasing the probability your brand is the final pick in recommendations"],
        ["Query coverage", "Expanding the range of queries that surface your brand across the industry"],
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        ["Why does AI visibility matter?", "Consumers no longer click through search results one by one — they ask AI and receive summaries, comparisons, and recommendations. In the AI Commerce era, the probability that AI recommends you is your competitiveness."],
        ["How is AVO different from SEO?", "Where SEO targets top ranking in search results, AVO is about getting your brand included in the comparison and recommendation structure when AI generates its answer. The two are not substitutes — they should be integrated."],
        ["How do you check whether our brand appears in AI answers?", "We regularly analyze brand mention rate, comparison inclusion, and recommendation-stage inclusion within AI answers to verify it structurally."],
        ["Do you produce content with AI automation?", "No. Through interviews, source analysis, and structural design, we hand-craft content suited for AI citation."],
        ["What happens if we don't start now?", "AI learning is cumulative. In the AI Commerce environment, speed of preemption itself becomes a strategic asset."],
      ],
    },
    cta: {
      title: "In an era where AI buys for the customer, have you finished optimizing?",
      lead: "If you haven't started yet, LeadGenLab will find you the fastest path.",
      ctaPrimary: "Request a free AI visibility diagnosis",
      ctaSecondary: "View case studies",
    },
    footer: {
      tagline: "The No.1 AI Visibility Optimization firm",
      desc: "We design, execute, and measure AI visibility with the AVO Framework so you become the brand AI recommends.",
      cols: [
        { title: "Services", links: [["Solutions", "/solutions/"], ["AI Visibility Optimization (AVO)", "/ai-visibility-optimization/"], ["AI Commerce", "/ai-commerce/"], ["Pricing", "/pricing/"]] },
        { title: "Resources", links: [["AI Search Glossary", "/glossary/"], ["Clients & Partners", "/partners/"], ["Vision", "/vision/"]] },
        { title: "Company", links: [["About", "/about/"], ["Contact", "/contact/"]] },
      ] as { title: string; links: [string, string][] }[],
      addr1: "CEO Hyoseok Lee · Business reg. 109-19-69346",
      addr2: "8F Seoul Forest AK Valley, 99 Seongsuil-ro, Seongdong-gu, Seoul · Garosu-gil 72, Gangnam · Songdo Global GTM Center, Incheon",
    },
  },
} as const;
