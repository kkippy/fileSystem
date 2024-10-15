<template>
  <router-view class="main" style="" v-slot="{ Component }">
    <transition mode="out-in" name="fade">
      <component :is="Component"  />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
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
  background-color: #fff;
  border-radius: 10px;

}
</style>