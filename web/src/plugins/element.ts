import type { App } from "vue";
import ElementPlus from 'element-plus'
export const setupElementPlus = async (app: App<Element>) => {
  app.use(ElementPlus);
};