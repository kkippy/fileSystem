<template>
  <div class="logo_container" >
    <span class="logo-text" >文件管理系统</span>
  </div>
</template>

<script setup lang="ts">
</script>

<script lang="ts">
export default {
  name:"LogoComponent"
}
</script>

<style scoped lang="scss">
.logo_container{
  display: flex;

    .logo-text{
      font-weight: $base-logo-text-fontWeight;
      font-size: $base-logo-text-fontSize;
      margin: auto;
      width: 100%;
      color:#fdfbfb;
      letter-spacing: 3px;
    }
}
</style>