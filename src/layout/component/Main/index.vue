<template>
  <router-view class="main" style="" v-slot="{ Component }">
    <transition mode="out-in" name="fade">
      <component :is="isAuthPage ? Component : layoutComponent" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import GridComponent from "@/views/file/fileBoard.vue"
import ListComponent from "@/views/section/fileList.vue"
import {useUserStore} from "@/stores/user";
import { computed } from 'vue'
import {useRoute} from 'vue-router'

const userStore = useUserStore();
const route = useRoute()
const layoutComponent = computed(()=>{
  return userStore.layoutStatus ? ListComponent : GridComponent
})

const isAuthPage = computed(()=>{
  return route.path === '/auth/user' || '/auth/group'
})
</script>

<script lang="ts">
export default {
  name:"MainComponent"
}
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: all .3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.main{
  width: 100%;
  height: 100%;
  //background-color: #87ceed;
  border-radius: 10px;

}
</style>
