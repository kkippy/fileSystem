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
              :unique-opened="true"
          >
            <MenuComponent :menuList="menuRoutes" />
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header style="padding: 0;z-index: 2">
          <HeaderComponent @changeLayout="changeLayout" />
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
import {constantRoute,anyRoute} from "@/router/routers";
import {useRoute} from "vue-router";
import { onBeforeUnmount, onMounted, ref } from 'vue'
const menuRoutes = [...constantRoute,anyRoute]
let route = useRoute();
const defaultComponent = ref<string>('GridComponent')
const changeLayout = (isGridLayout:boolean)=>{
  defaultComponent.value = isGridLayout ? 'GridComponent' : 'ListComponent'
}
onMounted(()=>{
  window.addEventListener('resize', updateDimensions);
})
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);

const updateDimensions = () => {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
  console.log(width.value,height.value)
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDimensions);
});

</script>


<script lang="ts">
export default {
  name:"LayoutComponent"
}
</script>

<style scoped lang="scss">
//@media screen and min-width() {
//
//}
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
