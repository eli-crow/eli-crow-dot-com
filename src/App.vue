<script setup>
import TheSVGFilters from './components/TheSVGFilters.vue';
import Transition from './components/Transition.vue';
</script>

<template>
  <TheSVGFilters />

  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>