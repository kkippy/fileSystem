<template>
    <div >
      <div class="header" >
        <el-form>
          <el-form-item label="文件名" style="margin-top: 18px;margin-left: 20px">
            <el-input id="inputFileField" v-model="searchName" @keyup.enter="onSearch" placeholder="请输入文件名" />
          </el-form-item>
        </el-form>

        <div style="margin-right: 40px">
          <el-button type="primary" :icon="Search" @click="onSearch" :disabled="!searchName">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>

      <div class="fileContent" style="">
        <ul  v-infinite-scroll="scrollLoad" class="folderList" :infinite-scroll-disabled="disabled">
          <li @dblclick="goToFile(item.name)" class="folder" v-for="item in fileList" :key="item.id"  @contextmenu.prevent="onContextMenu($event, item)">
            <SvgIcon :width="item.isDir ? 130 : 110"
                     :height="150"
                     :name="item.isDir ? 'folder1' : 'document1' " />
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
    </div>
</template>


<script setup lang="ts">
import { useRouter, useRoute, } from 'vue-router'
import { ref, onMounted, nextTick, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ContextMenu from '@imengyu/vue3-context-menu'
import type {Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface FileItem {
  id: number;
  name: string;
  isDir: number;
  isEditing?: boolean;
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
  { id: 1, name: 'Folder 1', isDir:1 },
  { id: 2, name: 'Folder 2', isDir:1 },
  { id: 3, name: 'Folder 3', isDir:1 },
  { id: 2, name: 'Folder 2', isDir:1 },
  { id: 3, name: 'Folder 3', isDir:1 },
  { id: 2, name: 'Folder 2', isDir:1 },
  { id: 3, name: 'Folder 3', isDir:1 },
  { id: 2, name: 'Folder 2', isDir:1 },
  { id: 3, name: 'Folder 3', isDir:1 },
  { id: 2, name: 'Folder 2', isDir:1 },
  { id: 3, name: 'Folder 3', isDir:1 },
  { id: 4, name: 'Folder 4', isDir:0 },
  { id: 5, name: 'Folder 5', isDir:0 },
  { id: 4, name: 'Folder 4', isDir:0 },
  { id: 5, name: 'Folder 5', isDir:0 },
  { id: 4, name: 'Folder 4', isDir:0 },
  { id: 5, name: 'Folder 5', isDir:0 },
])
const userStore = useUserStore();

onMounted(()=>{
  fileList.value.forEach(item => {
    item.isEditing = false
  })
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
  loading.value = true
  setTimeout(() => {
    fileList.value.push({ id: 6, name: 'Folder 6', isEditing: false,isDir:1 })
    loading.value = false
  }, 2000)
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

const goToFile = (folderName:string) => {
  router.push({
    path:`${route.path}/${folderName}`,
    params:{
      folderName
    }
  });
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

  .el-card__body {
    padding: 0;
    }
}

.fileContent {
    margin-top: 20px;
    border-radius: 10px;
    height: 50vh;
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
  flex-wrap: wrap;
  gap: 1rem;
  flex-flow: row wrap;
  align-content: space-around;


  .folder {
    display: flex;
    flex-direction: column;
    flex:  0 0 10%;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    position: relative;
    //background-color: red;

    .folderImg {
      cursor: pointer;
      position: absolute;
      object-fit: cover;
      width: 90%;
      height: 90%;
      top: -10px;
      left: 8px;
    }

    .objectName {
      //position: absolute;
      //bottom: -5px;
      //left: 0;
      //background-color: red;
      width: 100%;
      height: 30px;
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