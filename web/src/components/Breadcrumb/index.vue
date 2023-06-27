<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <svg-icon class="titleIcon" v-if="icon" :icon-class="icon" key="titleIcon" />
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="index == levelList.length - 1" class="no-redirect">{{ getTitle(item) }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ getTitle(item) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { compile } from "path-to-regexp";
const { currentRoute, push } = useRouter()
const levelList = ref<AppRouteRecord[]>([])
const permissionStore = usePermissionStore()
const routes1d = permissionStore.getRoutes_1d;
const getTitle = (tag) => {
  const res = routes1d.find((route) => route.path === tag.path);
  if (res) {
    return res.label;
  } else {
    return "";
  }
}
const getBreadcrumb = () => {
  const matched = currentRoute.value.matched;
  let matchedBuffer = matched.map(item => {
    const res = routes1d.find((route) => route.path === item.path);
    return res
  });
  if (matchedBuffer[0]?.path === '/') { // 工作台
    matchedBuffer.shift();
  }
  levelList.value = matchedBuffer as AppRouteRecord[];
}
const pathCompile = (path) => {
  const { params } = currentRoute.value;
  var toPath = compile(path);
  return toPath(params);
}
const handleLink = (item) => {
  const { redirect, path } = item;
  if (redirect) {
    push(redirect);
    return;
  }
  push(pathCompile(path));
}
const icon = computed(() => {
  if (!levelList.value || levelList.value.length === 0) {
    return null;
  }
  const target = levelList.value[0];
  const res = routes1d.find((route) => route.path === target.path);
  return res?.icon;
})
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    if (route.path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.titleIcon {
  float: left;
  margin-right: 10px;
  margin-top: 18px;
}

.el-breadcrumb__inner.is-link,
.el-breadcrumb__inner a {
  color: var(--navHeadTextColor);
  font-weight: bolder;
  transition: color 0.2s;
}

.no-redirect {
  color: var(--navHeadTextColor);
  cursor: text;
  overflow: hidden;
}

.el-breadcrumb__item{
  display: block;
}
</style>
