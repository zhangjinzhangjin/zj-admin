import { defineStore } from "pinia";
import { store } from "../index";
// import { login, getCurrentUserInfo } from "@/api/user/login";
import { login, getCurrentUserInfo } from "@/api/system/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { useTagsViewStoreWithOut } from "@/store/modules/tagsView";
let tagsViewStore: any = null;
export const useUserStore = defineStore({
  id: "user",
  state: () => {
    return {
      token: getToken() || "",
      info: {},
      role: "",
      roleList: [],
    };
  },
  getters: {
    getToken(): string {
      return this.token;
    },
    getRole(): string {
      return this.role;
    },
    getRoleList(): object[] {
      return this.roleList;
    },
    getUserInfo(): any {
      return this.info;
    },
  },
  actions: {
    login(userInfo): Promise<boolean> {
      const { username, password } = userInfo;
      return new Promise(async (resolve, reject) => {
        try {
          const res = await login({
            username: username.trim(),
            password: password,
            deviceType: "PC",
          });
          const { data } = res;
          this.token = data.accessToken;
          setToken(data.accessToken);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    getInfo(): Promise<object> {
      return new Promise(async (resolve, reject) => {
        // const res = await getCurrentUserInfo(this.token);
        const res = await getCurrentUserInfo();
        const { data } = res;
        if (!data) {
          reject("验证失败，请重新登录.");
        }
        // 测试
        this.info = {
          ...data,
          postionName: "项目经理",
          departmentName: "研发中心",
        };
        this.role = data.role;
        // 角色列表，多角色切换
        this.roleList = [
          { id: "admin", label: "管理员" },
          { id: "test", label: "测试员" },
          { id: "editor", label: "编辑员" },
        ] as any;
        resolve(data);
      });
    },
    logout(): Promise<boolean> {
      return new Promise(async (resolve) => {
        this.token = "";
        this.role = "";
        removeToken();
        resetRouter();
        if (!tagsViewStore) {
          tagsViewStore = useTagsViewStoreWithOut();
        }
        await tagsViewStore.delAllViews();
        resolve(true);
      });
    },
  },
});
export const useUserStoreWithOut = () => {
  return useUserStore(store);
};
