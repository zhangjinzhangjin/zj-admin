<template>
  <Dialog v-model="dialogVisible" :title="title" :icon="operateType == 'add' ? 'add' : 'edit'" width="500px"
    height="200px" @closeDialog="closeDialog">
    <Form v-if="formType == 1" :schema="schema" :isCol="false" ref="formRef" :rules="rules"></Form>
    <Form v-else-if="formType == 2" @register="register" :isCol="false" :rules="rules"></Form>
    <template #footer>
      <el-button type="primary" @click="formType == 1 ? submit1() : submit2()">保存</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from "@/components/Dialog/index.vue"
import Form from "@/components/Form/index.vue"
import { useForm } from "@/components/Form/useForm"
import { FormRules } from 'element-plus'
import { ref, toRefs, reactive, onBeforeMount } from 'vue'
defineOptions({
  name: "AddProductDialog"
})
const props = withDefaults(
  defineProps<{
    visible: boolean
    title: string
    sData: object
    operateType: string
  }>(),
  {
    visible: false,
    title: '',
    operateType: 'add',
    sData: () => ({
      id: "",
      createAt: "",
      name: '',
      type: '',
      desp: ""
    })
  }
)
const emit = defineEmits(['update:visible', 'submitDone'])
// 避免prop修改时的只读警告
const closeDialog = () => {
  emit('update:visible', false)
}
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  let month: string | number = date.getMonth() + 1;
  let day: string | number = date.getDate();
  month = (month > 9) ? month : ("0" + month);
  day = (day < 10) ? ("0" + day) : day;
  return year + "-" + month + "-" + day;
}
const dialogVisible = ref(true)
const { sData, operateType } = toRefs(props)
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '不可为空', trigger: ['change'] }
  ]
})
const typeArray = reactive<OptionProp[]>([
  { value: "0", label: "办公用品" },
  { value: "1", label: "生活用品" },
])
const schema = reactive<FormSchema[]>([
  {
    field: 'id',
    hidden: true,
  },
  {
    field: 'createAt',
    hidden: true,
  },
  {
    field: 'name',
    label: "产品名称",
    component: 'Input',
  },
  {
    field: 'type',
    label: "产品类型",
    component: 'Select',
    componentProps: {
      options: typeArray
    }
  },
  {
    field: 'desp',
    label: "描述",
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3
    }
  },
])
onBeforeMount(() => {
  //设置默认值
  Object.keys(sData.value).forEach((key) => {
    const targetSchema = schema.find(item => item.field === key);
    targetSchema && (targetSchema.value = sData.value[key])
  })
})
const formType = ref<number>(2) // 12两种Form应用方式
// Form组件应用方式1
const formRef = ref<Component>(null);
const submit1 = () => {
  const elFormRef = formRef.value.getElFormRef();
  const formModel = formRef.value.formModel // 获取所有表单项的值{key: value}
  elFormRef?.validate((valid) => {
    if (valid) {
      if (operateType.value == 'add') {
        formModel.id = Date.now().toString()
        formModel.createAt = formatDate(new Date())
      }
      emit('submitDone', formModel)
      closeDialog()
    } else {
      return false
    }
  })
}
// Form组件应用方式2
const { register, methods, elFormRef } = useForm({
  schema
})
const submit2 = () => {
  // register注册需要一个响应值，所以这里没有做unref处理，需要.value一下~~
  elFormRef?.value?.validate(async (valid) => {
    if (valid) {
      let formModel = await methods.getFormData();
      if (operateType.value == 'add') {
        formModel && (formModel.id = Date.now().toString())
        formModel && (formModel.createAt = formatDate(new Date()))
      }
      emit('submitDone', formModel)
      closeDialog()
    } else {
      return false
    }
  })
}
</script>
<style lang="scss" scoped></style>