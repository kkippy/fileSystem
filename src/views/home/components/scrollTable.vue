<template>
  <el-table
    :data="list"
    style="width: 100%;overflow: hidden;"
    :cell-style="{padding:0 + 'px'}"
    :row-style="{color:'#333',height: 35 + 'px',width:100 +'%'}"
    :show-header="false"
  >
    <el-table-column prop="department" label="科室"  align="center" />
    <el-table-column prop="fileCount" label="文件数量" min-width="150" align="center" />
    <el-table-column prop="linkCount" label="链接数量" min-width="105"  align="center" />
    <el-table-column prop="usedCapacity" label="使用容量" min-width="105"  align="center" />
  </el-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'scrollTable'
})

 defineProps({
  list:{
    type:Array,
    default:()=>[]
  }
})

</script>

<style scoped lang="scss">

</style>