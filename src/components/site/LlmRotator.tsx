import { useEffect, useState } from "react";

/**
 * 히어로용 LLM 로테이터(React 아일랜드, 장식) — "당신의 브랜드는 [LLM]에 노출되고 있나요?"
 * 5개 LLM 로고+이름을 순환. SSR로 첫 항목(ChatGPT)이 정적 HTML에 남아 SEO 안전.
 * prefers-reduced-motion이면 순환 정지(첫 항목 고정). 폭 고정으로 레이아웃 시프트 방지.
 */
const LLMS = [
  { name: "ChatGPT", logo: "/ai/chatgpt.svg" },
  { name: "Perplexity", logo: "/ai/perplexity.svg" },
  { name: "Gemini", logo: "/ai/gemini.svg" },
  { name: "Claude", logo: "/ai/claude.svg" },
  { name: "Grok", logo: "/ai/grok.svg" },
];

export default function LlmRotator({ dark = false }: { dark?: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((p) => (p + 1) % LLMS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const cur = LLMS[i];
  return (
    <span className="relative inline-flex h-[1.4em] min-w-[8.5rem] items-center justify-center overflow-hidden align-middle sm:min-w-[10rem]">
      <span
        key={i}
        className="inline-flex items-center gap-2 duration-500 animate-in fade-in slide-in-from-bottom-3"
      >
        <img src={cur.logo} alt="" width="28" height="28" className="size-6 sm:size-7" />
        <span className={dark ? "font-bold text-white" : "font-bold text-primary"}>{cur.name}</span>
      </span>
    </span>
  );
}
