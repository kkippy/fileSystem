<template>
    <div >
      <div class="header" >
        <div class="headerLeft">
          <el-button style="margin-left: 20px" type="primary" :icon="Plus">新增文件夹</el-button>
          <el-button type="success" :icon="Upload" >上传文件</el-button>

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

      <div class="fileContent">
        <ul  v-infinite-scroll="scrollLoad" class="folderList" :infinite-scroll-disabled="disabled">
          <li @dblclick="goToFile(item)"
              class="folder"
              v-for="item in fileList"
              :key="item.id"
              @contextmenu.prevent="onContextMenu($event, item)">
            <div class="icon-container"
                 @mouseenter="handlePreview(item)"
                 @mouseleave="handleCancelPreview(item)">
              <SvgIcon v-if="item.isPreview" :width="90" :height="82" name="preview" @click="previewFile(item)" />
              <SvgIcon class="fileTour" v-if="!item.isPreview && ((item.fileType as string).toLowerCase()) === 'pdf'" :width="96" :height="150" :name="item.isPreview ? 'preview' : 'pdf'" />
              <SvgIcon class="folderTour" v-else-if="!item.isPreview && item.isDir === 1" :width="120" :height="150" name="folder" />
              <SvgIcon v-else-if="!item.isPreview && item.fileType === 'txt'" :width="115" :height="150" name="txt" />
              <SvgIcon v-else-if="!item.isPreview && isSpecialFileType((item.fileType as string),'picture')" :width="98" :height="150" :name="item.isPreview ? 'preview' :'picture'" />
              <SvgIcon v-else-if="!item.isPreview && isSpecialFileType((item.fileType as string),'compress')" :width="98" :height="150" :name="item.isPreview ? 'preview' : 'compress'" />
              <SvgIcon v-else-if="!item.isPreview && isSpecialFileType((item.fileType as string),'video')" :width="98" :height="150" :name="item.isPreview ? 'preview' :'video'" />
            </div>

            <div class="objectName">
              <div style="display: flex;align-items: center;transition: all 0.3s; " >
                <p v-if="!item.isEditing" class="folderName">{{ item.name }}</p>
                <el-input
                  v-else
                  ref="renameInputRef"
                  v-model="item.name"
                  style="width: 130px"
                  autofocus
                  @blur="updateFolderName(item)"
                  @click.stop
                  @keyup.enter="updateFolderName(item)"
                />
              </div>
            </div>
          </li>
        </ul>
        <div class="scrollStatus">
          <p v-if="loading">加载中...</p>
          <p v-if="noMore">已经到底啦~</p>
        </div>
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


    </div>
</template>


<script setup lang="ts">
import { useRouter, useRoute, } from 'vue-router'
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ContextMenu from '@imengyu/vue3-context-menu'
import type {Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Search,Plus,Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface FileItem {
  id: number;
  name: string;
  isDir: number;
  isEditing?: boolean;
  fileType?: string;
  isPreview?:boolean
}

type FileList = Array<FileItem>

const router:Router = useRouter() ;
const route = useRoute();
const renameInputRef = ref()
const isEdit = ref<boolean>(false);
let searchName = ref<string>('')
const loading = ref<boolean>(false)
const noMore = computed(() => fileList.value.length >= 20)
const disabled = computed(() => loading.value || noMore.value)
const fileList = ref<FileList>([
  { id: 2, name: 'Folder 1', isDir:1,fileType:'' },
  { id: 3, name: 'Folder 2', isDir:1,fileType:'' },
  { id: 2, name: 'Folder 3', isDir:1,fileType:'' },
  { id: 3, name: 'Folder 4', isDir:1,fileType:'' },
  { id: 4, name: 'pdf', isDir:0,fileType:'pdf' },
  { id: 5, name: 'txt', isDir:0,fileType:'txt' },
  { id: 4, name: 'jpg', isDir:0,fileType:'jpg' },
  { id: 5, name: 'pdf', isDir:0,fileType:'pdf' },
  { id: 4, name: 'png', isDir:0,fileType:'png' },
  { id: 5, name: 'pdf', isDir:0,fileType:'pdf' },
  { id: 5, name: 'zip', isDir:0,fileType:'zip' },
  { id: 5, name: 'MOV', isDir:0,fileType:'MOV' },
  { id: 5, name: 'zip', isDir:0,fileType:'zip' },
])
const userStore = useUserStore();
const pictureType:string[] = ['png','jpg','jpeg']
const compressType:string[] = ['zip','rar','7z']
const videoType:string[] = ['mp4','mov','flv','avi']
let previewDialog = ref<boolean>(false)
const fileRef = ref()
const folderRef = ref()

const isSpecialFileType  = (fileType:string,type:string):boolean => {
  const lowerCaseFileType  = fileType.toLowerCase()
  const fileTypes:Record<string, string[]> = {
    picture: pictureType,
    compress: compressType,
    video: videoType
  };
  return fileTypes[type].includes(lowerCaseFileType );
}

const viewportWidth = ref(window.innerWidth)
const viewportHeight = ref(window.innerHeight)

const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth;
};

console.log(`视口宽度: ${viewportWidth.value}, 视口高度: ${viewportHeight.value}`);


const handlePreview = (item:FileItem) =>{
  if(item.isDir === 1) return
  item.isPreview = true
}

const handleCancelPreview = (item:FileItem) =>{
  if(item.isDir === 1) return
  item.isPreview = false
}

const previewFile = (item:FileItem) =>{
  previewDialog.value = true
}

onMounted(()=>{
  fileList.value.forEach(item => {
    item.isEditing = false
    item.isPreview = false
  })
  window.addEventListener('resize', updateViewportWidth);
})

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
  // ElMessage({
  //   message: '暂未开放',
  //   type: 'warning'
  // })
  // 查询接口，相当于分页
}

const handleRename = (item:any) => {
  if(isEdit.value) return
  isEdit.value = true;
  item.isEditing = true; // 进入编辑模式
  nextTick(() => {
    renameInputRef.value && renameInputRef.value[0].focus();
  })
}

const updateFolderName = (item:any) => {
  console.log(item,'编辑后')
  item.name = '测试文件夹';
  item.isEditing = false;
  setTimeout(()=>{
    isEdit.value = false;
  },10)
}

const onContextMenu = (event:any, config:any) =>{
  console.log(config,'conmfig')
  event.preventDefault();
  if(config.isDir === 0){
    ContextMenu.showContextMenu({
      x: event.x,
      y: event.y,
      theme: 'mac',
      items: [
        {
          label: "分享",
          divided: true,
          icon:'icon-fenxiang',
          onClick: () => {
            // this.openDocument(config.id);
          },
        },
        {
          label: "下载",
          divided: true,
          icon: "icon-xiazai",
          onClick: () => {
            // handleRename(config);
          },
        },
        {
          label: "重命名",
          divided: true,
          icon: "icon-zhongmingming",
          onClick: () => {
            handleRename(config);
          },
        },
        {
          label: "删除",
          icon: "icon-shanchu",
          onClick: () => {
            // this.handlerDelete(config);
          },
        },
      ],
    });
  } else if(userStore.userRole !== 'user') {
    ContextMenu.showContextMenu({
      x: event.x,
      y: event.y,
      theme: 'mac',
      items: [
        {
          label: "打开",
          divided: true,
          icon: 'icon-a-folder-opened',
          onClick: () => {
            // this.openDocument(config.id);
          },
        },
        {
          label: "重命名",
          divided: true,
          icon: "icon-zhongmingming",
          onClick: () => {
            handleRename(config);
          },
        },
        {
          label: "删除",
          icon: "icon-shanchu",
          onClick: () => {
            // this.handlerDelete(config);
          },
        },
      ],
    });
  } else {
    ContextMenu.showContextMenu({
      x: event.x,
      y: event.y,
      theme: 'mac',
      items: [
        {
          label: "打开",
          divided: true,
          icon: 'icon-a-folder-opened',
          onClick: () => {
            // this.openDocument(config.id);
          },
        },
        {
          label: "重命名",
          divided: true,
          icon: "icon-zhongmingming",
          onClick: () => {
            handleRename(config);
          },
        },
      ],
    });
  }
}

const goToFile = (item:FileItem) => {
  if(item.isDir === 0) return
//调查询接口
  ElMessage({
    message: '暂未开放',
    type: 'warning'
  })
};
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
    }

    .objectName {
      width: 100%;
      height: 0;
      display: flex;
      align-items: center;
      justify-content: center;

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