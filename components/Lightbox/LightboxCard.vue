<script setup lang="ts">
import Card from '../Card.vue';
import Lightbox, { LightboxImageInfo } from './Lightbox.vue';

const selectedImageKey = ref<LightboxImageInfo['key'] | null>(null);

const props = defineProps<{
  title: string,
  images: LightboxImageInfo[],
}>();

function open(key: LightboxImageInfo['key']) {
  selectedImageKey.value = key;
}
</script>

<template>
  <Card class="p-8" link>
    <div class="flex flex-col relative group mb-7">
      <img
           class="rounded shadow-lg relative z-10 transition duration-500 transform origin-bottom-left group-hover:rotate-[-4deg]"
           draggable="false"
           :key="props.images[0].key"
           :src="props.images[0].thumbnailSrc"
           :alt="props.images[0].alt" />
      <img
           class="rounded absolute inset-0 transform origin-bottom-left opacity-10 transition duration-500 group-hover:opacity-50 group-hover:rotate-[4deg]"
           draggable="false"
           :key="props.images[1].key"
           :src="props.images[1].thumbnailSrc"
           :alt="props.images[1].alt" />
    </div>

    <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">Yikes Dog</h2>
    <p>
      <time>2021, Blender</time>
    </p>

    <button class="card-icon flex" @click="open(props.images[0].key)">
      <span class="mr-2 text-lg leading-none">{{ images.length }}</span>
      <Icon icon="image">{{ images.length === 1 ? 'Image' : 'Images' }}</Icon>
    </button>
  </Card>

  <Lightbox v-model:selected-image-key="selectedImageKey"
            :images="props.images"
            :title="props.title" />
</template>