import { useStorage } from "@/utils/storage"
const storage = useStorage();
export const appModules: AppState = {
  showSettings: false, // 设置面板
  param: {},
  title: import.meta.env.VITE_APP_TITLE, // 标题
  collapse: false, // 折叠菜单
  locale: storage.get('locale') || 'zh-CN', // 多语言
  logo: true, // logo
  greyMode: false, // 是否开始灰色模式，用于特殊悼念日
  layout: storage.get('layout') as LayoutType || 'left', // layout布局
  size: storage.get('size') as ElememtPlusSize || 'default', // 组件尺寸
  theme: storage.get('theme') || "default",
  primaryColor: storage.get('primaryColor') || "default",
  navHeadBgColor: storage.get('navHeadBgColor') || "white",
}