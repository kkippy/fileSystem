<template>
  <li v-for="(item) in dataItemOptions1"  :key="item.key">
    <div class="icon">
      <img :src="item.icon" alt="">
    </div>
    <div class="left">
      <p>{{ item.title }}</p>
      <p>{{ item.count }}</p>
    </div>
    <div class="right">
      <div class="chart">
        <VueDataUi
          component="VueUiSparkline"
          :dataset="dataset"
          :config="config"
        />
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { VueDataUi, } from "vue-data-ui";
import "vue-data-ui/style.css";
defineOptions({
  name: "dataItem"
})
defineProps({
  option:{
    type: Array,
    required: true
  },
  dataset: {
    type: Object,
    required: true
  },
  config: {
    type: Object,
    required: true
  }
})

</script>

<style scoped lang="scss">

</style>
