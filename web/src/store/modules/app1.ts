import { defineStore } from "pinia";
import { store } from "../index";
import { appModules } from '@/config'
export const useAppStore = defineStore({
  id: "app1",
  state() {
    return {
      ...appModules,
      locale: "zh-CN",
      app: "zj",
      count: 1,
    };
  },
  getters: {
    doubleCount(): number {
      return this.count * 2;
    },
  },
  actions: {
    setApp(data: string): void {
      this.app = data;
    },
    setCount(data: number): void {
      this.count = data;
    },
  },
});
export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
