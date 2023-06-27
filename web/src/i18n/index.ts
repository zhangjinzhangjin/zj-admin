import { useAppStoreWithOut } from "@/store/modules/app";
import type { App } from "vue";
import { createI18n } from "vue-i18n";
import type { I18n, I18nOptions } from "vue-i18n";
import element_zhCN from "element-plus/es/locale/lang/zh-cn";
import element_en from "element-plus/es/locale/lang/en";
export let i18n: ReturnType<typeof createI18n>;
export const elLocaleMap = {
  "zh-CN": element_zhCN,
  en: element_en,
};
const appStore = useAppStoreWithOut();
const locale = appStore.locale;
const setHtmlPageLang = (locale: string) => {
  document.querySelector("html")?.setAttribute("lang", locale);
};
export const setupI18n = async (app: App<Element>) => {
  setHtmlPageLang(locale);
  const defaultLocal = await import(`./langs/${locale}.ts`);
  const message = defaultLocal.default ?? {};
  let options: I18nOptions = {
    globalInjection: true,
    legacy: false,
    locale,
    fallbackLocale: "zh-CN",
    messages: {
      [locale]: message,
    },
    availableLocales: ["zh-CN", "en"],
    sync: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
  };
  i18n = createI18n(options) as I18n;
  app.use(i18n);
};
export const setLocaleMessages = async (lang: string, messageObj: object) => {
  const defaultLocal = await import(`./langs/${lang}.ts`);
  i18n.global.setLocaleMessage(lang, {
    ...elLocaleMap[lang],
    ...defaultLocal.default,
    ...messageObj,
  });
};
// 修复i18n在ts中引用useI18n的bug
// type I18nGlobalTranslation = {
//   (key: string): string
//   (key: string, locale: string): string
//   (key: string, locale: string, list: unknown[]): string
//   (key: string, locale: string, named: Record<string, unknown>): string
//   (key: string, list: unknown[]): string
//   (key: string, named: Record<string, unknown>): string
// }
// type I18nTranslationRestParameters = [string, any]
// export const useI18n = (): {
//   t: I18nGlobalTranslation
// } => {
//   const normalFn = {
//     t: (key: string) => {
//       return key
//     }
//   }
//   if (!i18n) {
//     return normalFn
//   }
//   const { t, ...methods } = i18n.global
//   const tFn: I18nGlobalTranslation = (key: string, ...arg: any[]) => {
//     if (!key) return ''
//     return t(key, ...(arg as I18nTranslationRestParameters))
//   }
//   return {
//     ...methods,
//     t: tFn
//   }
// }
