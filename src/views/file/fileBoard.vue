<template>
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-text="正在下载..."
      element-loading-background="rgba(122, 122, 122, 0.8)"
    >
      <div class="header" >
        <div class="headerLeft">
          <el-button style="margin-left: 20px" type="primary" :icon="Plus" @click="beforeAddFolder">新增文件夹</el-button>
          <el-button type="success" :icon="Upload" @click=" uploadVisible = true" >上传文件</el-button>

          <el-form style="margin-left: 10px">
            <el-form-item label="文件名" style="margin-top: 18px;margin-left: 20px">
              <el-input id="inputFileField" v-model="searchName" @keyup.enter="onSearch" placeholder="请输入文件名" />
            </el-form-item>
          </el-form>

          <div style="margin-left: 20px">
            <el-button type="primary" :icon="Search" @click="onSearch" :disabled="!searchName">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
      </div>

      <div class="fileContent" v-loading="fileLoading">
        <ul  v-infinite-scroll="scrollLoad" class="folderList" :infinite-scroll-disabled="disabled">
          <li @dblclick="goToFile(item)"
              class="folder"
              v-for="item in fileListData"
              :key="item.id"
              @contextmenu.prevent="onContextMenu($event, item)">
            <div class="icon-container"
                 @mouseenter="handlePreview(item)"
                 @mouseleave="handleCancelPreview(item)">
              <SvgIcon v-if="item.isPreview" :width="90" :height="82" name="preview" @click="previewFile(item)" />
              <SvgIcon class="fileTour" v-if="!item.isPreview && ((item.suffixName as string)) === 'pdf'" :width="96" :height="150" name="pdf" />
              <SvgIcon class="folderTour" v-else-if="!item.isPreview && item.isDir === 1" :width="120" :height="150" name="folder" />
              <SvgIcon v-else-if="!item.isPreview && isSpecialFileType((item.suffixName as string),'document')" :width="115" :height="150" name="txt" />
              <SvgIcon v-else-if="!item.isPreview && isSpecialFileType((item.suffixName as string),'picture')" :width="98" :height="150" name="picture" />
              <SvgIcon v-else-if="!item.isPreview && isSpecialFileType((item.suffixName as string),'compress')" :width="98" :height="150" name="compress" />
              <SvgIcon v-else-if="!item.isPreview && isSpecialFileType((item.suffixName as string),'video')" :width="98" :height="150" name="video" />
              <SvgIcon v-else-if="!item.isPreview && isSpecialFileType((item.suffixName as string),'excel')" :width="98" :height="150" name="excel" />
            </div>

            <div class="objectName">
              <div class="objectNameContent" style="display: flex;align-items: center; " >
                <span :title="item.fileName" v-if="!item.isEditing" class="folderName">{{ item.fileName }}</span>
                  <el-input
                    v-else
                    id="renameInput"
                    ref="renameInputRef"
                    v-model="item.fileName"
                    style="width: 130px"
                    autofocus
                    @blur="updateDocumentName(item)"
                    @click.stop
                    @keyup.enter="updateDocumentName(item)"
                  />
              </div>
            </div>
          </li>
        </ul>
        <div class="scrollStatus">
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">已经到底啦~</p>
        </div>
        <el-empty v-if="fileListData.length === 0" description="暂无数据" />
      </div>

      <el-dialog v-model="previewDialog" width="300">
        <h1>文件预览</h1>
      </el-dialog>

      <el-tour v-model="userStore.help">
        <el-tour-step
          :target="'.folderTour'"
          title="文件夹操作" >
        <div>
          右键文件夹可进行打开、重命名和删除文件夹的操作<br/>
          双击文件夹可查看其中文件
        </div>
        </el-tour-step>
        <el-tour-step :target="'.fileTour'" title="文件操作">
          <div>
            右键文件可进行下载、分享、重命名等操作<br/>
            单击文件可进行预览
          </div>
        </el-tour-step>
      </el-tour>

      <el-dialog v-model="uploadVisible" title="上传文件" width="600">
        <UploadComponent
          v-loading="uploadLoading"
          element-loading-text="正在上传..."
          @upload-change="handleChangeUpload"
        />
      </el-dialog>

      <el-dialog v-model="addFolderVisible" width="400">
        <el-form ref="addFolderRef"
                 :model="addFolder"
                 :rules="addRules"
                 style="margin-top: 20px;"
                 label-width="80px">
          <el-form-item prop="folderName" label="文件夹名">
            <el-input v-model="addFolder.folderName" placeholder="请输入文件夹名" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div style="padding-top: 0;">
            <el-button @click="addFolderVisible = false">取消</el-button>
            <el-button type="primary" @click="handleAddFolder">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>

    </div>
</template>


<script setup lang="ts">
import { useRoute, } from 'vue-router'
import { ref, onMounted, nextTick, computed, watchEffect, reactive, onBeforeUnmount, watch } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import UploadComponent from '@/components/Upload/index.vue'
import ContextMenu from '@imengyu/vue3-context-menu'
import { useUserStore } from '@/stores/user'
import { Search,Plus,Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type {FormInstance} from "element-plus";
import { getFileList, uploadFile,createFolder,deleteFolder,
  renameFile,renameFolder,deleteFile,downloadFile } from '@/api/file'
import type {fileItem,fileList,fileResponse} from '@/api/file/type'
import type {RouteLocationNormalizedLoaded } from 'vue-router'
import { SET_PATH,GET_PATH } from '@/utils/path'
import {downloadFileUtil} from '@/utils/fileTools'

interface Route extends RouteLocationNormalizedLoaded{
  meta:  {
    bucket?: string;
  }
}

interface IAddFolder {
  folderName:string
}

const route = useRoute() as Route
const renameInputRef = ref()
const isEdit = ref<boolean>(false);
let searchName = ref<string>('')
const loading = ref<boolean>(false)
const fileLoading = ref<boolean>(false)
const noMore = computed(() => fileListData.value.length >= 20)
const disabled = computed(() => loading.value || noMore.value)
const fileListData = ref<fileList>([])
const userStore = useUserStore();
const pictureType:string[] = ['png','jpg','jpeg']
const compressType:string[] = ['zip','rar','7z']
const videoType:string[] = ['mp4','mov','flv','avi']
const documentType:string[] = ['txt','doc','docx','avi']
const excelType:string[] = ['xlsx','xlsm','xlsb','xltx']
let previewDialog = ref<boolean>(false)
let bucket: string | undefined = route.meta.bucket ||  route.fullPath
let uploadVisible = ref<boolean>(false)
let uploadLoading = ref<boolean>(false)
let addFolderVisible = ref<boolean>(false)
let fullscreenLoading = ref(false)
const filePath = ref<string>('/')
const addFolderRef = ref<FormInstance>()
let timerId: ReturnType<typeof setTimeout> | null = null;
const validatorFolderName = (rule:any,value:any,callBack:any)=>{
  if(value === '' ){
    callBack(new Error('文件夹名不能为空'))
  }else{
    callBack()
  }
}

const addRules = reactive({
  folderName:[
    {required:true,trigger:"blur",validator:validatorFolderName}
  ]
})

const addFolder = reactive<IAddFolder>({
  folderName: ''
})

const isSpecialFileType  = (fileType:string,type:string):boolean => {
  const lowerCaseFileType  = fileType.toLowerCase()
  const fileTypes:Record<string, string[]> = {
    picture: pictureType,
    compress: compressType,
    video: videoType,
    document: documentType,
    excel: excelType
  };
  return fileTypes[type].includes(lowerCaseFileType );
}

watch(()=>userStore.path,()=>{
  userStore.path  = GET_PATH() as string
  getFiles()
})

watchEffect( ()=>{
  if(bucket !== route.meta.bucket){
    bucket = route.meta.bucket
    getFiles()
  }
})

onMounted(()=>{
  fileListData.value.forEach(item => {
    item.isEditing = false
    item.isPreview = false
  })
  getFiles()
})

const getFiles = async () =>{
  const result:fileResponse = await getFileList(bucket as string,userStore.path )
  if(result.code === 200){
    fileListData.value = result.data || []
  } else {
    ElMessage({
      message: result.msg,
      type: 'error'
    })
  }
}

const handleChangeUpload = async(file:any) =>{
  if (!file) return;
  const formData = new FormData();
  formData.append('uploadFile',file);
  try {
    uploadLoading.value = true
    const result:any = await uploadFile({ bucket: bucket, path:filePath.value, uploadFile: file.raw })
    if(result.code === 200){
      ElMessage({
        message: '上传成功',
        type: 'success'
      })
      await getFiles()
    }
  } catch (error){
    console.log(error)
  } finally {
    uploadLoading.value = false
    uploadVisible.value = false
  }
}

const handlePreview = (item:fileItem) =>{
  if(item.isDir === 1) return
  item.isPreview = true
}

const handleCancelPreview = (item:fileItem) =>{
  if(item.isDir === 1) return
  item.isPreview = false
}

const previewFile = (item:fileItem) =>{
  previewDialog.value = true
}

const beforeAddFolder = () =>{
  addFolder.folderName = ''
  nextTick(() => {
    try {
      if (addFolderRef.value) {
        addFolderRef.value.clearValidate()
      }
    } catch (error) {
      console.error('Error clearing validation:', error)
    }
  })
  addFolderVisible.value = true
}

const handleAddFolder = async ()=>{
  await addFolderRef.value?.validate()
  const result:any = await createFolder(bucket as string,addFolder.folderName,filePath.value)
  if(result.code === 500){
    ElMessage({
      message: result.msg,
      type:'error'
    })
  }else{
    ElMessage({
      message: '创建成功',
      type: 'success'
    })
    addFolderVisible.value = false
    await getFiles()
  }
}

const handleDownloadFile = async (item:fileItem) =>{
  fullscreenLoading.value = true
  await downloadFileUtil(bucket as string,item.path + item.fileName,item.id,item.fileName)
  fullscreenLoading.value = false
}

const onSearch = () => {
  ElMessage({
    message: '暂未开放',
    type: 'warning'
  })
  searchName.value = ''
}

const reset = () => {
  searchName.value = ''
}

const scrollLoad = () => {
  // loading.value = true
  // setTimeout(() => {
  //   fileList.value.push({ id: 6, name: 'Folder 6', isEditing: false,isDir:1 })
  //   loading.value = false
  // }, 2000)
  // 查询接口，相当于分页
}

const handleRename = (item: fileItem) => {
  if (isEdit.value) return;
  isEdit.value = true;
  item.isEditing = true;
  if (item.isDir === 0) {
    nextTick(() => {
      if (renameInputRef.value) {
        const commaIndex = item.fileName.indexOf('.');
        if (commaIndex !== -1) {
          const obj = document.getElementById('renameInput') as HTMLInputElement;
          timerId = setTimeout(() => {
            obj?.setSelectionRange(commaIndex, commaIndex);
          }, 1);
          renameInputRef.value && renameInputRef.value[0].focus();
        }
      }
    });
  } else {
    nextTick(() => {
      renameInputRef.value && renameInputRef.value[0].focus();
    });
  }
}

const updateDocumentName = async (item: fileItem) => {
  let newName = item.fileName;
  try {
    if (item.isDir === 1) {
      const result: any = await renameFolder(bucket as string, item.fileName, item.path, String(item.id));
      if (result.code === 200) {
        ElMessage({
          message: '重命名成功',
          type: 'success'
        });
      } else {
        ElMessage({
          message: item.fileName === newName ? '已取消' : '重命名失败',
          type: item.fileName === newName ? 'warning' : 'error'
        });
      }
      await getFiles();
    } else {
      const result: any = await renameFile(bucket as string, item.path, {
        id: item.id,
        fileName: item.fileName,
        status: item.status,
      });
      if (result.code === 200) {
        ElMessage({
          message: '重命名成功',
          type: 'success'
        });
      } else {
        ElMessage({
          message: item.fileName === newName ? '已取消' : '重命名失败',
          type: item.fileName === newName ? 'warning' : 'error'
        });
      }
    }
  } catch (error) {
    ElMessage({
      message: `${error}`,
      type: 'error'
    });
  }

  item.isEditing = false;
  isEdit.value = false;
}

const handleDeleteFolder = async(item:any) => {
  const result:any =await deleteFolder(item.id)
  if(result.code === 200) {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
  } else {
    ElMessage({
      message: result.msg,
      type: 'error'
    })
  }
  await getFiles()
}

const handleDeleteFile = async(item:any) => {
  const result:any =await deleteFile(bucket as string,item.id,item.path+item.fileName)
  if(result.code === 200){
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
  } else {
    ElMessage({
      message: result.msg,
      type: 'error'
    })
  }
  await getFiles()
}

const onContextMenu = (event:MouseEvent, config:fileItem) =>{
  event.preventDefault();
  const userRole = userStore.userRole;
  const commonItems = [
    {
      label: "重命名",
      divided: true,
      icon: "icon-zhongmingming",
      onClick: () => {
        handleRename(config);
      },
    },
  ];

  const showContextMenu = (items:any[])=>{
    try {
      ContextMenu.showContextMenu({
        x: event.clientX,
        y: event.clientY,
        theme: 'mac',
        items: items,
      });
    } catch (error) {
      console.error('Error showing context menu:', error);
    }
  }

  if (config.isDir === 0) {
    const items = [{
        label: "分享",
        divided: true,
        icon: 'icon-fenxiang',
        onClick: () => {
          // this.openDocument(config.id);
        },
      },
      {
        label: "下载",
        divided: true,
        icon: "icon-xiazai",
        onClick: () => {
          handleDownloadFile(config)
        },
      },
      ...commonItems,
      {
        label: "删除",
        icon: "icon-shanchu",
        onClick: () => {
         handleDeleteFile(config)
        },
      }];
    showContextMenu(items);
  } else if (userRole !== 'user') {
    const items = [{
        label: "打开",
        divided: true,
        icon: 'icon-a-folder-opened',
        onClick: () => {
          goToFile(config);
        },
      },
      ...commonItems,
      {
        label: "删除",
        icon: "icon-shanchu",
        onClick: () => {
         handleDeleteFolder(config)
        },
      }];
    showContextMenu(items);
  } else {
    const items = [
      {
        label: "打开",
        divided: true,
        icon: 'icon-a-folder-opened',
        onClick: () => {
          goToFile(config);
        },
      },
      ...commonItems];
    showContextMenu(items);
  }
}

const goToFile = async (item:fileItem) => {
  if(item.isDir === 0) return
  filePath.value = item.path + item.fileName + '/'
  userStore.path = filePath.value
  SET_PATH(userStore.path)
  const result:fileResponse = await getFileList(bucket as string,filePath.value)
  fileListData.value = result.data || []
};

onBeforeUnmount(() => {
  if (timerId) {
    clearTimeout(timerId);
  }
});

</script>

<style scoped lang="scss">
.header {
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  box-shadow: 0 0 12px rgba(0,0,0,0.12);

  .headerLeft {
    display: flex;
    flex: 0 0 90%;
    align-items: center;

    .back{
      margin-left: 10px;

      &:hover{
        cursor: pointer;
      }
    }
  }

  .headerRight {
    display: flex;
    flex: 0 0 20%;
    align-items: center;
  }

  .el-card__body {
    padding: 0;
    }
}

.fileContent {
    margin-top: 20px;
    border-radius: 10px;
    height: 75vh;
    overflow: auto;
    box-shadow: 0 0 12px rgba(0,0,0,0.12);

  .scrollStatus {
  margin: 0 auto;

  p{
    text-align: center;
    color:#606266;
    }
  }

  .folderList {
    display: flex;
    gap: 0 15px;
    flex-flow: row wrap;
    align-content: space-around;


  .folder {
    display: flex;
    flex-direction: column;
    flex:  0 0 9%;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    position: relative;
    &:hover{
      cursor: pointer;
    }

    .icon-container {
      position: relative;
      width: 90%;
      height: 80%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .objectName {
      width: 75%;
      height: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;

      .objectNameContent{
        width: 100%;
        height: 100%;

        .folderName{
          width: 100%;
          text-align: center;
          white-space: nowrap;        /* 不换行 */
          overflow: hidden;          /* 隐藏超出部分 */
          text-overflow: ellipsis;   /* 使用省略号表示溢出部分 */
        }
      }

      .editIcon{
        margin-left: 15px;
        display: none;
      }

      &:hover{
        .editIcon{
          display: block;
          cursor: pointer;
        }
      }
    }
  }
 }

}

</style>