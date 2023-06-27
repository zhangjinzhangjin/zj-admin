<template>
  <span class="avatar-wrapper">
    <img v-if="avatar" :src="avatar" class="user-avatar" :class="size ? 'size' + size : 'sizeDefault'" />
    <div v-else class="aka-avatar" :style="`background-color:${akaAvatarBg};`"
      :class="size ? 'size' + size : 'sizeDefault'">{{ getFirstLetter() }}</div>
  </span>
</template>
<script setup lang="ts">
import { useUserStoreWithOut } from '@/store/modules/user'
import { toRefs } from 'vue';
defineOptions({
  name: "UserAvatar"
})
const props = defineProps({
  size: {
    type: Number,
    required: false,
  }
});
const { size } = toRefs(props)
const userStore = useUserStoreWithOut();
const avatar = userStore.getUserInfo.avatar;
const getRandomBg = () => {
  let random = Math.floor(Math.random() * 3)
  if (random === 0) {
    return "#d2e759";
  } else if (random === 1) {
    return "#fcba63";
  } else {
    return "#80c6f6";
  }
};
const akaAvatarBg = getRandomBg();
const getFirstLetter = () => {
  let letter = userStore.getUserInfo.name
  if (letter) {
    return letter.substring(0, 1);
  }
}
</script>
<style scoped lang="scss">
.avatar-wrapper {
  .user-avatar {
    cursor: pointer;
    border-radius: 50%;
  }

  .aka-avatar {
    cursor: pointer;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    color: #fff;
  }

  .sizeDefault {
    width: 40px;
    height: 40px;
  }

  .size1 {
    width: 30px;
    height: 30px;
  }

  .size2 {
    width: 60px;
    height: 60px;
  }

  .size3 {
    width: 100px;
    height: 100px;
  }
}
</style>