<template>
  <div class="header">
    <div class="header-left">
      <HeadLeft />
    </div>
    <div class="header-right">
      <HeadRight />
    </div>

  </div>
</template>

<script setup lang="ts">
import HeadLeft from "./component/headLeft/index.vue"
import HeadRight from "./component/headRight/index.vue"

</script>




<style scoped lang="scss">
.header {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all .5s;

  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

  .header-left,.header-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-icon {
      cursor: pointer;
    }
  }

}
</style>