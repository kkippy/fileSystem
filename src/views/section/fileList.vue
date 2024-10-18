<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="正在下载..."
    element-loading-background="rgba(122, 122, 122, 0.8)"
  >

    <div class="header" >
      <el-form>
        <el-form-item label="文件名" style="margin-top: 18px;margin-left: 20px">
          <el-input id="inputFileField" v-model="searchFileName" @keyup.enter="onSearch" placeholder="请输入文件名" />
        </el-form-item>
      </el-form>

      <div style="margin-right: 40px">
        <el-button type="primary" :icon="Search" @click="onSearch" :disabled="!searchFileName">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>

    <FileTable
      v-loading="loading"
      :menuData="fileData"
      :downloadList="selectedFiles"
      @batch-download="handleBatchDownload"
      @upload-file="handleUpload"
      @selection-change="updateSelectedFiles"
      @download-file="downloadSingleFile"
      @delete-file="handleRemoveFile"
      @share-file="handleShareFile"
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
        v-loading="uploadLoading"
        element-loading-text="正在上传..."
        @upload-change="handleChangeUpload"
      />
    </el-dialog>

    <el-dialog v-model="shareVisible" title="分享文件" width="600">
      <el-input
        v-model="shareLink"
        placeholder="Please input"
      >
        <template #append>
          <el-button style="width: 100px;
                            background-color: #67c23a;
                            border-radius:0 4px 4px 0 ;
                            color: #fff;font-size: 15px;
                            letter-spacing: 2px;
                            text-align: center"
                     @click="copyLink"
          >
            复制链接
          </el-button>
        </template>
      </el-input>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import FileTable from '@/components/FileTable/index.vue'
import Upload from '@/components/Upload/index.vue'
import {ElMessage } from 'element-plus'
import type {ComponentSize} from 'element-plus'
import { ref,onMounted,watchEffect } from 'vue'
import { getFileList,uploadFile,deleteFile,shareFile } from '@/api/file'
import {downloadFileUtil} from '@/utils/fileTools'
import { useRoute } from 'vue-router'
import type {RouteLocationNormalizedLoaded } from 'vue-router'
import type {fileResponse,fileList}  from '@/api/file/type'
import { Search } from '@element-plus/icons-vue'

interface Route extends RouteLocationNormalizedLoaded{
  meta:  {
    bucket?: string;
  }
}

let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
const downloadList = ref<any[]>([])
const uploadVisible = ref(false)
const shareVisible = ref(false)
const fullscreenLoading = ref(false)
const selectedFiles = ref([]); // 被选中的文件列表
const fileData = ref<fileList>([])
let searchFileName = ref<string>('')
let shareLink = ref<string>('')
const route = useRoute() as Route
const loading = ref(false)
const uploadLoading = ref(false)
let bucket: string | undefined = route.meta.bucket ||  route.fullPath

onMounted(()=>{
  getLists()
})

const inputField = document.getElementById('inputFileField');
inputField?.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    onSearch()
  }
});

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
  await downloadFileUtil(bucket as string,row.showName,row.fileName)
  fullscreenLoading.value = false
}

const handleShareFile = async (row:any) => {
  try {
    const result:any = await shareFile(bucket as string,row.showName)
    shareLink.value = result.data.presignedUrl
    shareVisible.value = true
  } catch (error) {
    console.log(error)
  }
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
  // loading.value = true
  try {
    const result:fileResponse = await getFileList(bucket || route.fullPath,currentPage.value,pageSize.value)
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
  const result:any =await deleteFile(bucket as string,row.showName)
  if(result.code === 200){
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    await getLists()
  }
}

const onSearch = async () => {
  const result:fileResponse = await getFileList(bucket as string,currentPage.value,
    pageSize.value,searchFileName.value)
  fileData.value = result.items
  total.value = result.counts
  searchFileName.value = ''
}

const reset = () =>{
  getLists()
}

const handleChangeUpload = async(file:any) =>{
  if (!file) return;
  const formData = new FormData();
  formData.append('uploadfile',file);
  try {
    uploadLoading.value = true
    const result:any = await uploadFile({ bucket: bucket, uploadfile: file.raw })
    if(result.code === 200){
      ElMessage({
        message: '上传成功',
        type: 'success'
      })
      await getLists()
    }
  } catch (error){
    console.log(error)
  } finally {
    uploadLoading.value = false
    uploadVisible.value = false
  }
}

const updateSelectedFiles = (value:any) => {
  downloadList.value = value
}

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value)
  ElMessage({
    message: '复制成功',
    type: 'success'
  })
  shareVisible.value = false
}


</script>
<style scoped lang="scss">

.header {
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  box-shadow: 0 0 12px rgba(0,0,0,0.12);

  .el-card__body {
    padding: 0;
  }
}

.btn {
  width: 100px;
  background-color: #409eff;
  border-radius:0 4px 4px 0 ;
}
</style>

<style scoped>
.el-input-group__append, .el-input-group__prepend{
  background-color: #409eff;
}
</style>