import type { App } from "vue";
import { setupWaves } from "./waves";

export const setupDirectivs = (app: App<Element>) => {
  setupWaves(app);
};
