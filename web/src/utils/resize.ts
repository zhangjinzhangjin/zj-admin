import { useEventListener, useWindowSize } from '@vueuse/core'
import { onMounted } from 'vue'
export const useGridResize = (tableHeight, offset) => {
  const handleResize = () => {
    const { height } = useWindowSize()
    tableHeight.value = height.value - offset
  }
  onMounted(() => {
    useEventListener('resize', handleResize)
    setTimeout(() => {
      handleResize()
    }, 100)
  })
}

