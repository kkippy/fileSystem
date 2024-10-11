<template>
  <el-card>
    <el-button type="primary"
               :disabled="!downloadList.length"
               style="margin-right: 10px"
               :icon="Download"
               @click="handleBatchDownload">
      <span style="margin-left: 5px;">批量下载</span>
    </el-button>

    <el-button
      type="success"
      :icon="Upload"
      @click="handleUpload" >
      <span style="margin-left: 5px;">上传文件</span>
    </el-button>

    <el-table
      :data="menuData"
      border
      height="72vh"
      style="width: 100%;
        margin-top: 20px"
      row-key="id"
      @selection-change="selectChange"
    >
      <el-table-column align="center" type="selection" ></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="100" />
      <el-table-column align="center" prop="name" label="文件名称"  />
      <el-table-column align="center" prop="uploadTime" label="上传时间"  />
      <el-table-column align="center" label="操作"  >
        <template #default="{row}">
          <el-button type="primary"   @click="handleDownload(row)">
            下载
          </el-button>
          <el-popconfirm
            :title="`确认删除${row.name}?`"
            width="200px"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button type="danger" >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>

      </el-table-column>

    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import {Upload,Download} from "@element-plus/icons-vue";
import { ref, watch } from 'vue'

const props = defineProps({
  menuData: {
    type: Array,
    default: () => []
  },
  downloadList: {
    type: Array,
    default: () => []
  },
});

const emit = defineEmits([
  'selection-change',
  'download-file',
  'batch-download',
  'upload-file',
  'delete-file',
  'size-change',
  'page-change'
])

const downloadList = ref(props.downloadList)

watch(()=>props.downloadList, ()=>{
  downloadList.value = props.downloadList
})


const handleDownload = (row:any) => {
  emit('download-file', row)
  console.log(row)
}

const handleBatchDownload = () => {
  emit('batch-download', props.downloadList)
  console.log( props.downloadList)
}

const handleUpload = () => {
  emit('upload-file')
}

const handleDelete =  (id:number) => {
  emit('delete-file', id)
}

const selectChange = (value:any) => {
  emit('selection-change', value)
  downloadList.value = value
}


</script>

<script lang="ts">
import {defineComponent} from "vue";
export default defineComponent({
  name: "FileTable",
})
</script>

<style scoped lang="scss">

</style>