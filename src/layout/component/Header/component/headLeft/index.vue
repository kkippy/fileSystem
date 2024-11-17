<template>
  <el-breadcrumb style="margin-left: 10px" :separator-icon="ArrowRight">
  <el-breadcrumb-item v-if="route.path !== '/home'" @click="goHome">{{ constantRoute[1].meta.title }}</el-breadcrumb-item>
  <el-breadcrumb-item class="breadcrumb" @click="goRoot" >{{route.meta.title}}</el-breadcrumb-item >
  <el-breadcrumb-item class="breadcrumb" @click="goBack(item)" v-for="(item,index) in filePathList" :key="index">
    {{item}}
  </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">

import {ArrowRight} from "@element-plus/icons-vue";
import {useRoute,useRouter} from "vue-router";
import {useUserStore} from "@/stores/user";
import { constantRoute } from '@/router/routers'
import { ref, watch,computed } from 'vue'
import { GET_PATH, SET_PATH } from '@/utils/path'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
let filePathList = ref<string[]>([])
filePathList.value = userStore.path.split("/").filter(item => item !== "");

watch(()=>userStore.path,(newVal)=>{
  filePathList.value = userStore.path.split("/").filter(item => item !== "");
})

const isClick = computed(()=>{
  return route.fullPath.includes('/link') || route.fullPath.includes('/auth') || route.fullPath.includes('/home')
})

const goBack = (item:string)=>{
  if (item === filePathList.value[filePathList.value.length - 1]) return;
  const lastSlashIndex = (GET_PATH()as string).indexOf(item);
  userStore.path =(GET_PATH() as string).slice(0, lastSlashIndex + item.length ) + '/';
  SET_PATH(userStore.path)
}
const goRoot = ()=>{
  if(isClick.value) return
  userStore.path = '/'
  SET_PATH(userStore.path)
}

const goHome = ()=>{
  router.push({path: '/'})
}


</script>
<script  lang="ts">
export default {
  name: "HeadLeft"
}
</script>


<style scoped lang="scss">
@media (prefers-color-scheme: dark) {
  body {
    color: white; /* 深色模式下的字体颜色 */
  }
}
.breadcrumb {
  &:hover{
    cursor: pointer;
  }
}

</style>
