type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import("*.vue")>)
  | (() => Promise<T>);
declare interface AppRouteRecord {
  aliveName?: string;
  name?: string;
  menuType?: string;
  label?: string;
  component?: string | Component;
  path?: string;
  icon?: string;
  redirect?: string;
  hidden?: boolean;
  children?: AppRouteRecord[];
  meta?: object;
  linkAddress?: string;
  dynamicPage?: string;
}
