<template>
  <div class="navbar">
    <el-tooltip placement="top">
      <template #content> {{ collapse ? "展开" : "收起" }} </template>
      <Hamburger v-if="layout === 'left'" id="hamburger-container" :is-active="!collapse" class="hamburger-container"
        @toggleClick="toggleSideBar" />
    </el-tooltip>
    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <template v-if="layout === 'left'">
      <right-menu />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useAppStoreWithOut } from '@/store/modules/app'
import { computed, unref } from 'vue';
import RightMenu from "./rightMenu/index.vue"
import Hamburger from "@/components/Hamburger/index.vue"
import Breadcrumb from "@/components/Breadcrumb/index.vue"
defineOptions({
  name: 'Navbar'
})
const appStore = useAppStoreWithOut();
const layout = computed(() => appStore.getLayout) // 左侧菜单还是顶部菜单 left top
const collapse = computed(() => appStore.getCollapse) // 菜单折叠状态
const toggleSideBar = () => {
  const collapsed = unref(collapse)
  appStore.setCollapse(!collapsed)
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  transition: background 0.2s;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  background-color: var(--navHeadBgColor);
  color: var(--navHeadTextColor);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
    line-height: 50px;
  }
}
</style>
