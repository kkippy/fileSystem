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
import MainComponent from "./component/Main/index.vue"
import HeaderComponent from "./component/Header/index.vue"
import {constantRoute,anyRoute} from "@/router/routers.ts";
const menuRoutes = [...constantRoute,anyRoute]

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