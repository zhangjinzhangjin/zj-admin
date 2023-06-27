import router from "@/router";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { defineStore } from "pinia";
import { store } from "../index";
export interface TagsViewState {
  visitedViews: RouteLocationNormalizedLoaded[];
  cachedViews: Array<string>;
}
export const useTagsViewStore = defineStore({
  id: "tagsView",
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: [],
  }),
  getters: {
    getVisitedViews(): RouteLocationNormalizedLoaded[] {
      return this.visitedViews;
    },
    getCachedViews(): string[] {
      return this.cachedViews;
    },
  },
  actions: {
    // 新增缓存和tag
    addView(view: RouteLocationNormalizedLoaded): void {
      this.addVisitedView(view);
      this.addCachedView(view);
    },
    // 新增tag
    addVisitedView(view: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.path === view.path)) return;
      if (view.meta?.noTagsView) return;
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || "no-name",
        })
      );
      if (this.visitedViews.length > 6) {
        // 控制tab显示6个
        this.visitedViews.splice(1, 1);
      }
    },
    // 新增缓存
    addCachedView(view: RouteLocationNormalizedLoaded) {
      const name = view.name as string;
      if (this.cachedViews.includes(name)) return;
      if (!view.meta.noCache) {
        this.cachedViews.push(name);
      }
    },
    // 删除缓存和tag
    delView(view: RouteLocationNormalizedLoaded): Promise<TagsViewState> {
      return new Promise((resolve) => {
        this.delVisitedView(view);
        this.delCachedView(view);
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        });
      });
    },
    // 删除tag
    delVisitedView(
      view: RouteLocationNormalizedLoaded
    ): Promise<RouteLocationNormalizedLoaded[]> {
      return new Promise((resolve) => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1);
            break;
          }
        }
        resolve([...this.visitedViews]);
      });
    },
    // 删除缓存
    delCachedView(view: RouteLocationNormalizedLoaded): Promise<Array<string>> {
      return new Promise((resolve) => {
        const name = view.name as string;
        const index = this.cachedViews.indexOf(name);
        index > -1 && this.cachedViews.splice(index, 1);
        resolve([...this.cachedViews]);
      });
    },
    // 删除所有缓存和tag
    delAllViews(): Promise<TagsViewState> {
      return new Promise(async (resolve) => {
        await this.delAllVisitedViews();
        await this.delAllCachedViews();
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        });
      });
    },
    // 删除所有tag
    delAllVisitedViews(): Promise<RouteLocationNormalizedLoaded[]> {
      return new Promise((resolve) => {
        const affixTags = this.visitedViews.filter((tag) => tag.meta.affix);
        this.visitedViews = affixTags;
        resolve([...this.visitedViews]);
      });
    },
    // 删除所有缓存
    delAllCachedViews(): Promise<Array<string>> {
      return new Promise((resolve) => {
        this.cachedViews = [];
        resolve([...this.cachedViews]);
      });
    },
    // 删除其他
    delOthersViews(
      view: RouteLocationNormalizedLoaded
    ): Promise<TagsViewState> {
      return new Promise((resolve) => {
        this.delOthersVisitedViews(view);
        this.delOthersCachedViews(view);
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        });
      });
    },
    // 删除其他tag
    delOthersVisitedViews(
      view: RouteLocationNormalizedLoaded
    ): Promise<RouteLocationNormalizedLoaded[]> {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => {
          return v?.meta?.affix || v.path === view.path;
        });
        resolve([...this.visitedViews]);
      });
    },
    // 删除其他缓存
    delOthersCachedViews(
      view: RouteLocationNormalizedLoaded
    ): Promise<Array<string>> {
      return new Promise((resolve) => {
        const name = view.name as string;
        const index = this.cachedViews.indexOf(name);
        if (index > -1) {
          this.cachedViews = this.cachedViews.slice(index, index + 1);
        } else {
          // if index = -1, there is no cached tags
          this.cachedViews = [];
        }
        resolve([...this.cachedViews]);
      });
    },
    updateVisitedView(view: RouteLocationNormalizedLoaded) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    },
  },
});
export const useTagsViewStoreWithOut = () => {
  return useTagsViewStore(store);
};
