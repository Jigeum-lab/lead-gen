import { ui, defaultLang, type Lang } from "./ui";

/** Astro.currentLocale → 안전한 Lang */
export function getLang(locale: string | undefined): Lang {
  return locale === "en" ? "en" : defaultLang;
}

/** 해당 언어의 사전 */
export function useT(locale: string | undefined) {
  return ui[getLang(locale)];
}

// 영어판이 존재하는 라우트. 용어집은 20개 전부 번역되어 /glossary/* 전체를 prefix로 처리.
export const EN_ROUTES = new Set<string>([
  "/",
  "/solutions/",
  "/pricing/",
  "/partners/",
  "/about/",
  "/vision/",
  "/contact/",
  "/ai-commerce/",
  "/ai-visibility-optimization/",
  "/glossary/",
]);

/** 해당 한국어 경로에 영어판이 있는가 */
export function hasEnVersion(koPath: string): boolean {
  return EN_ROUTES.has(koPath) || koPath.startsWith("/glossary/");
}

function enPath(koPath: string): string {
  return "/en" + (koPath === "/" ? "/" : koPath);
}

/** 루트 기준 경로(/solutions/)를 언어에 맞게. en이고 번역된 라우트면 /en 접두, 아니면 한국어 경로 폴백. */
export function localizePath(path: string, lang: Lang): string {
  if (lang === "en" && hasEnVersion(path)) return enPath(path);
  return path;
}

/** 현재 경로를 반대 언어 경로로 변환 (언어 스위처용). 미번역 시 해당 언어 홈으로 폴백. */
export function switchLangUrl(pathname: string, target: Lang): string {
  const koPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  if (target === "ko") return koPath;
  return hasEnVersion(koPath) ? enPath(koPath) : "/en/";
}
