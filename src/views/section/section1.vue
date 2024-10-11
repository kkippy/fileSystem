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
    />

    <el-pagination
      style="margin-top: 20px;"
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
  </div>
</template>

<script setup lang="ts">
import FileTable from '@/components/FileTable/index.vue'
import {ElMessage } from 'element-plus'
import type {ComponentSize} from 'element-plus'
import { ref } from 'vue'

let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
const downloadList = ref<any[]>([])

const selectedFiles = ref([]); // 被选中的文件列表
const fileData = [
  {
    id: 1,
    name: 'test.docx',
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

const handleUpload = () => {
  ElMessage({
    message: '上传功能暂未开放',
    type: 'warning'
  })
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