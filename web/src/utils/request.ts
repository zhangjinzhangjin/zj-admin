import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { getToken } from "@/utils/auth";
import common from "@/common/index";
import { i18n } from "@/i18n";
import { useUserStoreWithOut } from "@/store/modules/user";
import router from "@/router";
const baseUrl = import.meta.env.VITE_API_BASEPATH; // 配置在env文件里
// console.log(baseUrl)
const service: AxiosInstance = axios.create({
  baseURL: baseUrl, // 自己的server服务地址
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 500000000000, // request timeout
});
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { t } = i18n.global;
    // 当前后台将code统一放到response.data中，方便前台直接处理业务逻辑
    const res = response.data;
    const code = res.code;
    if (res.type === "application/octet-stream" || res.type === "application/x-msdownload") return response; // 文件流没有code
    if (code !== 200) {
      let tipMessage = "";
      res.message.split(";").forEach((res) => {
        tipMessage += `<p style="line-height: 1.6;">${t(res)}</p>`;
      });
      common.tip(tipMessage, "error");
      if (code === 10004) {
        // to re-login
        setTimeout(() => {
          backToLogin();
        }, 1000);
      } else {
        common.hideLoading();
      }
      return Promise.reject(
        new Error("程序发现错误---" + res.message || "出错啦")
      );
    } else {
      return res;
    }
  },
  (error: AxiosError) => {
    common.hideLoading();
    if (!error.response) {
      // 连接超时
      common.tip("连接超时~是不是服务没启？？", "error");
    } else if (error.response && error.response.data) {
      let message = (error.response.data as any).message;
      common.tip(message, "error");
    }
    setTimeout(() => {
      backToLogin();
    }, 2000);
    return Promise.reject(error);
  }
);
function backToLogin() {
  const userStore = useUserStoreWithOut();
  userStore.logout();
  common.hideLoading();
  router.push("/login");
  location.reload();
}
export default service;
