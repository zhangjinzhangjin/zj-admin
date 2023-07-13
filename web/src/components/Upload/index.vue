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
import request from "@/utils/request";
function getFile(id) {
  return request({
    url: "/file/getOneById",
    method: "get",
    params: { id },
  });
}
function downloadFile(id) {
  return request({
    url: "/file/downloadById",
    method: "get",
    params: { id },
    responseType: 'blob',
  });
}
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
  url: import.meta.env.VITE_API_BASEPATH + "file/upload",
  headers: { Authorization: "Bearer " + token }
})
const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
  updateModel();
}
const handlePreview = async (uploadFile) => {
  console.log(uploadFile)
  // 这里做下载功能
  if (type === 'view') {
    // 第一种直接文件地址下载，因为后端加了时间戳，所以下载的文件会变成这样内网_1688694163233.bat。。。不太友好
    // return window.location.href = import.meta.env.VITE_API_BASEPATH + uploadFile.url.substring(1)
    const res = await downloadFile(uploadFile._id)
    const { data, headers } = res
    const blob = new Blob([data], { type: headers['content-type'] })
    let dom = document.createElement('a')
    let url = window.URL.createObjectURL(blob)
    dom.href = url
    dom.download = uploadFile.name;
    dom.style.display = 'none'
    document.body.appendChild(dom)
    dom.click()
    document.body.removeChild(dom)
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
  } else {
    const buffer = rawFile.name.split(".")
    const extname = buffer[buffer.length - 1];
    if (allowFormat.indexOf(extname) < 0) {
      message = "文件格式不符，请仔细核对。当前支持上传的文件格式为:" + allowFormat + "!"
      common.tip(message, "error")
      return false
    }
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
    fileList.value = []
    ids.forEach(async id => {
      const res = await getFile(id) as any;
      fileList.value.push(res.data)
    })
  }
})
</script>
<style scoped lang="scss">
.uploadWapper {
  width: 100%;

  &.viewMode {
    :deep(.el-upload-list) {
      margin-top: -30px;

      .el-upload-list__item-status-label,
      .el-icon--close,
      .el-icon--close-tip {
        display: none;
      }
    }
  }
}</style>