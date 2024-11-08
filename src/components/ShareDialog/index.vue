<template>
  <el-dialog v-model="visible" title="分享文件" width="600">
    <el-input
      v-model="shareLink"
      placeholder="Please input"
    >
      <template #append>
        <el-button style="width: 100px;
                            background-color: #67c23a;
                            border-radius:0 4px 4px 0 ;
                            color: #fff;font-size: 15px;
                            letter-spacing: 2px;
                            text-align: center"
                   @click="copyLink"
        >复制链接</el-button>
      </template>
    </el-input>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    modelValue:{
      type:Boolean,
      default:false
    },
    shareLink:{
      type:String,
      default:''
    }
})

const visible = ref(props.modelValue)
const shareLink = ref(props.shareLink)

watch(
  () => [props.modelValue, props.shareLink],
  () => {
      visible.value = props.modelValue;
      shareLink.value = props.shareLink;
  }
);

const copyLink = async ()=>{
  try {
    if(!shareLink.value){
      return ElMessage({
        message: '链接为空',
        type: 'warning'
      })
    }
    await navigator.clipboard.writeText(shareLink.value);
    ElMessage({
      message: '复制成功',
      type: 'success'
    })
  } catch (err) {
    console.error('复制链接失败:', err);
    ElMessage({
      message: '复制链接失败',
      type: 'error'
    });
  } finally {
    visible.value = false
  }
}

</script>

<script lang="ts">
export default {
  name: "ShareDialog"
}
</script>

<style scoped lang="scss">

</style>
