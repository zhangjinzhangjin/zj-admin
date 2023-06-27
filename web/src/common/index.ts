import { ElLoading } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { i18n } from "@/i18n";
import { usePermissionStoreWithOut } from "@/store/modules/permission";
let permissionStore: any = null;
let loading;
const showLoading = () => {
  loading = ElLoading.service({
    fullscreen: true,
    background: "rgba(255, 255, 255, 0.3)", //遮罩层背景色
  });
};
const hideLoading = () => {
  if (loading) {
    loading.close();
  }
};
const alert = (msg: string, callback?: Fn) => {
  const { t } = i18n.global;
  ElMessageBox.alert(t(msg), "提示", {
    confirmButtonText: "确定",
    center: true,
    type: "warning",
    callback,
  });
};
const confirm = (
  msg: string,
  okCb = () => {},
  cancelCb = () => {},
  header = "提醒",
  confirmBtn = "确定",
  cancelBtn = "取消"
) => {
  const { t } = i18n.global;
  ElMessageBox.confirm(t(msg), header, {
    confirmButtonText: confirmBtn,
    cancelButtonText: cancelBtn,
    type: "warning",
  })
    .then(() => {
      okCb.call(this);
    })
    .catch(() => {
      cancelCb.call(this);
    });
};
const tip = (msg, type = "success") => {
  const { t } = i18n.global;
  ElMessage({
    showClose: true,
    message: t(msg),
    type: type as any,
    duration: 3 * 1000,
  });
};
const pagesizeRange: Array<number> = [10, 20, 50, 100];
const getRouteByPath = (path) => {
  if (!permissionStore) {
    permissionStore = usePermissionStoreWithOut();
  }
  const routes = permissionStore.getRoutes_1d;
  const res = routes.find((route) => route.path === path);
  if (res) {
    return res.path;
  }
};
export default {
  alert,
  confirm,
  tip,
  pagesizeRange,
  showLoading,
  hideLoading,
  getRouteByPath,
  pageSizes: [10, 20, 50, 100],
  pageLayout: "total, prev, pager, next, jumper, sizes",
};
