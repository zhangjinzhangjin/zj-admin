import type { CSSProperties } from "vue";
declare global {
  declare type FormComponentName =
    | "Radio"
    | "RadioButton"
    | "Checkbox"
    | "CheckboxButton"
    | "Input"
    | "Autocomplete"
    | "InputNumber"
    | "Select"
    | "Cascader"
    | "Switch"
    | "Slider"
    | "TimePicker"
    | "DatePicker"
    | "Rate"
    | "ColorPicker"
    | "Transfer"
    | "Divider"
    | "TimeSelect"
    | "SelectV2"
    | "Editor"
    | "Upload";
  declare type ColProps = {
    span?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    tag?: string;
  };
  declare type FormValueType =
    | string
    | number
    | string[]
    | number[]
    | boolean
    | undefined
    | null;
  declare type FormProps = {
    schema?: FormSchema[];
    isCol?: boolean;
    model?: Recordable;
    autoSetPlaceholder?: boolean;
    isCustom?: boolean;
    labelWidth?: string | number;
  } & Recordable;
  declare type FormItemProps = {
    labelWidth?: string | number;
    required?: boolean;
    rules?: Recordable;
    error?: string;
    showMessage?: boolean;
    inlineMessage?: boolean;
    style?: CSSProperties;
  };
  declare type ComponentOptions = {
    label?: string;
    value?: FormValueType;
    disabled?: boolean;
    key?: string | number;
    children?: ComponentOptions[];
    options?: ComponentOptions[];
  } & Recordable;
  declare type ComponentOptionsAlias = {
    labelField?: string;
    valueField?: string;
  };
  declare type ComponentProps = {
    optionsAlias?: ComponentOptionsAlias;
    // options?: ComponentOptions[];
    options?: Array<OptionProp> | Array<ComponentOptions>;
    optionsSlot?: boolean;
  } & Recordable;
  declare type FormSchema = {
    // 唯一值
    field: string;
    // 标题
    label?: string;
    // 提示
    labelMessage?: string;
    // col组件属性
    colProps?: ColProps;
    // 表单组件属性，slots对应的是表单组件的插槽，对应${field}-xxx的插槽，具体能放什么插槽需要查看element-plus文档
    // slots: {append: true}
    componentProps?: { slots?: Recordable } & ComponentProps;
    // formItem组件属性
    formItemProps?: FormItemProps;
    // 渲染的组件
    component?: FormComponentName;
    // 初始值
    value?: FormValueType;
    // 是否隐藏
    hidden?: boolean;
    // 远程加载下拉项，暂时不做，最好自己页面调接口获取options拼到schema中，要求后端返回[{value, label}]格式，可指定OptionProp
    api?: <T = any>() => AxiosPromise<T>;
  };
  declare type FormSetPropsType = {
    field: string;
    path: string;
    value: any;
  };
  declare type PlaceholderMoel = {
    placeholder?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
    rangeSeparator?: string;
  };
}
