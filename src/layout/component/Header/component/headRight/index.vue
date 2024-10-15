<template>
  <el-button :icon="FullScreen" circle @click="handleFullscreen"/>
  <div class="avatar" style="background-color: #1e80ff"></div>
  <el-dropdown style="margin-left: 12px" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ userStore.userName }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import {FullScreen, ArrowDown} from "@element-plus/icons-vue";
import {useUserStore} from "@/stores/user";
import {useRouter,useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const userStore = useUserStore()
let router = useRouter()
let route = useRoute()


const handleFullscreen = () => {
  let full = document.fullscreenElement
  //切换为全屏模式
  if(!full){
    document.documentElement.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
}

const handleCommand = async (command: string | number | object) => {
  if (command === 'logout'){
    await userStore.userLogouts()
    await router.push({
      path: '/login',
      query: {
        redirect: route.path
      }
    })
    ElMessage.success('退出成功')
  }
}

</script>

<script  lang="ts">
export default {
name: "HeadRight"
}
</script>



<style scoped lang="scss">
.avatar{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-left: 12px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>