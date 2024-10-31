<template>
  <div>
    <el-table :data="data" height="40vh">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="姓名" prop="username" v-if="isUserTable" />
      <el-table-column align="center" label="用户名" prop="account" v-if="isUserTable" />
      <el-table-column align="center" label="链接名" prop="linkName" v-if="!isUserTable" />
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :size="size"
      :page-sizes="[20, 50, 100]"
      :background="true"
      layout="prev,pager,next,jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <template #footer>
      <div style="flex: auto">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="$emit('commit')">提交</el-button>
      </div>
    </template>
  </div>

</template>

<script setup lang="ts">

</script>



<style scoped lang="scss">

</style>
