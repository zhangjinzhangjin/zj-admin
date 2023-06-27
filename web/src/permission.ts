import router from "./router";
import type { RouteRecordRaw } from "vue-router";
import { useTitle } from "@/utils/title";
import { useNProgress } from "@/plugins/nProgress";
import { usePermissionStoreWithOut } from "@/store/modules/permission";
// import { useAppStoreWithOut } from "@/store/modules/app";
import { useUserStoreWithOut } from "@/store/modules/user";
import { getToken } from "@/utils/auth";
// import { setLocaleMessages } from "./i18n";
import common from "@/common/index";
const permissionStore = usePermissionStoreWithOut();
const userStore = useUserStoreWithOut();
// const appStore = useAppStoreWithOut();
const { start, done } = useNProgress();
const whiteList = ["/redirect", "/login", "/icons", "/noRoutes", "/404"]; // 不重定向白名单
const appTitle = import.meta.env.VITE_APP_TITLE; // 配置在env文件里
router.beforeEach(async (to, from, next) => {
  start();
  const title = (appTitle + to?.meta?.title) as string;
  useTitle(title);
  let hasToken: null | string = null;
  hasToken = getToken();
  if (hasToken) {
    if (to.path === "/login") {
      // 登录页直接跳转到主页
      next({ path: "/" });
    } else {
      // 获取权限
      const role = userStore.getRole;
      if (role && role.length > 0) {
        next();
      } else {
        try {
          const res: any = await userStore.getInfo();
          const accessRoutes = await permissionStore.generateRoutes(res.role);
          // 获取当前用户权限可以访问的路由
          if (!accessRoutes.length) {
            const tipMessage = "当前用户无菜单权限，你需要重新登录";
            common.tip(tipMessage, "error");
            await userStore.logout();
            next(`/noRoutes`);
            return;
          } else {
            // setLocaleMessages(res.param.lang, res.i18n); // 设置多语言
            // appStore.setParam(res.param);
            accessRoutes.forEach((route) => {
              router.addRoute(route as unknown as RouteRecordRaw); // 动态添加可访问路由表
            });
            next({ ...to, replace: true });
          }
        } catch (error) {
          console.log(error);
          // 出问题时清空token，然后返回到登录页
          const tipMessage = "获取用户信息失败，请联系管理人员";
          common.tip(tipMessage, "error");
          await userStore.logout();
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    /* 没有token，未登录*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单 登录和重定向页
      next();
    } else {
      next(`/login?redirect=${to.path}`); // 不在白名单中，跳转到登录授权
    }
  }
});
router.afterEach((to) => {
  done(); // 结束Progress
});
