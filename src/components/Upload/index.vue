<template>
  <el-upload
    action=""
    drag
    :auto-upload="false"
    :on-change="handleChangeUpload"
    :show-file-list="false"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      拖拽上传或<em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        文件大小不得超过1000M
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
const emit = defineEmits(['upload-change', 'upload-exceed'])

const handleChangeUpload = (file:any) => {
  emit('upload-change', file)
}

</script>

<style scoped lang="scss">

</style>