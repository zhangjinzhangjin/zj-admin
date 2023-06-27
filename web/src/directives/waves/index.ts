import type { App } from "vue";
import waves from "./waves";
export const setupWaves = (app: App<Element>) => {
  app.directive("waves", waves);
};
