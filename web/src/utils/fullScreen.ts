import { ref, Ref, unref, watch, nextTick } from "vue";
const isFullscreen: Ref<boolean> = ref(false);
const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen);
};
const setFullscreenWatch = (dialogHeight, defaultHeight) => {
  watch(
    () => isFullscreen.value,
    async (val: boolean) => {
      await nextTick();
      if (val) {
        const windowHeight = document.documentElement.offsetHeight;
        dialogHeight.value = `${windowHeight - 55 - 60 - 63}px`;
      } else {
        dialogHeight.value = defaultHeight;
      }
    },
    {
      immediate: true,
    }
  );
};
const useFullscreen = () => ({
  isFullscreen,
  toggleFull,
  setFullscreenWatch,
});
export default useFullscreen;

