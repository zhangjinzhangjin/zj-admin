<template>
  <div v-if="!item.hidden" class="menuItemBorder">
    <template v-if="isDashBoard(item) || isFirstLevelStaticItem(item)">
      <app-link :to="resolvePath(item.children[0].path)">
        <el-menu-item :index="resolvePath(item.children[0].path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :isNest="isNest" :icon="getIcon(item)" :title="item.children[0].label" />
        </el-menu-item>
      </app-link>
    </template>
    <template v-else-if="!item.children || item.children.length === 0">
      <app-link :to="resolvePath(item.path)">
        <el-menu-item :index="resolvePath(item.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :isNest="isNest" :icon="getIcon(item)" :title="item.label" />
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
      <template #title>
        <item :icon="getIcon(item)" :title="item.label" />
      </template>
      <SidebarItem v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
        :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-sub-menu>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import AppLink from "./AppLink.vue"
import Item from "./Item.vue"
import { isUrl } from '@/utils/is'
defineOptions({
  name: "SidebarItem"
})
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    default: "",
  },
  isNest: { // 子菜单标记
    type: Boolean,
    default: false,
  },
});
const item = computed(() => {
  return props.item;
});
const basePath = props.basePath;
const isNest = props.isNest;
const isExternal = function (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  if (path.startsWith("/")) return path
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/')
}
const resolvePath = (routePath) => {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(basePath)) {
    return basePath;
  }
  return pathResolve(basePath, routePath);
}
const isDashBoard = (item) => {
  if (
    item.path === "/" &&
    item.children.length === 1 &&
    item.children[0].path === "/work-bench"
  ) {
    return true;
  }
  return false;
}
const isFirstLevelStaticItem = (item) => {
  if (item.children && item.children.length == 1 && item.children[0].menuType == "static") {
    return true;
  }
  return false;
}
const getIcon = (route) => {
  return route.icon || "";
}
</script>
<style scoped></style>