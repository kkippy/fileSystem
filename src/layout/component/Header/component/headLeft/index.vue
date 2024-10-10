<template>
  <el-breadcrumb style="margin-left: 10px" :separator-icon="ArrowRight">
    <el-breadcrumb-item
        v-for="(item,index) in route.matched"
        :key="index"
        v-show="item.meta.title"
        :to="item.path"
    >
        <SvgIcon style="margin-right: 5px" :width="20" :height="20" :name="item.meta.icon"/>
        <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>

  </el-breadcrumb>
</template>

<script setup lang="ts">

import {ArrowRight} from "@element-plus/icons-vue";
import {useRoute} from "vue-router";
let route = useRoute()
console.log(route.matched,'route.matched')


</script>
<script  lang="ts">
export default {
  name: "HeadLeft"
}
</script>


<style scoped lang="scss">


</style>