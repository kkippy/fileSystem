<template>
  <SvgIcon class="help"  :width="35" :height="35" name="help" @click="getHelp"/>
  <SvgIcon class="changeLayout" :width="45" :height="35" name="layout" @click="handleChangeLayout"/>
  <SvgIcon class="fullScreen"
           :width="isFullScreen ? 40 : 35"
           :height="isFullScreen ? 39 : 23"
           :name="isFullScreen ? 'normalScreen' : 'fullScreen' "
           @click="handleFullscreen" />
  <el-dropdown trigger="click" style="margin-left: 12px" @command="handleCommand">
<!--      <span class="el-dropdown-link">-->
<!--        {{ userStore.userName }}-->
<!--        <el-icon class="el-icon&#45;&#45;right">-->
<!--          <arrow-down />-->
<!--        </el-icon>-->
<!--      </span>-->
    <div class="avatar" >
      <img :src=userImg alt="" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {useRouter,useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import { ref } from 'vue'
import userImg from "@/assets/images/user.png"

const userStore = useUserStore()
let router = useRouter()
let route = useRoute()
let isFullScreen = ref<boolean>(false)

const handleFullscreen = () => {
  let full = document.fullscreenElement
  //切换为全屏模式
  if(!full){
    isFullScreen.value = true
    document.documentElement.requestFullscreen()
  }else{
    document.exitFullscreen()
    isFullScreen.value = false
  }
}

const getHelp = ()=>{
  userStore.help = true
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

const handleChangeLayout = () => {
ElMessage.success('切换成功')
  userStore.layoutStatus = !userStore.layoutStatus
}

</script>

<script  lang="ts">
export default {
name: "HeadRight"
}
</script>



<style scoped lang="scss">
.changeLayout,.fullScreen {
  &:hover {
    cursor: pointer;
  }
}

.help{
  &:hover{
    cursor: pointer;
  }
}

.avatar{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 5px;

  &:hover{
    cursor: pointer;
  }

  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>