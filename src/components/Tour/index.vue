<template>
  <div>
    <el-tour v-model="userStore.help">
      <el-tour-step
        :target="'.header-left'"
        title="文件路径操作" >
        <div>
          点击不同路径单元以显示对应路径下的文件<br/>
          每个科室的根目录就是科室的名称，部门名称固定不变
        </div>
      </el-tour-step>
      <el-tour-step
        :target="'.folderTour'"
        title="文件夹操作" >
        <div>
          右键文件夹可进行打开、重命名和删除文件夹的操作<br/>
          双击文件夹可查看其中文件
        </div>
      </el-tour-step>
      <el-tour-step :target="'.fileTour'" title="文件操作">
        <div>
          右键文件可进行下载、分享、重命名等操作<br/>
          单击文件可进行预览
        </div>
      </el-tour-step>
    </el-tour>
  </div>

</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
const userStore = useUserStore();

</script>

<script lang="ts">
export default {
  name: "CustomTour"
}
</script>

<style scoped lang="scss">

</style>