<template>
  <div id="tags-view-container" class="tags-view-container tags-tab-ha" ref="container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link v-for="tag in visitedViews" ref="tags" :key="tag.path" :class="isActive(tag) ? 'active' : ''"
        :to="{ ...tag }" tag="span" class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)">
        {{ getTitle(tag) }}
        <el-icon v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
          <component is="CloseBold" />
        </el-icon>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { useTagsViewStoreWithOut } from '@/store/modules/tagsView'
import { computed, onMounted, ref, nextTick, watch } from 'vue';
import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { isUrl } from '@/utils/is'
import ScrollPane from "./ScrollPane.vue"
const container = ref(null)
const tags = ref<Component>([])
const permissionStore = usePermissionStore()
const routes = permissionStore.getRoutes;
const routes1d = permissionStore.getRoutes_1d;
const { currentRoute, push, replace } = useRouter()
const tagsViewsStore = useTagsViewStoreWithOut();
const scrollPane = ref(null)
interface tagInterface {
  fullPath: string,
  path: string,
  name: string,
  meta: any
}
const getTitle = (tag) => {
  const res = routes1d.find(route => route.path === tag.path);
  if (res) {
    return res.label;
  } else {
    return "";
  }
}
const visitedViews = computed(() => {
  return tagsViewsStore.getVisitedViews
})
const isActive = (route) => {
  return route.path === currentRoute.value.path;
}
const isAffix = (tag) => {
  return tag.meta && tag.meta.affix;
};
const toLastView = (view) => {
  const visitedViews = tagsViewsStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView.fullPath);
  } else {
    // 当前在store过滤了，affix的菜单都会剩下，所以走不到这里
    if (view.name === "workbench") {
      // to reload home page
      replace({ path: "/redirect" + view.fullPath });
    } else {
      push("/");
    }
  }
}
const left = ref(0)
const top = ref(0)
const visible = ref(false)
const selectedTag = ref({})
const openMenu = (tag, e) => {
  if (!container.value) {
    return
  }
  const el = container.value as HTMLElement;
  const menuMinWidth = 105;
  const offsetLeft = el.getBoundingClientRect().left; // container margin left
  const offsetTop = el.getBoundingClientRect().top; // container margin left
  const offsetWidth = el.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const dLeft = e.clientX - offsetLeft + 15; // 15: margin right
  if (dLeft > maxLeft) {
    left.value = maxLeft - 20;
  } else {
    left.value = dLeft - 20;
  }
  top.value = e.clientY - offsetTop + 20
  visible.value = true;
  selectedTag.value = tag;
}
const refreshSelectedTag = async (view) => {
  await tagsViewsStore.delCachedView(view);
  const { fullPath } = view;
  replace({ path: "/redirect" + fullPath })
}
const closeSelectedTag = async (view) => {
  await tagsViewsStore.delView(view)
  if (isActive(view)) {
    toLastView(view);
  }
}
const moveToCurrentTag = async () => {
  if (tags.value.length == 0) {
    return
  }
  await nextTick();
  for (const tag of tags.value) {
    if (tag.to.path === currentRoute.value.path) {
      // scrollPane.value?.moveToTarget(tag);
      if (tag.to.fullPath !== currentRoute.value.fullPath) {
        tagsViewsStore.updateVisitedView(tag)
      }
      break;
    }
  }
}
const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  if (path.startsWith("/")) return path
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/')
}
const filterAffixTags = (routes, basePath = "/") => {
  let tagsBuffer: tagInterface[] = [];
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = pathResolve(basePath, route.path);
      tagsBuffer.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      });
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path);
      if (tempTags.length >= 1) {
        tagsBuffer = [...tagsBuffer, ...tempTags];
      }
    }
  });
  return tagsBuffer;
}
const affixTags = ref<tagInterface[]>([])
const initTags = () => {
  affixTags.value = filterAffixTags(routes)
  for (const tag of affixTags.value) {
    if (tag.name) {
      tagsViewsStore.addVisitedView(tag as RouteLocationNormalizedLoaded)
    }
  }
}
const addTags = () => {
  const { name } = currentRoute.value;
  if (name) {
    tagsViewsStore.addView(currentRoute.value)
  }
  return false;
}
const closeAllTags = async (view) => {
  await tagsViewsStore.delAllViews();
  if (affixTags.value.some(tag => tag.path === view.path)) {
    return;
  }
  toLastView(view);
}
const closeOthersTags = async () => {
  push(selectedTag.value);
  await tagsViewsStore.delOthersViews(selectedTag.value as RouteLocationNormalizedLoaded)
  moveToCurrentTag()
}
onMounted(async () => {
  await initTags();
  await addTags();
})
const closeMenu = () => {
  visible.value = false;
}
watch(
  visible,
  (value) => {
    if (value) {
      document.body.addEventListener("click", closeMenu);
    } else {
      document.body.removeEventListener("click", closeMenu);
    }
  }
)
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    addTags();
    moveToCurrentTag();
  }
)
</script>