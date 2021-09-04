<script setup>
import { computed, ref, watch } from 'vue';
import { FocusTrap } from 'focus-trap-vue';

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

const focusRoot = ref();
watch(focusRoot, newValue => {
  newValue?.focus();
});

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
  <teleport to="#overlay">
    <transition name="fade">
      <div class="backdrop" v-if="props.selectedImageKey !== null" @scroll.stop.prevent.capture @click="close" />
    </transition>

    <transition name="lift">
      <div class="content-container" v-if="props.selectedImageKey !== null">
        <FocusTrap :active="props.selectedImageKey !== null" @deactivate="close">
          <div
            class="content"
            @click.stop
            tabindex="-1"
            ref="focusRoot"
            @keydown="handleKeyboard">

            <h2 class="title">{{props.title}} {{selectedImageIndex + 1}}/{{props.images.length}}</h2>
            <button class="close icon-button" @click.prevent="close">
              <Icon icon="close" />
            </button>
            <div class="image-container">
              <img
                class="image"
                :src="selectedSrc"
                :alt="selectedImage.alt" />
              <button class="previous pager" @click="previous">
                <Icon icon="chevronLeft" />
              </button>
              <button class="next pager" @click="next">
                <Icon icon="chevronRight" />
              </button>
            </div>
            <div class="thumbnails">
              <img
                v-for="image in images"
                class="thumbnail"
                draggable="false"
                :key="image.key"
                :src="image.thumbnailSrc"
                :alt="image.alt"
                :data-selected="image.key === selectedImageKey"
                tabindex="0"
                @keydown.enter="changeImage(image.key)"
                @keydown.space="changeImage(image.key)"
                @click.prevent="changeImage(image.key)" />
            </div>

          </div>
        </FocusTrap>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.backdrop {
  overscroll-behavior: contain;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--surface-1);
  /* backdrop-filter: blur(10px); */
  will-change: opacity;
}
.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: opacity, transform;
  pointer-events: none;
}
.content {
  overscroll-behavior: contain;
  max-width: 1000px;
  height: 100%;
  pointer-events: all;
  min-height: 0;
  outline: none;
}
@media screen and (max-width: 700px) {
  .content {
    display: grid;
    grid-template:
      ". . . . ." 1.25rem
      ". title . close ." 2rem
      ". . . . ." 1.25rem
      "image image image image image" 1fr
      ". . . . ." 1.5rem
      ". thumbnails thumbnails thumbnails ." 4rem
      ". . . . ." 1.5rem
      / 1.5rem 1fr 1rem auto 1.5rem;
  }
}
@media not screen and (max-width: 700px) {
  .content-container {
    padding: 0 1.5rem;
  }
  .content {
    display: grid;
    grid-template:
      ". . ." 1.25rem
      "title . close" 2rem
      ". . ." 1.25rem
      "image image image" 1fr
      ". . ." 1.5rem
      "thumbnails thumbnails thumbnails" 4rem
      ". . ." 1.5rem
      / 1fr 1rem auto;
  }
}
.title {
  grid-area: title;
  align-self: center;
  font-size: 1rem;
  font-weight: 600;
}
.close {
  grid-area: close;
  align-self: center;
  padding: 0.5rem;
  margin: -0.5rem;
}
.image-container {
  position: relative;
  grid-area: image;
  background-color: black;
  background-size: cover;
  min-height: 0;
}
.image {
  object-fit: contain;
  height: 100%;
}
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1;
  top: 0;
  height: 100%;
  appearance: none;
  border: 0;
  background: transparent;
  color: white;
  font-size: 1.5rem;
  width: 3rem;
}
.pager:hover {
  background: rgba(255, 255, 255, 0.15);
  /* backdrop-filter: blur(10px); */
  color: white;
}
.pager > * {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35));
}
.previous {
  left: 0;
}
.next {
  right: 0;
}
.thumbnails {
  grid-area: thumbnails;
  display: flex;
  gap: 0.75rem;
}
.thumbnail {
  height: 100%;
  width: auto;
}
.thumbnail[data-selected="true"] {
  outline: solid 3px white;
}
.thumbnail:hover {
  filter: brightness(1.2);
}
</style>