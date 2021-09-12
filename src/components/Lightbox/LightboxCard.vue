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
                class="rounded-sm shadow-xl relative z-10 transition duration-1000 transform group-hover:scale-[1.05]"
                draggable="false"
                :key="props.images[0].key"
                :src="props.images[0].thumbnailSrc"
                :alt="props.images[0].alt"
            />
            <img
                class="rounded-sm absolute inset-0 transform origin-center translate-x-20 -translate-y-24 opacity-10 rotate-12 transition duration-1000 group-hover:rotate-0 group-hover:translate-x-12 group-hover:-translate-y-12 group-hover:opacity-20"
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

        <div class="absolute bottom-0 right-0 text-lg text-gray-300 group-hover:text-gray-900 cursor-default mix-blend-screen p-8 flex items">
            <span class="mr-2 text-lg leading-none">{{images.length}}</span>
            <Icon icon="image" />
        </div>
    </Card>

    <Lightbox v-model:selected-image-key="selectedImageKey" :images="props.images" :title="props.title" />
</template>