<script setup lang="ts">
import { onBeforeUnmount, computed, PropType, unref, nextTick, ref, watch, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor, IEditorConfig, i18nChangeLanguage } from '@wangeditor/editor'
import { isNumber } from '@/utils/is'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const currentLocale = computed(() => appStore.getLocale)
i18nChangeLanguage(unref(currentLocale))
const props = defineProps({
  editorId: {
    type: String,
    default: "wangeEditor-1"
  },
  height: {
    type: [Number, String],
    default: '500px'
  },
  editorConfig: {
    type: Object as PropType<IEditorConfig>,
    default: () => undefined
  },
  modelValue: {
    type: String,
    default: ""
  },
})
const emit = defineEmits(['change', 'update:modelValue'])
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()
const valueHtml = ref('')
watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  },
  {
    immediate: true
  }
)
// 监听
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}
// 编辑器配置
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      readOnly: false,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      scroll: true,
      uploadImgShowBase64: true
    },
    props.editorConfig || {}
  )
})
const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height
  }
})
// 回调函数
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}
// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)
  if (editor === null) return
  // 销毁，并移除 editor
  editor?.destroy()
})
const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}
defineExpose({
  getEditorRef
})
</script>
<template>
  <div class="editorBorder">
    <!-- 工具栏 -->
    <Toolbar :editor="editorRef" :editorId="editorId" class="toolbar" />
    <!-- 编辑器 -->
    <Editor v-model="valueHtml" :editorId="editorId" :defaultConfig="editorConfig" :style="editorStyle"
      @on-change="handleChange" @on-created="handleCreated" />
  </div>
</template>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.editorBorder {
  border: 1px solid #cccccc;
}

.toolbar {
  border: 1px solid #cccccc;
}
</style>