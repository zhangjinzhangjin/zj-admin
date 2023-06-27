import { defineStore } from "pinia";
import { store } from "../index";
import { appModules } from "@/config";
import { useStorage } from "@/utils/storage";
const storage = useStorage();
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => appModules,
  getters: {
    getShowSettings(): boolean {
      return this.showSettings;
    },
    getCollapse(): boolean {
      return this.collapse;
    },
    getSize(): ElememtPlusSize {
      return this.size;
    },
    getLocale(): string {
      return this.locale;
    },
    getLogo(): boolean {
      return this.logo;
    },
    getGreyMode(): boolean {
      return this.greyMode;
    },
    getLayout(): LayoutType {
      return this.layout;
    },
    getTitle(): string {
      return this.title;
    },
    getTheme(): string {
      return this.theme;
    },
    getPrimaryColor(): string {
      return this.primaryColor;
    },
    getNavHeadBgColor(): string {
      return this.navHeadBgColor;
    },
    getParam(): object {
      return this.param;
    },
  },
  actions: {
    setShowSettings(showSettings: boolean) {
      this.showSettings = showSettings;
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse;
    },
    setSize(size: ElememtPlusSize) {
      this.size = size;
    },
    setLocale(locale: string) {
      this.locale = locale;
      storage.set("locale", this.locale);
    },
    setLogo(logo: boolean) {
      this.logo = logo;
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode;
    },
    setLayout(layout: LayoutType) {
      this.layout = layout;
      storage.set("layout", this.layout);
    },
    setTitle(title: string) {
      this.title = title;
    },
    setTheme(theme: string) {
      this.theme = theme;
      storage.set("theme", this.theme);
    },
    setPrimaryColor(primaryColor: string) {
      this.primaryColor = primaryColor;
      storage.set("primaryColor", this.primaryColor);
    },
    setNavHeadBgColor(navHeadBgColor: string) {
      this.navHeadBgColor = navHeadBgColor;
      storage.set("navHeadBgColor", this.navHeadBgColor);
    },
    setParam(param: object) {
      this.param = param;
    },
  },
});
export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
