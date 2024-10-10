<template>
<!--  <el-button :icon="Refresh" circle @click="handleRefresh"/>-->
  <el-button :icon="FullScreen" circle @click="handleFullscreen"/>
  <el-popover
      placement="bottom"
      title="主题设置"
      :width="230"
      trigger="hover"
  >
    <el-form>
      <el-form-item label="主题颜色">
          <el-color-picker @change="setColor" :teleported="false" :predefine="['#409EFF','#fff','#000']" v-model="color" show-alpha/>
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch v-model="dark" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" @change="handleChangeModel"  />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button :icon="Setting" circle />
    </template>
  </el-popover>
  <div class="avatar" style="background-color: #6b57fe"></div>
<!--  <img :src="userStore.avatar" class="avatar" alt="">-->
  <el-dropdown style="margin-left: 12px" @command="handleCommand">
      <span class="el-dropdown-link">
        admin
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
import {FullScreen, Refresh, Setting, ArrowDown, Sunny, Moon} from "@element-plus/icons-vue";
// import {useSettingStore} from "@/store/modules/setting.ts"
// import {useUserStore} from "@/store/modules/user.ts";
import {useRouter,useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {ref} from "vue";

// const userStore = useUserStore()
// const settingStore = useSettingStore()
let router = useRouter()
let route = useRoute()
let dark = ref<boolean>(false)
const color = ref<string>('#409EFF')


// const handleRefresh = () => {
//   settingStore.refresh =  !settingStore.refresh
// }

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
    // await userStore.userLogout()
    await router.push({
      path: '/login',
      query: {
        redirect: route.path
      }
    })
    ElMessage.success('退出成功')
  }
}

const handleChangeModel = () => {
  //获取根节点
  let root = document.documentElement
  if(dark.value){
    root.className = 'dark'
  }else{
    root.className = ''
  }
}

const setColor = () => {
  let root = document.documentElement
  root.style.setProperty('--el-color-primary', color.value)
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