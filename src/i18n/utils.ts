import { ui, defaultLang, type Lang } from "./ui";

/** Astro.currentLocale → 안전한 Lang */
export function getLang(locale: string | undefined): Lang {
  return locale === "en" ? "en" : defaultLang;
}

/** 해당 언어의 사전 */
export function useT(locale: string | undefined) {
  return ui[getLang(locale)];
}

// 영어판이 존재하는 라우트 (번역 완료 시 추가 → 404 방지)
export const EN_ROUTES = new Set<string>(["/"]);

function enPath(koPath: string): string {
  return "/en" + (koPath === "/" ? "/" : koPath);
}

/** 루트 기준 경로(/solutions/)를 언어에 맞게. en이고 번역된 라우트면 /en 접두, 아니면 한국어 경로 폴백. */
export function localizePath(path: string, lang: Lang): string {
  if (lang === "en" && EN_ROUTES.has(path)) return enPath(path);
  return path;
}

/** 현재 경로를 반대 언어 경로로 변환 (언어 스위처용). 미번역 시 해당 언어 홈으로 폴백. */
export function switchLangUrl(pathname: string, target: Lang): string {
  const koPath = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  if (target === "ko") return koPath;
  return EN_ROUTES.has(koPath) ? enPath(koPath) : "/en/";
}
