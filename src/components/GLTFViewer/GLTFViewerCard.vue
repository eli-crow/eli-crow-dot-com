<script setup>
import { reactive } from "vue"
import Modal from '../Modal.vue'
import Card from '../Card.vue'
import GLTFViewer from './GLTFViewer.vue'

const props = defineProps({
    title: { type: String, required: true },
    byline: { type: String, required: false },
    gltf: { type: String, required: true },
})

const state = reactive({
  modalIsOpen: false,
})
</script>

<template>
    <Card>
        <div class="aspect-w-1 aspect-h-1">
            <GLTFViewer 
                v-show="!state.modalIsOpen"
                class="pointer-events-none sm:pointer-events-auto" 
                :gltf="props.gltf" 
                rotate
            />
        </div>

        <div class="p-8 pt-0">
            <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">
                {{props.title}}
            </h2>
            <p v-if="props.byline"><time>{{props.byline}}</time></p>
        </div>

        <button 
            @click="state.modalIsOpen = true"
            class="pr-8 pb-8 self-end flex gap-4 items-center  sm:pointer-events-none sm:absolute sm:bottom-0 sm:right-0" 
        >
            <span class="sm:hidden">Interact</span>
            <Icon icon="threeD" class="text-lg text-gray-300 group-hover:text-gray-900"/>
        </button>

        <Modal 
            :title="props.title" 
            :is-open="state.modalIsOpen" 
            @close="state.modalIsOpen = false" 
        >
            <GLTFViewer :gltf="props.gltf" rotate/>
        </Modal>
    </Card>
</template>