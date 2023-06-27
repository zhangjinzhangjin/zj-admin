import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import type { App } from "vue";
import Layout from "@/layout/index.vue";
export const constantRouterMap: AppRouteRecord[] = [
  // {
  //   path: "/zj",
  //   name: "zj",
  //   component: () => import("../views/ZjView.vue"),
  // },
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    name: "redirect",
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("../views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/index.vue"),
    hidden: true,
  },
  {
    path: "/icons",
    name: "icons",
    component: Layout,
    redirect: "/icons/all",
    icon: "money",
    label: "图标",
    children: [
      {
        path: "/icons/all",
        component: () => import("@/views/icons/index.vue"),
        menuType: "static",
        label: "全部图标",
        name: "iconsAll",
      },
    ],
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/login/404.vue"),
    name: "404",
    hidden: true,
  },
  {
    path: "/noRoutes",
    component: () => import("@/views/login/NoRoutes.vue"),
    name: "noRoutes",
    hidden: true,
  },
  {
    path: "/",
    name: "base",
    hidden: false,
    component: Layout,
    redirect: "/work-bench",
    icon: "money",
    children: [
      {
        path: "/work-bench",
        component: () => import("@/views/dashboard/index.vue"),
        menuType: "static",
        label: "工作台",
        name: "workbench",
        icon: "money",
        meta: { affix: true },
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});
export const resetRouter = (): void => {
  const resetWhiteNameList = [
    "redirect",
    "login",
    "icons",
    "noRoutes",
    "404",
    "base",
    "workbench",
  ];
  router.getRoutes().forEach((route) => {
    const name = route.name as string;
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
};
export const setupRouter = (app: App<Element>) => {
  app.use(router);
};
export default router;
