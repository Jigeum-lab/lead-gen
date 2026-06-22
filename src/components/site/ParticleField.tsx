import { useEffect, useRef } from "react";

/**
 * 파티클/점 네트워크 배경 — React 아일랜드(장식 전용).
 * 의존성 없는 canvas 2D. 라이트 미니멀: 옅은 블루/시안 점 + 가까운 점끼리 연결선.
 * 접근성/성능: prefers-reduced-motion 정지, 탭 비활성 시 정지, DPR 대응, 언마운트 정리.
 *
 * ⚠️ 장식이므로 텍스트를 담지 않는다(SEO/GEO: 카피는 정적 HTML에).
 */
interface Props {
  /** 파티클 개수 기준(면적에 따라 자동 가감). 기본 70 */
  count?: number;
  /** 다크 배경용 밝은 색 팔레트 */
  dark?: boolean;
}

export default function ParticleField({ count = 70, dark = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRGB = dark ? "120, 180, 255" : "0, 87, 255";
  const lineRGB = dark ? "90, 160, 255" : "0, 87, 255";
  const lineMax = dark ? 0.3 : 0.18;
  const dotAlpha = dark ? 0.85 : 0.55;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number };
    let particles: P[] = [];

    const seed = () => {
      const target = Math.round((count * (w * h)) / (1280 * 600));
      const n = Math.max(24, Math.min(target, 140));
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const LINK = 130; // 연결선 임계 거리
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      // 연결선
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const o = (1 - dist / LINK) * 0.18;
            ctx.strokeStyle = `rgba(0, 87, 255, ${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // 점
      for (const p of particles) {
        ctx.fillStyle = "rgba(0, 87, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    if (reduce) {
      draw(); // 정지 프레임 1장
    } else {
      start();
    }

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    const onVis = () => (document.hidden || reduce ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />;
}
