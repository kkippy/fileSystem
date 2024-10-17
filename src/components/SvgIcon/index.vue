<template>
  <svg :style="iconStyle" aria-hidden="true" style="scale: none">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from "vue";

interface SvgProps {
  name: string; // 图标的名称 ==> 必传
  prefix?: string; // 图标的前缀 ==> 非必传（默认为"icon"）
  width?: number;
  height?: number;
}

//设置默认值
const props = withDefaults(defineProps<SvgProps>(),{
  prefix:"icon",
  width:15,
  height:15
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
// const iconStyle = computed(() => { `width:${props.width}; height:${props.height}`})
const iconStyle = computed(() => {
  return {
    width: props.width + 'px',
    height: props.height + 'px'
  }
})

</script>

<style ></style>