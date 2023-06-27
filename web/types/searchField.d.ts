declare type SearchFieldComponentName =
  | "Input"
  | "Select"
  | "TimePicker"
  | "DatePicker";
// YYYY-MM-DD
declare type extendPropsObj = {
  options?: OptionProp[];
  format?: string;
  // formatter?: Fn;
};
// select，radio，checkbox这些
declare type OptionProp = {
  value: string | number;
  label: string | number;
};
declare type SearchFieldSchema = {
  // 唯一值
  field: string;
  // 标题
  label?: string;
  // 渲染的组件
  component?: ComponentName;
  // 初始值
  value?: FormValueType;
  // 远程加载下拉项
  api?: <T = any>() => AxiosPromise<T>;
  // 宽度占位
  span?: number;
  // 非通用选项
  extendProps?: extendPropsObj;
};