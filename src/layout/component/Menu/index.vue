<template>

    <template v-for="item in menuList" :key="item.path" >
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

<!--      &lt;!&ndash;只有一个子路由&ndash;&gt;-->
<!--      <el-menu-item-->
<!--        v-if="item.children && item.children.length === 1"-->
<!--        :index="item.children[0].path"-->
<!--        @click="toView">-->
<!--        <SvgIcon-->
<!--          :width="30"-->
<!--          :height="20"-->
<!--          :name="item.children[0].meta.icon"/>-->
<!--        <template #title>-->
<!--          {{item.children[0].meta.title}}-->
<!--        </template>-->
<!--      </el-menu-item>-->

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
let router = useRouter();
const props = defineProps(['menuList'])
console.log(props.menuList.path,'menuList.path')
const toView = (vc) => {
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