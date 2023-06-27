import { defineStore } from "pinia";
import { store } from "../index";
import Dynamic from "@/layout/Dynamic.vue";
import ExternalLink from "@/layout/ExternalLink.vue";
import { constantRouterMap } from "@/router";
import { getRoutesByCode } from "@/api/system/role";
const Layout = () => import("@/layout/index.vue");
const modules = import.meta.glob("@/views/**/*.{vue,tsx}");
// 因vue3 resetRouter会报错，所以动态菜单不再配置工作台，工作台workbench变更为静态菜单
// let rootRoute;
// 重置基础根路由
// function resetBasicRoute() {
//   rootRoute = {
//     path: "/",
//     name: "Base",
//     hidden: false,
//     component: Layout,
//     redirect: "/work-bench",
//     icon: "",
//     children: [],
//   };
// }
// 拍平为一维数组菜单路由
function get1dRoutes(routes: AppRouteRecord[]) {
  let buffer: any[] = [];
  function fill(sArray) {
    sArray.forEach((item) => {
      if (item.children && item.children.length > 0) {
        fill(item.children);
        buffer.push(item);
        delete item.children;
      } else {
        buffer.push(item);
      }
    });
  }
  fill(routes);
  return buffer;
}
function createRoute(route: AppRouteRecord) {
  // 配置了缓存名称的才有缓存效果, 没配置的强制取消缓存，避免命名冲突
  if (route.aliveName && route.aliveName.length) {
    route.name = route.aliveName;
  } else {
    const pathBuffer = route.path?.split("/") || [];
    route.name = pathBuffer[pathBuffer.length - 1] + "_" + Date.now(); // 设置路由name属性，无keep alive
  }
  const menuType = route.menuType;
  switch (menuType) {
    case "folder":
      route.component = Layout;
      if (route.children && route.children.length) {
        const child = route.children[0];
        route.redirect = child.path;
      }
      break;
    case "static":
      try {
        const targetComponent =
          modules[`/src/views/${route.component}.vue`] ||
          modules[`../../views/${route.component}.tsx`];
        route.component = targetComponent;
      } catch (error) {
        route.component = () => {};
      }
      break;
    case "dynamic":
      route.component = Dynamic;
      break;
    case "externalLink":
      route.component = ExternalLink;
      break;
    default:
      break;
  }
}
function fillRoutes(routes) {
  const routesBuffer = JSON.parse(JSON.stringify(routes));
  const normalRoutes: AppRouteRecord[] = [];
  routesBuffer.forEach((route) => {
    route.children &&
      route.children.length &&
      route.children.forEach((subRoute) => {
        createRoute(subRoute);
      });
    createRoute(route);
    // if (route.path === "/work-bench") {
    //   // 门户主页
    //   route.meta = { affix: true };
    //   rootRoute.icon = route.icon;
    //   rootRoute.children.push(route);
    //   normalRoutes.push(rootRoute);
    // } else if (route.menuType == "static") {
    if (route.menuType == "static") {
      const newRootRoute: AppRouteRecord = {
        path: route.path + Date.now(),
        hidden: route.isHide ? route.isHide : false,
        component: Layout,
        redirect: route.path,
        icon: route.icon,
        children: [],
      };
      newRootRoute.icon = route.icon;
      newRootRoute.children?.push(route);
      normalRoutes.push(newRootRoute);
    } else {
      normalRoutes.push(route);
    }
  });
  return [
    ...normalRoutes,
    {
      path: "/:path(.*)*",
      redirect: "/404",
      name: "NoMatch",
      hidden: true,
    }, // 添加一个没有路由时的页面
  ];
}
export const usePermissionStore = defineStore({
  id: "permission",
  state: (): {
    routes: AppRouteRecord[];
    addRoutes: AppRouteRecord[];
    routes_1d: AppRouteRecord[];
  } => {
    return {
      routes: [], // 动静态concat
      addRoutes: [], // 权限返回来的动态菜单
      routes_1d: [], // 拍平的一维路由数组
    };
  },
  getters: {
    getRoutes(): AppRouteRecord[] {
      return this.routes;
    },
    getRoutes_1d(): Array<AppRouteRecord> {
      return this.routes_1d;
    },
  },
  actions: {
    generateRoutes(role: string): Promise<AppRouteRecord[]> {
      return new Promise(async (resolve) => {
        const res = await getRoutesByCode(role);
        // resetBasicRoute(); // 初始化基础路由类型
        const accessedRoutes = fillRoutes(res.data);
        this.addRoutes = accessedRoutes;
        const finalRoutes = constantRouterMap.concat(accessedRoutes);
        this.routes = finalRoutes;
        const routes_1d = get1dRoutes(JSON.parse(JSON.stringify(finalRoutes)));
        this.routes_1d = routes_1d;
        resolve(accessedRoutes);
      });
    },
  },
});
export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store);
};
