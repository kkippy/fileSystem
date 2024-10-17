<template>
    <div >
      <ul class="folderList">
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
    </div>
</template>


<script setup lang="ts">
import { useRouter, useRoute, } from 'vue-router'
import { ref, onMounted, nextTick } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ContextMenu from '@imengyu/vue3-context-menu'
import type {Router } from 'vue-router'



const router:Router = useRouter() ;
const route = useRoute();
const renameInputRef = ref()
const isEdit = ref(false);
const fileList = ref([
  { id: 1, name: 'Folder 1', isEditing: true,isDir:1 },
  { id: 2, name: 'Folder 2', isEditing: false,isDir:1 },
  { id: 3, name: 'Folder 3', isEditing: false,isDir:1 },
  { id: 4, name: 'Folder 4', isEditing: false,isDir:0 },
  { id: 5, name: 'Folder 5', isEditing: false,isDir:0 },
  { id: 3, name: 'Folder 3', isEditing: false,isDir:1 },
  { id: 4, name: 'Folder 4', isEditing: false,isDir:0 },
  { id: 5, name: 'Folder 5', isEditing: false,isDir:0 },
  { id: 3, name: 'Folder 3', isEditing: false,isDir:1 },
  { id: 4, name: 'Folder 4', isEditing: false,isDir:0 },
  { id: 5, name: 'Folder 5', isEditing: false,isDir:0 },
])

onMounted(()=>{
})

const toggleOpen = (item:any) => {
  console.log(item,'item')
  item.isOpen = !item.isOpen;
}
const handleRename = (item:any) => {
  if(isEdit.value) return
  isEdit.value = true;
  item.isEditing = true; // 进入编辑模式
  console.log(renameInputRef,'renameInputRef')
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
          icon:'icon-a-folder-opened',
          onClick: () => {
            // this.openDocument(config.id);
          },
        },
        {
          label: "下载",
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
        {
          label: "删除",
          icon: "icon-shanchu",
          onClick: () => {
            // this.handlerDelete(config);
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
      background-color: red;
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
</style>