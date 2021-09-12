<script setup>
import { ref } from "vue";
import Lightbox from './Lightbox.vue';
import Card from '../Card.vue';

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
    <Card class="p-8" type="internal" @click="open(props.images[0].key)">
        <div class="flex flex-col relative group mb-7">
            <img
                class="
                rounded shadow-lg relative z-10 transition duration-1000 transform origin-center
                group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:rotate-[-3deg]"
                draggable="false"
                :key="props.images[0].key"
                :src="props.images[0].thumbnailSrc"
                :alt="props.images[0].alt"
            />
            <img
                class="
                  rounded absolute inset-0 transform origin-center opacity-10 transition duration-1000
                  group-hover:translate-x-8 group-hover:-translate-y-6 group-hover:opacity-50 group-hover:rotate-[8deg]"
                draggable="false"
                :key="props.images[1].key"
                :src="props.images[1].thumbnailSrc"
                :alt="props.images[1].alt"
            />
        </div>

        <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">
            Yikes Dog
        </h2>
        <p><time>2021, Blender</time></p>

        <div class="absolute bottom-0 right-0 text-lg text-gray-300 group-hover:text-gray-900 cursor-default mix-blend-multiply dark:mix-blend-screen p-8 flex items">
            <span class="mr-2 text-lg leading-none">{{images.length}}</span>
            <Icon icon="image" />
        </div>
    </Card>

    <Lightbox v-model:selected-image-key="selectedImageKey" :images="props.images" :title="props.title" />
</template>