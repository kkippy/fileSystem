<template>
  <el-breadcrumb style="margin-left: 10px" :separator-icon="ArrowRight">
  <el-breadcrumb-item>{{ constantRoute[1].meta.title }}</el-breadcrumb-item>
  <el-breadcrumb-item class="breadcrumb" @click="goRoot" >{{route.meta.title}}</el-breadcrumb-item >
  <el-breadcrumb-item class="breadcrumb" @click="goBack(item)" v-for="(item,index) in filePathList" :key="index">
    {{item}}
  </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">

import {ArrowRight} from "@element-plus/icons-vue";
import {useRoute} from "vue-router";
import {useUserStore} from "@/stores/user";
import { constantRoute } from '@/router/routers'
import { ref, watch } from 'vue'
import { GET_PATH, SET_PATH } from '@/utils/path'
const route = useRoute()
const userStore = useUserStore()
let filePathList = ref<string[]>([])
filePathList.value = userStore.path.split("/").filter(item => item !== "");

watch(()=>userStore.path,(newVal)=>{
  filePathList.value = userStore.path.split("/").filter(item => item !== "");
})

const goBack = (item:string)=>{
  if (item === filePathList.value[filePathList.value.length - 1]) return;
  const lastSlashIndex = (GET_PATH()as string).indexOf(item);
  userStore.path =(GET_PATH() as string).slice(0, lastSlashIndex + item.length ) + '/';
  SET_PATH(userStore.path)
  console.log(GET_PATH,'GET_PATH')
}
const goRoot = ()=>{
  userStore.path = '/'
  SET_PATH(userStore.path)
}


</script>
<script  lang="ts">
export default {
  name: "HeadLeft"
}
</script>


<style scoped lang="scss">
.breadcrumb {
  &:hover{
    cursor: pointer;
  }
}

</style>