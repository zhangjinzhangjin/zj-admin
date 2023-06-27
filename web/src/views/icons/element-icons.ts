import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const modules: any = [];
Object.keys(ElementPlusIconsVue).forEach(key => {
  modules.push(key)
})
export default modules
