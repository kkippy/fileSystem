<template>
  <div>
    <header-component
      placeholderTitle="小组名称"
      @onSearch="onSearch"
      @reset="reset"
    >
      <template #searchBtn>
        <el-button type="success" style="margin-left: 20px" :icon="Plus" @click="handleAddGroup">
          <span style="margin-left: 5px;">新增小组</span>
        </el-button>
      </template>
    </header-component>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderComponent from '@/components/SearchHeader/index.vue'
import { Plus } from '@element-plus/icons-vue'

const onSearch =  (s:string) => {
  console.log(s)
}

const reset = () => {
}

const handleAddGroup = () => {
  console.log('handleAddGroup')
}


</script>

<style scoped lang="scss">
.header {
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  box-shadow: 0 0 12px rgba(0,0,0,0.12);

  .el-card__body {
    padding: 0;
  }
}
</style>