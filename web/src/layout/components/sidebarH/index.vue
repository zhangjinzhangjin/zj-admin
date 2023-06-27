<template>
  <div class="topbar-container" :class="{ 'has-logo': logo }">
    <Logo v-if="logo" />
    <div class="menusArea" :style="{ width: menusAreaWidth + 'px' }">
      <el-menu :style="{ width: '5000px', left: offsetLeft + 'px' }" :default-active="activeMenu" :collapse="collapse"
        backgroundColor="var(--menuBg)" textColor="var(--menuText)" activeTextColor="var(--menuActiveText)"
        :unique-opened="true" :collapse-transition="false" mode="horizontal" class="menuBorder">
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </div>
    <div class="controlButtons" v-if="controlButtonsShow">
      <svg-icon icon-class="triangle-prev" @click="prev" class="leftArraw" :class="{ active: leftActive }" />
      <svg-icon icon-class="triangle-next" @click="next" class="rightArraw" :class="{ active: rightActive }" />
    </div>
    <right-menu />
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { ref, unref, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { computed } from 'vue';
import Logo from "./Logo.vue"
import SidebarItem from "./SidebarItem.vue"
import RightMenu from "../rightMenu/index.vue"
defineOptions({
  name: "SidebarH"
})
const appStore = useAppStore()
const permissionStore = usePermissionStore();
const logo = computed(() => appStore.logo)
const collapse = computed(() => appStore.collapse)
const permission_routes = computed(() => permissionStore.getRoutes)
const { currentRoute } = useRouter()
const activeMenu = computed(() => {
  const { meta, path } = unref(currentRoute)
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
const menusAreaWidth = ref(0)
const menus = ref<HTMLElement[]>([])
onMounted(() => {
  const logo = document.querySelector(".sidebar-logo-container")
  const rightMenu = document.querySelector(".right-menu")
  const logoWidth = logo ? logo.clientWidth : 0;
  const rightMenuWidth = rightMenu ? rightMenu.clientWidth : 0;
  menusAreaWidth.value = document.body.clientWidth - logoWidth - rightMenuWidth - 240
  menus.value = document.querySelectorAll(".menuBorder > .menuItemBorder") as unknown as HTMLElement[]
})
// 设置翻页按钮展示不展示
const allMenusWidth = computed(() => {
  let sum = 0;
  Array.prototype.slice.call(menus.value).forEach(menu => {
    sum += menu.clientWidth
  })
  return sum
})
const controlButtonsShow = computed(() => {
  return allMenusWidth.value > menusAreaWidth.value
})
const maxPage = computed(() => {
  return Math.floor(allMenusWidth.value / menusAreaWidth.value)
})
// 设置当前菜单页
const currentPage = ref(0)
// 设置左右箭头好不好使
const leftActive = ref(true);
leftActive.value = controlButtonsShow.value
const rightActive = ref(true)
rightActive.value = !controlButtonsShow.value
const prev = () => {
  if (!leftActive.value) {
    return;
  }
  currentPage.value--;
  rightActive.value = true;
  if (currentPage.value === 0) {
    leftActive.value = false
  }
}
const next = () => {
  if (!rightActive.value) {
    return;
  }
  currentPage.value++;
  leftActive.value = true;
  if ((currentPage.value + 1) * menusAreaWidth.value >= allMenusWidth.value) {
    rightActive.value = false
  }
}
const offsetLeft = computed(() => {
  const currentPageValue = currentPage.value;
  if (currentPageValue === 0) { // 第一页
    return 0;
  }
  const menusAreaWidthValue = menusAreaWidth.value
  const oLeft = currentPageValue * menusAreaWidthValue;
  let targetMenuIndex = 0; // 正好卡住的那个菜单的index
  let sumMenusWidth = 0 // index前面菜单总宽度
  Array.prototype.slice.call(menus.value).some((menu, index) => {
    if (sumMenusWidth + menu.clientWidth > oLeft) {
      targetMenuIndex = index
      return true
    } else {
      sumMenusWidth += menu.clientWidth
    }
  })
  return -1 * sumMenusWidth
})
</script>
<style lang="scss" scoped>
.menusArea {
  overflow: hidden;
  height: 60px;
  float: left;
}

.controlButtons {
  height: 60px;
  line-height: 60px;
  float: left;

  .leftArraw {
    color: #787988;
    font-size: 13px;
    cursor: pointer;
    margin-right: 3px;
    margin-left: 10px;

    &.active {
      color: #FFFFFF;
    }
  }

  .rightArraw {
    color: #787988;
    font-size: 13px;
    cursor: pointer;

    &.active {
      color: #FFFFFF;
    }
  }
}
</style>