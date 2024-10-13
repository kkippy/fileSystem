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
          @current-change="getLists"
        />
      </template>

    </FileTable>
    <el-dialog v-model="uploadVisible" title="上传文件" width="600">
      <el-upload
        class="upload-demo"
        drag
        action="https://6896dbc3.r17.cpolar.top/api/file/uploadfile"
        multiple
        :before-upload="handleBeforeUpload"
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
import { ref,onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import {getFileList,downloadFile,deleteFile,uploadFile} from '@/api/file'


let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
const downloadList = ref<any[]>([])
const uploadVisible = ref(false)
const selectedFiles = ref([]); // 被选中的文件列表

const fileData = ref([])

onMounted(() => {
  getLists()
})

const downloadSingleFile = async (row:any) => {
  const result = await downloadFile('section1',row.fileName)
  console.log(result,'文件下载')
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

const getLists = async () => {
  try {
    const result = await getFileList('section1')
    fileData.value = result.data
    console.log(result,'文件列表')
  } catch (error) {
    console.log(error)
  }
}

const handleSizeChange = () => {
  currentPage.value = 1
  getLists()
}

const handleRemoveFile =  async (file:any) => {
  console.log(typeof file.fileName,'file')
  const result = await deleteFile('section1',file.fileName)
  if(result.code === 200){
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    await getLists()
  }
  console.log(result,'删除文件')
}

const updateSelectedFiles = (value:any) => {
  downloadList.value = value
}

const handleBeforeUpload = async(file:any) =>{
  console.log(file.name,'file')
  const result = await uploadFile('section1',file.name)
  console.log(result,'上传文件')
}


</script>
<style scoped lang="scss">

</style>