<template>
  <nav>
    <ul>
      <li v-for="(item, index) in breadcrumbs" :key="index">
        <router-link :to="item.path">{{ item.name }}</router-link>
        <span v-if="index < breadcrumbs.length - 1"> / </span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const breadcrumbMeta = route.meta.breadcrumb || [];
  return breadcrumbMeta.map(item => ({
    ...item,
    path: item.path.replace(':sectionId', route.params.sectionId).replace(':folderId', route.params.folderId),
  }));
});
</script>

<style scoped>
nav {
  margin-bottom: 1em;
}
</style>