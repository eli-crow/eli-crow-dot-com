<script setup>
import { defineProps, ref } from "vue";
import Lightbox from './Lightbox.vue';

const selectedImageKey = ref(null);

const props = defineProps({
  title: {
    type: String,
  },
  images: {
    type: Array,
    required: true,
  }
});

function open(key) {
  selectedImageKey.value = key;
}
</script>

<template>
  <div class="LightboxPreview" @click="handlePreviewClicked">
    <slot :images="props.images" :open="open" />
    <Lightbox v-model:selected-image-key="selectedImageKey" :images="props.images" :title="props.title" />
  </div>
</template>

<style>
.LightboxPreview {
  display: flex;
  flex-direction: column;
}
</style>