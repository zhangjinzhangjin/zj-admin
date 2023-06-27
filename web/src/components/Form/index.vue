<script lang="tsx">
import { ElForm } from 'element-plus';
import { computed, defineComponent, PropType, ref, unref, onMounted, watch } from 'vue'
import { componentMap } from './componentMap'
import { useRenderSelect } from './useRenderSelect'
import { useRenderRadio } from './useRenderRadio'
import { useRenderCheckbox } from './useRenderCheckbox'
import { getSlot } from "@/utils/slot"
import { lodashSet } from "@/utils"
import {
  setTextPlaceholder,
  setGridProp,
  setComponentProps,
  setItemComponentSlots,
  initModel,
  setFormItemSlots
} from './helper'
type FormProps = {
  schema?: FormSchema[]
  isCol?: boolean
  model?: Recordable
  autoSetPlaceholder?: boolean
  isCustom?: boolean
  labelWidth?: string | number
} & Recordable
export default defineComponent({
  name: "Form",
  props: {
    // 生成Form的布局结构数组
    schema: {
      type: Array as PropType<FormSchema[]>,
      default: () => []
    },
    // 是否需要栅格布局
    isCol: {
      type: Boolean,
      default: true
    },
    // 表单数据对象
    model: {
      type: Object,
      default: () => ({})
    },
    // 是否自动设置placeholder
    autoSetPlaceholder: {
      type: Boolean,
      default: true
    },
    // 是否自定义内容
    isCustom: {
      type: Boolean,
      default: false
    },
    // 表单label宽度
    labelWidth: {
      type: [String, Number],
      default: "auto"
    },
  },
  emits: ['register'],
  setup(props, { slots, expose, emit }) {
    // element plus 的el-form实例
    const elFormRef = ref<ComponentRef<typeof ElForm>>()
    // 缓存传入的props
    const mergeProps = ref<FormProps>({})
    // 表单数据
    const formModel = ref<Recordable>({})
    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })
    // 需要挂载到el-form节点的属性
    const getFormBindValue = () => {
      // 避免在标签上出现多余的属性,自己定义的这些都删除掉
      const delKeys = ['schema', 'isCol', 'autoSetPlaceholder', 'isCustom', 'model']
      const props = { ...unref(getProps) }
      for (const key in props) {
        if (delKeys.indexOf(key) !== -1) {
          delete props[key]
        }
      }
      return props
    }
    // 渲染包裹标签，是否使用栅格布局
    const renderWrap = () => {
      const { isCol } = unref(getProps)
      const content = isCol ? (
        <el-row gutter={20}>{renderFormItemWrap()}</el-row>
      ) : (
        renderFormItemWrap()
      )
      return content
    }
    // 是否要渲染el-col
    const renderFormItemWrap = () => {
      // hidden属性表示隐藏，不做渲染
      const { schema = [], isCol } = unref(getProps)
      return schema
        .filter((v) => !v.hidden)
        .map((item) => {
          // 如果是 Divider 组件，需要自己占用一行
          const isDivider = item.component === 'Divider'
          const Com = componentMap['Divider'] as ReturnType<typeof defineComponent>
          return isDivider ? (
            <Com {...{ contentPosition: 'left', ...item.componentProps }}>{item?.label}</Com>
          ) : isCol ? (
            // 如果需要栅格，需要包裹 ElCol
            <el-col {...setGridProp(item.colProps)}>{renderFormItem(item)}</el-col>
          ) : (
            renderFormItem(item)
          )
        })
    }
    // 渲染formItem
    const renderFormItem = (item: FormSchema) => {
      // 单独给不需要额外处理的，带有options属性的组件做处理
      const notRenderOptions = ['SelectV2', 'Cascader', 'Transfer']
      // 所有的templage #
      const slotsMap: Recordable = {
        ...setItemComponentSlots(slots, item?.componentProps?.slots, item.field)
      }
      if (
        item?.component !== 'SelectV2' &&
        item?.component !== 'Cascader' &&
        item?.componentProps?.options
      ) {
        slotsMap.default = () => renderOptions(item)
      }
      // 渲染label和error
      const formItemSlots: Recordable = setFormItemSlots(slots, item.field)
      // 如果有 labelMessage，在label后面加一个小tip
      if (item?.labelMessage) {
        formItemSlots.label = () => {
          return (
            <>
              <span>{item.label}</span>
              <el-tooltip placement="right" raw-content>
                {{
                  content: () => <span v-html={item.labelMessage}></span>,
                  default: () => (
                    <svg-icon icon-class="message" />
                  )
                }}
              </el-tooltip>
            </>
          )
        }
      }
      return (
        <el-form-item {...(item.formItemProps || {})} prop={item.field} label={item.label || ''}>
          {{
            ...formItemSlots,
            default: () => {
              const Com = componentMap[item.component as string] as ReturnType<
                typeof defineComponent
              >
              const { autoSetPlaceholder } = unref(getProps)
              // 写了slot的就直接渲染，slot不再额外处理
              return slots[item.field] ? (
                getSlot(slots, item.field, formModel.value)
              ) : (
                <Com
                  vModel={formModel.value[item.field]}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  {...(notRenderOptions.includes(item?.component as string) &&
                    item?.componentProps?.options
                    ? { options: item?.componentProps?.options || [] }
                    : {})}
                >
                  {{ ...slotsMap }}
                </Com>
              )
            }
          }}
        </el-form-item>
      )
    }
    // 渲染options select radio checkbox这些
    const renderOptions = (item: FormSchema) => {
      switch (item.component) {
        case 'Select':
          const { renderSelectOptions } = useRenderSelect(slots)
          return renderSelectOptions(item)
        case 'Radio':
        case 'RadioButton':
          const { renderRadioOptions } = useRenderRadio()
          return renderRadioOptions(item)
        case 'Checkbox':
        case 'CheckboxButton':
          const { renderChcekboxOptions } = useRenderCheckbox()
          return renderChcekboxOptions(item)
        default:
          break
      }
    }
    onMounted(() => {
      emit('register', unref(elFormRef)?.$parent, unref(elFormRef))
    })
    // 监听表单结构化数组，重新生成formModel
    watch(
      () => unref(getProps).schema,
      (schema = []) => {
        formModel.value = initModel(schema, unref(formModel))
      },
      {
        immediate: true,
        deep: true
      }
    )
    // 对表单赋值
    const setValues = (data: Recordable = {}) => {
      formModel.value = Object.assign(unref(formModel), data)
    }
    // 如果用到了useForm,注册的时候执行一次赋值
    const setProps = (props: FormProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
    }
    // 删除一项
    const delSchema = (field: string) => {
      const { schema } = unref(getProps)
      const index = schema.findIndex(item => item.field === field)
      if (index > -1) {
        schema.splice(index, 1)
      }
    }
    // 添加一项
    const addSchema = (formSchema: FormSchema, index?: number) => {
      const { schema } = unref(getProps)
      if (index !== void 0) {
        schema.splice(index, 0, formSchema)
        return
      }
      schema.push(formSchema)
    }
    const setSchema = (schemaProps: FormSetPropsType[]) => {
      const { schema } = unref(getProps)
      for (const v of schema) {
        for (const item of schemaProps) {
          if (v.field === item.field) {
            lodashSet(v, item.path, item.value)
            // v[item.path] = item.value
          }
        }
      }
    }
    const getElFormRef = (): ComponentRef<typeof ElForm> => {
      return unref(elFormRef) as ComponentRef<typeof ElForm>
    }
    // 暴露给外部ref用，useForm也可以从method导出用
    expose({
      setValues,
      formModel,
      setProps,
      delSchema,
      addSchema,
      setSchema,
      getElFormRef
    })
    return () => (
      <el-form
        ref={elFormRef}
        {...getFormBindValue()}
        model={props.isCustom ? props.model : formModel}
      >
        {{
          // 如果需要自定义，就什么都不渲染，而是提供默认插槽
          default: () => {
            const { isCustom } = unref(getProps)
            return isCustom ? getSlot(slots, 'default') : renderWrap()
          }
        }}
      </el-form>
    )
  }
})
</script>
<style scoped lang="scss"></style>