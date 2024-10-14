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
<!--      <el-upload-->
<!--        class="upload-demo"-->
<!--        drag-->
<!--        action="http://192.168.195.205:8080/api/file/uploadfile"-->
<!--        multiple-->
<!--        :before-upload="handleBeforeUpload"-->
<!--        :on-change="handleChangeUpload"-->
<!--      >-->
<!--        <el-icon class="el-icon&#45;&#45;upload"><upload-filled /></el-icon>-->
<!--        <div class="el-upload__text">-->
<!--          拖拽上传或者 <em>点击上传</em>-->
<!--        </div>-->
<!--        <template #tip>-->
<!--          <div class="el-upload__tip">-->
<!--            文件大小不得超过1000M-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-upload>-->
<!--      <template #footer>-->
<!--        <el-button @click="uploadVisible = false">取消</el-button>-->
<!--        <el-button type="primary" @click="handleUploadFile">确定</el-button>-->
<!--      </template>-->
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        :file-list="file"
        action="http://192.168.195.205:8080/api/file/uploadfile"
        :on-success="hsucess"
        :auto-upload="false"
      >
        <template #trigger>
          <el-button type="primary">select file</el-button>
        </template>

        <el-button class="ml-3" type="success" @click="submitUpload">
          upload to server
        </el-button>

        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
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
import { downloadFile, getFileList,uploadFile } from '@/api/file'
import type { UploadProps } from 'element-plus'
let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
const downloadList = ref<any[]>([])
const uploadVisible = ref(false)

const selectedFiles = ref([]); // 被选中的文件列表
const fileData = ref([])
const file = ref([])

onMounted(()=>{
  getLists()
})

const downloadSingleFile = async (row:any) => {
  console.log(row,'row')
  const result = await downloadFile('basic',row.showName)
  console.log(result,'文件下载')
  const url = window.URL.createObjectURL(new Blob([result]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', row.showName); // 设置下载的文件名
  document.body.appendChild(link);
  link.click(); // 触发下载
  link.remove(); // 下载完后移除链接
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
    const result = await getFileList('basic')
    fileData.value = result.items.map(item => {
      let newItem = { ...item };

      let [name, extension] = newItem.fileName.split(/\.(?=[^.]+$)/); // 分割出文件名和扩展名

      // 处理文件名，去掉下划线后的部分
      let parts = name.split("_");
      if (parts.length > 1) {
        parts.splice(1, 1); // 移除不必要的部分
      }

      // 重新组合文件名
      newItem.fileName = parts.join("") + "." + extension; // 保留扩展名

      return newItem; // 返回处理后的文件项
    });

    total.value = result.counts
  } catch (error) {
    console.log(error)
  }
}

const handleSizeChange = () => {
  currentPage.value = 1
  getLists()
}

const handleRemoveFile =  (id:number) => {
  console.log(id)
  ElMessage({
    message: '删除功能暂未开放',
    type: 'warning'
  })
}

const handleBeforeUpload = async(file:any) =>{
  console.log(file.name,'file')
  const uploadParams = {
    bucket: 'basic',
  }
  const result = await uploadFile(uploadParams)
  console.log(result,'上传文件')
}
// const handleChangeUpload = async(file:any) =>{
//   file.value = file
//   console.log(file,'上传成功')
// }

const handleUploadFile = async() =>{
  const uploadParams = {
    bucket: 'basic',
    uploadfile: file
  }
  const result = await uploadFile(uploadParams)
  console.log(result,'上传文件')
  uploadVisible.value = false

}



import type { UploadInstance } from 'element-plus'

const uploadRef = ref<UploadInstance>()

const submitUpload = () => {
  uploadRef.value!.submit()
}

const hsucess :UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const updateSelectedFiles = (value:any) => {
  console.log(file.value,'wenjain')
  downloadList.value = value
}


</script>
<style scoped lang="scss">

</style>