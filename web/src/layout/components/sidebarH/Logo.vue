<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link key="expand" class="sidebar-logo-link ub ub-ac" to="/">
        <img src="@/assets/imgs/logo.png" class="logoIcon" />
        <div class="title ub-f1">{{ title }}</div>
      </router-link>
    </transition>
  </div>
</template>
<script setup lang="ts">
// const title = computed(() => appStore.getTitle)
const title = "Admin_Test_ZJ"
</script>
<style scoped lang="scss">
.sidebar-logo-container {
  position: relative;
  width: 210px;
  height: 60px;
  line-height: 60px;
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