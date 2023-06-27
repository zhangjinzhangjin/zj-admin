<template>
  <el-upload v-model:file-list="fileList" class="uploadWapper" :action="uploadSetting.url" :multiple="multiple"
    :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="limit"
    :on-exceed="handleExceed" :before-upload="beforeUpload" :show-file-list="showFileList"
    :headers="uploadSetting.headers" :on-success="handleSuccess" :class="{ viewMode: type == 'view' }">
    <el-button type="primary" v-if="type == 'edit'">点击上传</el-button>
    <template #tip v-if="type == 'edit' && showTip">
      <div class="el-upload__tip">
        最多上传{{ limit }}个文件; 文件最大{{ size }}MB; 支持类型:{{ allowFormat === 'all' ? '全部' : allowFormat }}
      </div>
    </template>
  </el-upload>
</template>
<script setup lang="ts">
import { UploadUserFile } from 'element-plus'
import { onBeforeMount, reactive, ref, unref } from 'vue'
import common from "@/common"
import { getToken } from '@/utils/auth'
defineOptions({
  name: "Upload"
})
const props = defineProps({
  type: {
    type: String,
    default: "edit" // edit view
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  limit: {
    type: Number,
    default: 1,
  },
  showFileList: {
    type: Boolean,
    default: true,
  },
  allowFormat: {
    type: String,
    default: "all", // jpg,doc,docx
  },
  size: {
    type: Number,
    default: 100, // M
  },
  showTip: {
    type: Boolean,
    default: true,
  },
  modelValue: { // 文件id中间加,拼的字符串
    type: String,
    default: ""
  },
})
// const { type, multiple, limit, showFileList, allowFormat } = toRefs(props)
const { type, multiple, limit, showFileList, allowFormat, size, showTip, modelValue } = props
const emit = defineEmits(['update:modelValue'])
const fileList = ref<UploadUserFile[]>([])
const token = getToken();
const uploadSetting = reactive({
  url: import.meta.env.VITE_API_BASEPATH + "/img/upload",
  headers: { Authorization: "Bearer " + token }
})
const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
  updateModel();
}
const handlePreview = (uploadFile) => {
  console.log(uploadFile)
  // 这里做下载功能
  if (type === 'view') {
    return console.log("这里做下载功能,文件id为" + uploadFile.uid)
  }
}
const beforeRemove = () => {
  if (type === "view") {
    return false;
  } else {
    return true;
  }
}
const handleExceed = () => {
  const message = `限制为最多上传${limit}个文件！！`
  common.tip(message, "error")
}
const beforeUpload = (rawFile) => {
  let message: string = ''
  if (rawFile.size / 1024 / 1024 > size) {
    message = "文件大小不符，请仔细核对。当前允许上传的文件大小不超过" + size + "MB!"
    common.tip(message, "error")
    return false
  }
  if (allowFormat === 'all') {
    return true;
  } else if (allowFormat.indexOf(rawFile.type) < 0) {
    message = "文件格式不符，请仔细核对。当前支持上传的文件格式为:" + allowFormat + "!"
    common.tip(message, "error")
    return false
  }
  return true
}
const handleSuccess = () => {
  updateModel();
}
// 设置表单formModel值
const updateModel = () => {
  let ids = ""
  fileList.value.forEach(item => {
    let id = ''
    const response = item.response as any;
    if (response && response.data) {
      id = response.data.uid
    } else {
      id = item.uid!.toString();
    }
    ids = ids + id + ','
  })
  if (ids.length) {
    ids = ids.substring(0, ids.length - 1)
  }
  emit('update:modelValue', ids)
}
// 设置默认值
onBeforeMount(() => {
  if (modelValue.length) {
    const ids = modelValue.split(",")
    const uploadFlag = unref(fileList).find(item => {
      if (item.response) {
        return true
      }
    })
    console.log("文件ids:", ids)
    // todo  初始化fileList
    fileList.value = [
      {
        name: 'element-plus-logo.svg',
        url: 'https://element-plus.org/images/element-plus-logo.svg',
      },
      {
        name: 'element-plus-logo2.svg',
        url: 'https://element-plus.org/images/element-plus-logo.svg',
      },
    ]
  }
})
</script>
<style scoped lang="scss">
.uploadWapper {
  width: 100%;

  &.viewMode {
    :deep(.el-upload-list) {
      margin-top: -30px;
    }
  }
}
</style>