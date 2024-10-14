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
      v-loading="loading"
      border
      height="67vh"
      style="width: 100%;
        margin-top: 20px"
      row-key="id"
      @selection-change="selectChange"
    >
      <el-table-column align="center" type="selection" ></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="100" />
      <el-table-column align="center" prop="fileName" label="文件名称"  />
      <el-table-column align="center" prop="uploadTime" label="修改时间"  />
      <el-table-column align="center" prop="size" label="文件大小"  />
      <el-table-column align="center" label="操作" >
        <template #default="{row}">
          <el-button type="primary"   @click="handleDownload(row)">
            下载
          </el-button>
          <el-popconfirm
            :title="`确认删除${row.fileName}?`"
            width="200px"
            @confirm="handleDelete(row)"
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

    <slot name="footer" />
  </el-card>
</template>

<script setup lang="ts">
import {Upload,Download} from "@element-plus/icons-vue";
import { ref, watch,watchEffect } from 'vue'

const loading = ref(true)

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

watchEffect(() => {
  if (props.menuData.length > 0 || props.menuData.length === 0) {
    loading.value = false;
  }
})

watch(()=>props.downloadList, ()=>{
  downloadList.value = props.downloadList
})

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

const handleDownload = (row:any) => {
  emit('download-file', row)
}

const handleBatchDownload = () => {
  emit('batch-download', props.downloadList)
  console.log( props.downloadList)
}

const handleUpload = () => {
  emit('upload-file', true)
}

const handleDelete =  (file:any) => {
  emit('delete-file', file)
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