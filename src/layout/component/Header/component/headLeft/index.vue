<template>
  <el-breadcrumb style="margin-left: 10px" :separator-icon="ArrowRight">
    <el-breadcrumb-item>{{ constantRoute[1].meta.title }}</el-breadcrumb-item>
    <el-breadcrumb-item >{{route.meta.title}}</el-breadcrumb-item >
<!--    <el-breadcrumb-item-->
<!--        v-for="(item,index) in route.matched"-->
<!--        :key="index"-->
<!--        v-show="item.meta.title"-->
<!--        :to="item.path"-->
<!--    >-->
<!--    </el-breadcrumb-item >-->

<el-breadcrumb-item v-for="(item,index) in filePathList" :key="index">
  {{item}}
</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">

import {ArrowRight} from "@element-plus/icons-vue";
import {useRoute} from "vue-router";
import { computed } from 'vue'
import { constantRoute } from '@/router/routers'
let route = useRoute()
const filePathList = '/folder1/test/'.split("/").filter(item => item !== "");

</script>
<script  lang="ts">
export default {
  name: "HeadLeft"
}
</script>


<style scoped lang="scss">


</style>