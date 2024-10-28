<template>
  <div class="header" >
    <slot name="searchBtn"></slot>

    <el-form>
      <el-form-item style="margin-top: 18px;margin-left: 10px">
        <el-input id="inputGroupField" v-model="model" @keyup.enter="onSearch" :placeholder="searchTitle" />
      </el-form-item>
    </el-form>

    <div style="margin-left: 10px">
      <el-button type="primary" :icon="Search" @click="onSearch" :disabled="!model">搜索</el-button>
      <el-button @click="reset" :icon="Refresh" >重置</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Refresh, Search } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
const props = defineProps({
  placeholderTitle:{
    type:String,
    default:'名称',
    required:true
  },
})

const emit = defineEmits(['onSearch','handleAddGroup','reset'])
const model = ref<string>('')

const searchTitle = ref<string>(props.placeholderTitle)
const groupField = document.getElementById('inputGroupField');
groupField?.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    onSearch()
  }
});

watch(()=>props.placeholderTitle,(newVal)=>{
  try{
    searchTitle.value = newVal
  } catch (e){
    console.log(e)
  }
},{
  immediate:true,
  deep:true
})


const onSearch = () => {
  emit('onSearch',model.value)
  model.value = ''
}
const reset = () => {
  model.value = ''
  emit('reset')
}

</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SearchHeaderComponent'
})
</script>


<style scoped lang="scss">
.header {
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  box-shadow: 0 0 12px rgba(0,0,0,0.12);

  .el-card__body {
    padding: 0;
  }
}
</style>