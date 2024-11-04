<template>

    <template v-for="item in filterMenuList" :key="item.path" >
<!--      无子路由-->
      <template v-if="!item.children">
        <el-menu-item
            v-if="!item.meta.hidden"
            :index="item.path"
            @click="toView">
          <template #title>
              {{item.meta.title}}
          </template>
        </el-menu-item>
      </template>

<!--有多个子路由，使用递归进行多级菜单的渲染-->
      <el-sub-menu
          :index="item.path"
          v-if="item.children && item.children.length > 1">
        <template #title>
          <span>{{item.meta.title}}</span>
          </template>
        <MenuComponent :menuList="item.children"></MenuComponent>
      </el-sub-menu>

    </template>

</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user"
import { ref,computed,watch } from 'vue'

interface MenuItem {
  path: string;
  meta: {
    title: string;
    hidden?: boolean; // 可选属性
  };
  children?: MenuItem[]; // 子菜单项
}

let router = useRouter();
const userStore = useUserStore()
const props = defineProps(['menuList'])
const menuList = ref<MenuItem[]>(props.menuList)

const filterMenuList = computed(()=>{
   menuList.value.filter((item) => {!/:/.test(item.path)})
  if(userStore.userRole === 'user') {
    return menuList.value.filter((item) => item.path !== '/auth')
  } else {
    return menuList.value
  }
})

watch(()=>props.menuList,()=>{
  menuList.value = props.menuList
})
const toView = (vc:any) => {
  router.push(vc.index)
}
</script>

<script  lang="ts">
export default {
  name: "MenuComponent"
}
</script>



<style scoped lang="scss">

</style>