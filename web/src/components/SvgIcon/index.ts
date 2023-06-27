import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import type { App, VNode } from "vue";
import SvgIcon from './SvgIcon.vue';
import { h } from 'vue'
interface IconType {
  iconClass?: string
  className?: string
}
interface ElementIconTypes {
  iconName?: string
}
export const setupIcon = async (app: App<Element>) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  app.component('SvgIcon', SvgIcon);
};
// {iconClass: "right"}
export const useIcon = (props: IconType): VNode => {
  return h<Component>(SvgIcon, props)
}
// {iconName: "Aim"}
export const useElementIcon = (props: ElementIconTypes): VNode => {
  let target:Component = null;
  Object.keys(ElementPlusIconsVue).some(key => {
    if(key === props.iconName){
      target = ElementPlusIconsVue[key]
      return true
    }
  })
  return h<Component>(target,{})
}