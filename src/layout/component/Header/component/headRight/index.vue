<template>
  <span>{{userStore.userName}}</span>
  <el-tooltip
    effect="dark"
    content="请在科室文件页面下使用该引导提示"
    placement="bottom"
  >
  <SvgIcon class="help"  :width="35" :height="35" name="help" @click="getHelp"/>
  </el-tooltip>

    <SvgIcon class="fullScreen"
             :disabled="useHelp"
             :width="isFullScreen ? 40 : 35"
             :height="isFullScreen ? 39 : 23"
             :name="isFullScreen ? 'normalScreen' : 'fullScreen' "
             @click="handleFullscreen" />
  <el-dropdown trigger="click" style="margin-left: 12px" @command="handleCommand">
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
import { computed, ref } from 'vue'
import userImg from "@/assets/images/user.png"

const userStore = useUserStore()
let router = useRouter()
let route = useRoute()
let isFullScreen = ref<boolean>(false)

const useHelp = computed(() =>{
  const partPath = ['/section1','/section2','/basic','/manage','/support']
  return partPath.includes(route.path);
})

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
  margin-left: 10px;
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
