<template>
  <el-breadcrumb style="margin-left: 10px" :separator-icon="ArrowRight">
    <el-breadcrumb-item>{{ constantRoute[1].meta.title }}</el-breadcrumb-item>
    <el-breadcrumb-item @click="goRoot" >{{route.meta.title}}</el-breadcrumb-item >
<!--    <el-breadcrumb-item-->
<!--        v-for="(item,index) in route.matched"-->
<!--        :key="index"-->
<!--        v-show="item.meta.title"-->
<!--        :to="item.path"-->
<!--    >-->
<!--    </el-breadcrumb-item >-->

  <el-breadcrumb-item @click="goBack(item)" v-for="(item,index) in filePathList" :key="index">
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
const route = useRoute()
const userStore = useUserStore()
let filePathList = ref<string[]>()
filePathList.value = userStore.path.split("/").filter(item => item !== "");

watch(()=>userStore.path,(newVal)=>{
  console.log(newVal,'newVal')
  filePathList.value = userStore.path.split("/").filter(item => item !== "");
})

const goBack = (item:string)=>{
  console.log(item,'item')
  userStore.path = '/' + item +'/'
  console.log(item,'goBack')
}
const goRoot = ()=>{
  userStore.path = '/'
}


</script>
<script  lang="ts">
export default {
  name: "HeadLeft"
}
</script>


<style scoped lang="scss">


</style>