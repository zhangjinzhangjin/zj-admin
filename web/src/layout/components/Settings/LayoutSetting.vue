<template>
  <div class="layoutSetting">
    <div class="headTitle">主题设置</div>
    <div class="panelTitle">菜单模式</div>
    <div class="mode-border">
      <svg-icon icon-class="nav-left" @click="setMenuPosition('left')" />
      <svg-icon icon-class="nav-top" @click="setMenuPosition('top')" />
      <svg-icon icon-class="right" :class="layout === 'left' ? 'left' : 'right'" />
    </div>
    <div class="line"></div>
    <div class="panelTitle">主题色</div>
    <div class="colorSets">
      <div v-for="(item, index) in themeColorSets" :key="index" :style="{ backgroundColor: item.color }"
        class="colorBlock" @click="changeTheme(item.id)">
        <svg-icon v-if="item.id == getTheme" icon-class="right" :class="{ black: index === 1 }" />
      </div>
    </div>
    <div class="line"></div>
    <div class="panelTitle">选中色</div>
    <div class="colorSets">
      <div v-for="(item, index) in primaryColorSets" :key="index" :style="{ backgroundColor: item.color }"
        class="colorBlock" @click="changePrimaryColor(item.id)">
        <svg-icon v-if="item.id == getPrimaryColor" icon-class="right" />
      </div>
    </div>
    <div class="line"></div>
    <div class="panelTitle">导航栏色</div>
    <div class="colorSets">
      <div v-for="(item, index) in navHeadBgColorSets" :key="index" :style="{ backgroundColor: item.color }"
        class="colorBlock" @click="changeNavHeadBgColor(item.id)">
        <svg-icon v-if="item.id == getNavHeadBgColor" icon-class="right" :class="{ black: index === 1 }" />
      </div>
    </div>
    <div class="ub ub-pc grayModeButtonWrapper">
      <el-button class="grayModeButton" type="primary" size="large" @click="toggleGrayMode">切换灰度模式</el-button>
    </div>
    <div class="ub ub-pc backButtonWrapper">
      <el-button class="logoutButton" type="primary" size="large" @click="goBack">返回</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from "@/store/modules/app"
import { computed } from "vue";
import { themeColorSets, primaryColorSets, navHeadBgColorSets, changeTheme, changePrimaryColor, changeNavHeadBgColor } from "@/utils/themeSet"
const emit = defineEmits(['changePanel'])
const appStore = useAppStoreWithOut();
const layout = computed(() => appStore.getLayout)
const grayMode = computed(() => appStore.getGreyMode)
defineOptions({
  name: "LayoutSetting"
})
const { setLayout, setCollapse, setGreyMode } = appStore
const setMenuPosition = (position) => {
  if (position == 'top') {
    setCollapse(false)
  }
  setLayout(position)
}
const toggleGrayMode = () => {
  setGreyMode(!grayMode.value)
}
const getTheme = computed(() => appStore.getTheme)
const getPrimaryColor = computed(() => appStore.getPrimaryColor)
const getNavHeadBgColor = computed(() => appStore.getNavHeadBgColor)
const goBack = () => { emit('changePanel') }
</script>
<style lang="scss" scoped>
.layoutSetting {
  .headTitle {
    height: 60px;
    line-height: 60px;
    font-size: 15px;
    font-weight: 700;
    box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.1);
    text-align: center;
    color: #2e2f48;
  }

  .panelTitle {
    padding: 20px;
    color: #202239;

    .el-switch {
      right: 20px;
      top: 20px;
      position: absolute;
    }
  }

  .mode-border {
    display: flex;
    justify-content: space-around;
    padding: 0px 10px;

    .svg-icon {
      font-size: 50px;
      cursor: pointer;

      &.left {
        position: absolute;
        left: 78px;
        top: 15px;
        font-size: 18px;
      }

      &.right {
        position: absolute;
        right: 70px;
        top: 15px;
        font-size: 18px;
      }

      &.middle {
        position: absolute;
        left: 148px;
        top: 15px;
        font-size: 18px;
      }
    }
  }

  .line {
    margin: 20px 10px 0px;
    height: 0px;
    border-bottom: 2px solid #f7f7f7;
  }

  .colorSets {
    display: flex;
    justify-content: space-between;
    padding: 0px 20px;

    .colorBlock {
      cursor: pointer;
      width: 30px;
      height: 20px;
      position: relative;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      .svg-icon {
        color: #ffffff;

        &.black {
          color: #283c55;
        }
      }
    }
  }

  .grayModeButtonWrapper {
    margin-top: 50px;

    .grayModeButton {
      width: 80%;
    }
  }

  .backButtonWrapper {
    margin-top: 20px;

    .logoutButton {
      width: 80%;
    }
  }
}</style>