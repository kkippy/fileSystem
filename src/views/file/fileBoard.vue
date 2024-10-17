<template>

    <div style="display: flex;align-items: center">
      <ul class="folderList">
        <li class="folder" v-for="item in fileList" :key="item.id">
<!--          <img @click="toggleOpen(item)" :src="item.isDir ?  '../../assets/images/folder.png' : '../../assets/images/document.png' "-->
<!--           class="folderImg" alt="">-->
          <SvgIcon @click="toggleOpen(item)" :width="item.isDir ? 150 : 110" :height="150" :name="item.isDir ? 'folder' : 'document' " />
          <div  ondblclick="enableEdit(item)" class="edit">
            <span v-if="!item.isEditing" class="folderName">{{ item.name }}</span>
            <el-input
              v-else
              v-model="item.name"
              style="width: 144px"
              autofocus
              @blur="saveEdit(item)"
            ></el-input>
          </div>
        </li>
<!--        <li class="folder" v-for="(item,index) in fileList" :key="index" >-->
<!--          <img onclick="this.classList.toggle('open')"-->
<!--               @click="goToFile(folderName)"-->
<!--               src="@/assets/images/folder.png"-->
<!--               class="folderImg"-->
<!--               alt=""-->
<!--          >-->
<!--          &lt;!&ndash;          <SvgIcon :width="150" :height="150" name="folder" />&ndash;&gt;-->
<!--          <div class="edit" @dblclick="enableEdit">-->
<!--            <span v-if="!isEdit" class="folderName">{{ item.name }}</span>-->
<!--            <el-input-->
<!--              v-else-->
<!--              style="width: 144px"-->
<!--              autofocus-->
<!--            ></el-input>-->
<!--          </div>-->
<!--        </li>-->
      </ul>
    </div>
</template>

<!--整体代码如下-->


<script setup lang="ts">
import { useRouter,useRoute } from 'vue-router'
import { ref,onMounted } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const fileList = [
  { id: 1, name: 'Folder 1', isEditing: false,isDir:1 },
  { id: 2, name: 'Folder 2', isEditing: false,isDir:1 },
  { id: 3, name: 'Folder 3', isEditing: false,isDir:1 },
  { id: 4, name: 'Folder 4', isEditing: false,isDir:0 },
  { id: 5, name: 'Folder 5', isEditing: false,isDir:0 },

  // 其他文件夹...
]

let documentImg = '../../assets/images/document.png'

const fileLists = [
  {
    name: '1',
    index: 1,
    path: '/basic/1'
  },
  {
    name: '2',
    index: 2,
    path: '/basic/2'
  },
  {
    name: '3',
    index: 3,
    path: '/basic/3'
  },
  {
    name: '4',
    index: 4,
    path: '/basic/4'
  },
  {
    name: '5',
    index: 5,
    path: '/basic/5'
  },
  {
    name: '6',
    index: 6,
    path: '/basic/6'
  },
  {
    name: '7',
    index: 7,
    path: '/basic/7'
  },
  {
    name: '8',
    index: 8,
    path: '/basic/8'
  },
  {
    name: '9',
    index: 9,
    path: '/basic/9'
  },
  {
    name: '10',
    index: 10,
    path: '/basic/10'
  },
  {
    name: '11',
    index: 11,
    path: '/basic/11'
  },
  {
    name: '12',
    index: 12,
    path: '/basic/12'
  }
]

onMounted(()=>{
  console.log(route,'s')
})

const toggleOpen = (item:any) => {
  console.log(item,'item')
  item.isOpen = !item.isOpen;
}

const enableEdit = (item:any) => {
  item.isEditing = true; // 进入编辑模式
}

const saveEdit = (item:any) => {
  item.isEditing = false; // 退出编辑模式
  // 这里可以添加保存逻辑，比如发送请求到服务器
}

const goToFile = (folderName:string) => {
  router.push({
    path:'/basic',
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
    flex: 1;
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

    .edit {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>