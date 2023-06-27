<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link ub ub-ac ub-pc" to="/">
        <img src="@/assets/imgs/logo.png" class="logoIcon" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link ub ub-ac" to="/">
        <img src="@/assets/imgs/logo.png" class="logoIcon" />
        <div class="title ub-f1">{{ title }}</div>
      </router-link>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { computed } from 'vue';
const appStore = useAppStore()
// const title = computed(() => appStore.getTitle)
const title = "Admin_Test_ZJ"
const collapse = computed(() => appStore.getCollapse)
</script>
<style scoped lang="scss">
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  .sidebar-logo-link {
    height: 100%;
    width: 100%;
  }

  .logoIcon {
    width: 35px;
    height: 30px;
    margin-left: 10px;
  }
  .title{
    color: var(--menuText);
    margin-left: 10px;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>