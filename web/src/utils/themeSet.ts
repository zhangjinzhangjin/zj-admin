import { reactive } from "vue";
import { useAppStoreWithOut } from "@/store/modules/app"
import { setCssVar } from '@/utils'
let appStore:any = null;
export const themeColorSets = reactive([
  {
    id: "default",
    color: "#283C55",
    subMenuBg: "#193152",
    menuBg: "#283C55",
    menuText: "#FFFFFF",
    menuActiveText: "#409EFF",
    menuHover: "#1A293C",
    subMenuHover: "#001528",
  },
  {
    id: "white",
    color: "#F7F7F7",
    subMenuBg: "#F7F7F7",
    menuBg: "#FFFFFF",
    menuText: "#000000",
    menuActiveText: "#409EFF",
    menuHover: "#E4E4E4",
    subMenuHover: "#DCDBDB",
  },
  {
    id: "green",
    color: "#217346",
    subMenuBg: "#1E6F42",
    menuBg: "#217346",
    menuText: "#FFFFFF",
    menuActiveText: "#409EFF",
    menuHover: "#288752",
    subMenuHover: "#24844F",
  },
  {
    id: "blue",
    color: "#106EBE",
    subMenuBg: "#0E6AB7",
    menuBg: "#106EBE",
    menuText: "#FFFFFF",
    menuActiveText: "#5BE447",
    menuHover: "#0F5795",
    subMenuHover: "#0E5998",
  },
  {
    id: "purple",
    color: "#453A5E",
    subMenuBg: "#332B46",
    menuBg: "#453A5E",
    menuText: "#FFFFFF",
    menuActiveText: "#409EFF",
    menuHover: "#5F517E",
    subMenuHover: "#5E5378",
  },
  {
    id: "orange",
    color: "#B7472A",
    subMenuBg: "#AD3C25",
    menuBg: "#B7472A",
    menuText: "#FFFFFF",
    menuActiveText: "#54FE51",
    menuHover: "#CA5030",
    subMenuHover: "#CD543B",
  },
  {
    id: "pink",
    color: "#D97C9B",
    subMenuBg: "#DE85A3",
    menuBg: "#D97C9B",
    menuText: "#FFFFFF",
    menuActiveText: "#4BFF6A",
    menuHover: "#CB698A",
    subMenuHover: "#C86d8C",
  },
])
export const primaryColorSets = reactive([
  {
    id: "default",
    color: "#409eff"
  },
  {
    id: "green",
    color: "#439567"
  },
  {
    id: "blue",
    color: "#005A9E"
  },
  {
    id: "purple",
    color: "#7E64BD"
  },
  {
    id: "orange",
    color: "#DB927E"
  },
  {
    id: "pink",
    color: "#D25F6E"
  },
])
export const navHeadBgColorSets = reactive([
  {
    id: "default",
    color: "#283C55"
  },
  {
    id: "white",
    color: "#F7F7F7"
  },
  {
    id: "green",
    color: "#217346"
  },
  {
    id: "blue",
    color: "#106EBE"
  },
  {
    id: "purple",
    color: "#453A5E"
  },
  {
    id: "orange",
    color: "#B7472A"
  },
  {
    id: "pink",
    color: "#D97C9B"
  },
])
export const changeTheme = (id) => {
  if(!appStore){
    appStore = useAppStoreWithOut();
  }
  const { setTheme } = appStore
  setTheme(id)
  const target = themeColorSets.find(item => item.id == id)
  setCssVar('--menuBg', target?.menuBg)
  setCssVar('--menuText', target?.menuText)
  setCssVar('--subMenuBg', target?.subMenuBg)
  setCssVar('--menuActiveText', target?.menuActiveText)
  setCssVar('--menuHover', target?.menuHover)
  setCssVar('--subMenuHover', target?.subMenuHover)
  if (id === 'white') {
    changePrimaryColor("default")
  } else {
    changePrimaryColor(id)
  }
  // 改主题，导航栏颜色永远置为白色
  changeNavHeadBgColor("white")
}
export const changePrimaryColor = (id) => {
  if(!appStore){
    appStore = useAppStoreWithOut();
  }
  const { setPrimaryColor } = appStore
  setPrimaryColor(id)
  const target = primaryColorSets.find(item => item.id == id)
  setCssVar('--el-color-primary', target?.color)
}
export const changeNavHeadBgColor = (id) => {
  if(!appStore){
    appStore = useAppStoreWithOut();
  }
  const { setNavHeadBgColor } = appStore
  setNavHeadBgColor(id)
  const target = navHeadBgColorSets.find(item => item.id == id)
  if (target?.color == '#F7F7F7') {
    setCssVar('--navHeadBgColor', "#ffffff")
    setCssVar('--navHeadTextColor', "#303133")
  } else {
    setCssVar('--navHeadBgColor', target?.color)
    setCssVar('--navHeadTextColor', "#ffffff")
  }
}