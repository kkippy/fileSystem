<template>
  <div>
    <FileTable
      :menuData="fileData"
      :downloadList="selectedFiles"
      @batch-download="handleBatchDownload"
      @upload-file="handleUpload"
      @selection-change="updateSelectedFiles"
      @download-file="downloadSingleFile"
      @delete-file="handleRemoveFile"
    >
      <template #footer>
        <el-pagination
          style="margin-top: 10px;"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :size="size"
          :page-sizes="[20,50,100]"
          :background="true"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getList"
        />
      </template>

    </FileTable>
    <el-dialog v-model="uploadVisible" title="上传文件" width="600">
    <el-upload
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽上传或者 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          文件大小不得超过100M
        </div>
      </template>
    </el-upload>
  </el-dialog>

  </div>
</template>

<script setup lang="ts">
import FileTable from '@/components/FileTable/index.vue'
import {ElMessage } from 'element-plus'
import type {ComponentSize} from 'element-plus'
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
const downloadList = ref<any[]>([])
const uploadVisible = ref(false)
const selectedFiles = ref([]); // 被选中的文件列表
const fileData = [
  {
    id: 1,
    name: '信息化二室.docx',
    uploadTime: '2023-06-06 12:00:00'
  },
  {
    id: 2,
    name: 'test2.docx',
    uploadTime: '2023-06-06 12:00:00'
  },
  {
    id: 3,
    name: 'test3.docx',
    uploadTime: '2023-06-06 12:00:00'
  }
]

const downloadSingleFile = (row:any) => {
  ElMessage({
    message: '下载功能暂未开放',
    type: 'warning'
  })
}

const handleBatchDownload = () => {
  console.log(downloadList.value)
  ElMessage({
    message: '批量下载功能暂未开放',
    type: 'warning'
  })
}

const handleUpload = (val:boolean) => {
  uploadVisible.value = val
}

const getList = () => {

}

const handleSizeChange = () => {
  currentPage.value = 1
  getList()
}

const handleRemoveFile =  (id:number) => {
  console.log(id)
  ElMessage({
    message: '删除功能暂未开放',
    type: 'warning'
  })
}

const updateSelectedFiles = (value:any) => {
  downloadList.value = value
}


</script>
<style scoped lang="scss">

</style>