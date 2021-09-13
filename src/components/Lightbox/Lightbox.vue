<script setup>
import { computed, ref, watch } from 'vue';
import Modal from '../Modal.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Images'
  },
  images: {
    type: Array,
    required: true,
  },
  selectedImageKey: {}
});

const emit = defineEmits([
  'update:selected-image-key'
]);

const selectedImageIndex = computed(() => props.selectedImageKey === null ? null : props.images.findIndex(i => i.key === props.selectedImageKey));
const selectedImage = computed(() => props.selectedImageKey === null ? null : props.images[selectedImageIndex.value]);
const selectedSrc = ref();
const loader = new Image();
watch(selectedImage, (newValue) => {
  if (newValue === null) return;
  selectedSrc.value = newValue.thumbnailSrc;
  loader.src = newValue.src;
  loader.onload = () => {
    selectedSrc.value = newValue.src;
  };
});

function mod(a, b) {
  return ((a % b) + b) % b;
}

function close() {
  emit('update:selected-image-key', null);
}

function changeImage(key) {
  emit('update:selected-image-key', key);
}

function previous() {
  if (props.selectedImageKey === null) return;
  const previousIndex = mod(selectedImageIndex.value - 1, props.images.length);
  emit('update:selected-image-key', previousIndex);
}

function next() {
  if (props.selectedImageKey === null) return;
  const nextIndex = mod(selectedImageIndex.value + 1, props.images.length);
  emit('update:selected-image-key', nextIndex);
}

function handleKeyboard(e) {
  switch (e.key) {
    case 'ArrowLeft':
      previous();
      e.preventDefault();
      break;
    case 'ArrowRight':
      next();
      e.preventDefault();
      break;
  }
}
</script>

<template>
  <slot :title="props.title" :images="props.images" />

  <Modal 
    :is-open="selectedImage !== null" 
    :title="`${props.title} ${selectedImageIndex + 1}/${props.images.length}`"
    @key="handleKeyboard"
    @close="close"
  >
    <div class="relative bg-cover flex-1 flex flex-col items-center min-h-0">
      <img
        class="object-contain h-full"
        :src="selectedSrc"
        :alt="selectedImage.alt" />
      <button class="flex items-center justify-center text-gray-600 hover:text-gray-900 absolute z-20 top-0 h-full hover:bg-gray-100 mix-blend-multiply dark:mix-blend-screen bg-opacity-20 left-0 w-12" @click="previous">
        <Icon icon="chevronLeft" class="text-xl filter drop-shadow-md" />
      </button>
      <button class="flex items-center justify-center text-gray-600 hover:text-gray-900 absolute z-20 top-0 h-full hover:bg-gray-100 mix-blend-multiply dark:mix-blend-screen bg-opacity-20 right-0 w-12" @click="next">
        <Icon icon="chevronRight" class="text-xl filter drop-shadow-md" />
      </button>
    </div>

    <div class="flex gap-3 px-4 py-6 justify-center">
      <img
        v-for="image in images"
        :class="`rounded-sm h-16 w-auto hover:filter hover:brightness-125 ${image.key === selectedImageKey ? 'ring-[3px] ring-blue' : ''}`"
        draggable="false"
        tabindex="0"
        :key="image.key"
        :src="image.thumbnailSrc"
        :alt="image.alt"
        @keydown.enter="changeImage(image.key)"
        @keydown.space="changeImage(image.key)"
        @click.prevent="changeImage(image.key)" />
    </div>
  </Modal>
</template>