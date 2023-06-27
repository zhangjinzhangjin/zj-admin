import "animate.css";
import "@/styles/global.scss";
import "element-plus/dist/index.css";
import "virtual:svg-icons-register"; // 引入注册脚本
import { createApp } from "vue";
import { setupStore } from "./store";
import { setupRouter } from "./router";
import { setupI18n } from "./i18n";
import { setupElementPlus } from "./plugins/element";
import { setupIcon } from "./components/SvgIcon";
import { setupDirectivs } from "./directives";
import App from "./App.vue";
import "./permission";
const setup = async (): Promise<void> => {
  const app = createApp(App);
  await setupI18n(app);
  setupStore(app);
  setupRouter(app);
  setupElementPlus(app);
  setupIcon(app);
  setupDirectivs(app);
  app.mount("#app");
};
setup();
