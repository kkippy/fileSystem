<template>
    <el-container class="layout_container">
      <el-aside style="background-color: #1e80ff;"  width="200px">
        <div class="logo">
          <LogoComponent/>
        </div>
        <el-scrollbar class="scrollbar">

          <el-menu
            text-color="#fdfbfb"
              class="el-menu-vertical-demo"
              :default-active="route.path"
              background-color="#1e80ff"
          >
            <MenuComponent :menuList="menuRoutes" />
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header style="padding: 0;z-index: 2">
          <HeaderComponent />
        </el-header>
        <el-main class="elMain">
          <MainComponent/>
        </el-main>
      </el-container>
    </el-container>
</template>

<script setup lang="ts">
import LogoComponent from "@/layout/component/Logo/index.vue"
import MenuComponent from "@/layout/component/Menu/index.vue"
//右侧主体展示区域
import MainComponent from "./component/Main/index.vue"
//header组件
import HeaderComponent from "./component/Header/index.vue"
// 获取路由信息以生成菜单
// import {useUserStore} from "@/store/modules/user.ts"
// import {useSettingStore} from "@/store/modules/setting.ts"
import {useRoute} from "vue-router";
import {constantRoute,anyRoute} from "@/router/routers.ts";


const menuRoutes = [...constantRoute,anyRoute]
// const defaultActive = '/section1,section2,/support,/basic,/manage'
const defaultActive = '/'

// const settingStore = useSettingStore()
// const userStore = useUserStore();
let route = useRoute();

</script>


<script lang="ts">
export default {
  name:"LayoutComponent"
}
</script>

<style scoped lang="scss">
  .layout_container{
    height: 100vh;
    width: 100%;
    .logo{
      width: 100%;
      height: $base-logo-height;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1e80ff;
    }
    .scrollbar{
      height: calc(100vh - $base-logo-height);
      .el-menu{
        border-right: none;
        --el-menu-active-color:#f4e2a9
      }
    }
    .el-aside {
      transition: all .5s;
      &.fold{
        width: $base-menu-min-width;
      }
    }
    .elMain {
      padding: 20px 10px;
    }
  }
</style>