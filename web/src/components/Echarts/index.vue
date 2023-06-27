<template>
  <div ref="elRef" :class="[$attrs.class]" :style="styles"></div>
</template>
<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed, onActivated, onBeforeUnmount, onMounted, PropType, ref, unref, watch } from 'vue';
import { isString } from '@/utils/is'
import echarts from './getEcharts'
interface propsType {
  options: EChartsOption
  width?: number | string
  height: number | string
}
const props = withDefaults(defineProps<propsType>(), {
  options: () => ({}),
  width: "",
  height: "300px"
})

// const props = defineProps({
//   options: {
//     type: Object as PropType<EChartsOption>,
//     required: true,
//     default: () => { }
//   },
//   width: {
//     type: [Number, String],
//     required: false,
//     default: ""
//   },
//   height: {
//     type: [Number, String],
//     required: false,
//     default: "300px"
//   },
// })
const options = computed(() => props.options)
const elRef = ref<ElRef>() // 用于渲染图表的div
let echartRef: Nullable<echarts.ECharts> = null // echarts实例
const containerEl = ref<Element>() // main container div，监听collipse
const styles = computed(() => {
  const width = isString(props.width) ? props.width : `${props.width}px`
  const height = isString(props.height) ? props.height : `${props.height}px`
  return {
    width,
    height
  }
})
const initChart = () => {
  if (unref(elRef) && props.options) {
    echartRef = echarts.init(unref(elRef) as HTMLElement)
    echartRef?.setOption(unref(options))
  }
}
watch(
  () => options.value,
  (options) => {
    if (echartRef) {
      echartRef?.setOption(options)
    }
  },
  {
    deep: true
  }
)
const resizeHandler = () => {
  if (echartRef) {
    echartRef.resize()
  }
}
const contentResizeHandler = async (e: TransitionEvent) => {
  if (e.propertyName === 'width') {
    resizeHandler()
  }
}
onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeHandler)
  containerEl.value = document.getElementsByClassName("main-container")[0]
  unref(containerEl) &&
    (unref(containerEl) as Element).addEventListener('transitionend', contentResizeHandler)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  unref(containerEl) &&
    (unref(containerEl) as Element).removeEventListener('transitionend', contentResizeHandler)
})
onActivated(() => {
  if (echartRef) {
    echartRef.resize()
  }
})
</script>
<style scoped lang="scss"></style>