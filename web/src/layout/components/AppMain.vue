<template>
  <section class="app-main">
    <div class="mainWrapper">
      <router-view>
        <template #default="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :name="route.name" :key="route.path" />
            </keep-alive>
          </transition>
        </template>
      </router-view>
    </div>
  </section>
</template>
<script lang="ts" setup>
// 因为现在permissionStore是根据path动态生成的name，所以要缓存页面的话，要保证name与组件中defineOptions的name完全一致，区分大小写
// 如果需要缓存，可以考虑在菜单配置时留一个name设置。或者，干脆就不要缓存了~
import { computed } from "vue"
import { useTagsViewStore } from '@/store/modules/tagsView'
const tagsViewStore = useTagsViewStore();
const cachedViews = computed(() => {
  return tagsViewStore.getCachedViews;
})
</script>
<style lang="scss" scoped>
.menuPosTop {
  .app-main {
    min-height: calc(100vh - 102px);
    .mainWrapper {
      min-height: calc(100vh - 118px);
    }
  }
}
.app-main {
  min-height: calc(100vh - 92px);
  height: 100%;
  width: 100%;
  overflow: hidden;
  .mainWrapper {
    min-height: calc(100vh - 108px);
    margin: 0px 16px 16px;
    padding: 16px;
    background-color: #fff;
    box-shadow: 3px 3px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
}

</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
