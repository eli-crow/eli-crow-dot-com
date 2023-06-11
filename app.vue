<script setup lang="ts">
import TheSVGFilters from './components/TheSVGFilters.vue';
import "./global.css";
</script>

<template>
  <div id="overlay" class="pointer-events-none"></div>

  <TheSVGFilters />

  <div class="flex flex-col items-center min-h-full">
    <NuxtPage />
  </div>
</template>