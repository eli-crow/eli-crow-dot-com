<script setup>
import { ref } from "vue";
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

function handlePreviewClicked() {
  open(props.images[0].key)
}
</script>

<template>
  <div class="flex flex-col relative group" @click="handlePreviewClicked">
    <slot name="preview" :images="props.images" :open="open">
      <img
        class="rounded-sm shadow-xl relative z-10 transition duration-1000 transform group-hover:scale-[1.05]"
        draggable="false"
        :key="props.images[0].key"
        :src="props.images[0].thumbnailSrc"
        :alt="props.images[0].alt"
      />
      <img
        class="rounded-sm absolute inset-0 transform translate-x-20 -translate-y-24 opacity-10 rotate-12 transition duration-1000 group-hover:rotate-0 group-hover:translate-x-12 group-hover:-translate-y-12 group-hover:opacity-20"
        draggable="false"
        :key="props.images[1].key"
        :src="props.images[1].thumbnailSrc"
        :alt="props.images[1].alt"
      />
    </slot>
  </div>

  <slot :images="props.images" :open="open"/>

  <Lightbox v-model:selected-image-key="selectedImageKey" :images="props.images" :title="props.title" />
</template>