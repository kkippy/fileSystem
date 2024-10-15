<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="正在下载..."
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >
    <FileTable
      v-loading="loading"
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
      <Upload
        v-loading="loading"
        element-loading-text="正在上传..."
        @upload-change="handleChangeUpload"
      />
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import FileTable from '@/components/FileTable/index.vue'
import Upload from '@/components/Upload/index.vue'
import {ElMessage } from 'element-plus'
import type {ComponentSize} from 'element-plus'
import { ref,onMounted,watchEffect } from 'vue'
import { getFileList,uploadFile,deleteFile } from '@/api/file'
import {downloadFileUtil} from '@/utils/fileTools'
import { useRoute } from 'vue-router'
let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
const downloadList = ref<any[]>([])
const uploadVisible = ref(false)
const fullscreenLoading = ref(false)
const selectedFiles = ref([]); // 被选中的文件列表
const fileData = ref([])

const route = useRoute()
const loading = ref(false)
let bucket = route.meta.bucket || 'default'

onMounted(()=>{
  console.log(route,'route')
  getLists()
})

watchEffect(async ()=>{
  if(bucket !== route.meta.bucket){
    loading.value = true
    bucket = route.meta.bucket
    await getLists()
    loading.value = false
  }
})

const downloadSingleFile = async (row:any) => {
  fullscreenLoading.value = true
  // console.log(typeof bucket,'bucket')
  await downloadFileUtil(bucket,row.showName,row.fileName)
  fullscreenLoading.value = false
}

const handleBatchDownload = () => {
  ElMessage({
    message: '批量下载功能暂未开放',
    type: 'warning'
  })
}

const handleUpload = (val:boolean) => {
  uploadVisible.value = val
}

const getLists = async () => {
  loading.value = true
  try {
    const result:any = await getFileList(bucket,currentPage.value,pageSize.value)
    fileData.value = result.items.map(item => {
      let newItem = { ...item };
      let [name, extension] = newItem.fileName.split(/\.(?=[^.]+$)/); // 分割出文件名和扩展名
      let parts = name.split("_");
      if (parts.length > 1) {
        parts.splice(1, 1);
      }
      newItem.fileName = parts.join("") + "." + extension; // 保留扩展名
      return newItem;
    });
    console.log(fileData.value)
    total.value = result.counts
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

const handleSizeChange = () => {
  currentPage.value = 1
  getLists()
}

const handleRemoveFile =  async (row:any) => {
  const result:any =await deleteFile(bucket,row.showName)
  if(result.code === 200){
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    await getLists()
  }
}

const handleChangeUpload = async(file:File) =>{
  if (!file) return;
  const formData = new FormData();
  formData.append('uploadfile',file);
  try {
    loading.value = true
    const result:any = await uploadFile({ bucket: bucket, uploadfile: file.raw })
    if(result.code === 200){
      ElMessage({
        message: '上传成功',
        type: 'success'
      })
      uploadVisible.value = false
      loading.value = false
      await getLists()
    }
  } catch (error){
    console.log(error)
  }
}

const updateSelectedFiles = (value:any) => {
  downloadList.value = value
}


</script>
<style scoped lang="scss">

</style>