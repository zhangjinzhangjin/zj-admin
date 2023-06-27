<template>
  <Dialog v-model="dialogVisible" :title="title" :icon="operateType == 'add' ? 'add' : 'edit'" width="500px"
    height="200px" @closeDialog="closeDialog">
    <Form @register="register" :isCol="false" :rules="rules"></Form>
    <template #footer>
      <el-button type="primary" @click="submit" v-if="operateType=='edit'">保存</el-button>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import Dialog from "@/components/Dialog/index.vue"
import Form from "@/components/Form/index.vue"
import { useForm } from "@/components/Form/useForm"
import { FormRules } from 'element-plus'
import { ref, reactive, onBeforeMount } from 'vue'
import { useValidator } from '@/utils/validator'
import {
  addRole,
  updateRole
} from "@/api/system/role";
import common from "@/common"
defineOptions({
  name: "AddProductDialog"
})
const props = withDefaults(
  defineProps<{
    title: string
    sData: object
    operateType: string
  }>(),
  {
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
const closeDialog = () => {
  emit('update:visible', false)
}
const dialogVisible = ref(true)
const { sData, operateType } = props
const { required } = useValidator()
const rules = reactive<FormRules>({
  code: [required()],
  label: [required()],
})
const schema = reactive<FormSchema[]>([
  {
    field: '_id',
    hidden: true,
  },
  {
    field: 'code',
    label: "角色编码",
    component: 'Input',
    componentProps: {
      disabled: operateType == "edit" || operateType == "view"
    }
  },
  {
    field: 'label',
    label: "角色名称",
    component: 'Input',
    componentProps: {
      disabled: operateType == "view"
    }
  },
  {
    field: 'desc',
    label: "描述",
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
      disabled: operateType == "view"
    }
  },
])
onBeforeMount(() => {
  //设置默认值
  Object.keys(sData).forEach((key) => {
    const targetSchema = schema.find(item => item.field === key);
    targetSchema && (targetSchema.value = sData[key])
  })
})
const { register, methods, elFormRef } = useForm({
  schema
})
const submit = () => {
  // register注册需要一个响应值，所以这里没有做unref处理，需要.value一下~~
  elFormRef?.value?.validate(async (valid) => {
    if (valid) {
      let formModel = await methods.getFormData();
      let id = formModel?._id
      delete formModel?._id
      let res;
      let message: string;
      if (operateType == "add") {
        message = "添加角色成功"
        res = await addRole(formModel)
      } else {
        message = "修改角色成功"
        res = await updateRole(id, formModel)
      }
      if (res.code == 200) {
        common.tip(message)
        emit('submitDone')
        closeDialog()
      }
    } else {
      return false
    }
  })
}
</script>
<style lang="scss" scoped></style>