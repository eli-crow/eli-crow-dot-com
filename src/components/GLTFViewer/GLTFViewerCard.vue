<script setup>
import { ref, watch } from "vue"
import Card from '../Card.vue'
import GLTFViewer from './GLTFViewer.vue'

const props = defineProps({
    title: { type: String, required: true },
    byline: { type: String, required: false },
    gltf: { type: String, required: true },
})
</script>

<template>
    <Card>
        <GLTFViewer 
            class="pointer-events-none sm:pointer-events-auto aspect-w-1 aspect-h-1" 
            :gltf="props.gltf" 
            rotate
        />

        <div class="p-8 pt-0">
            <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">
                {{props.title}}
            </h2>
            <p v-if="props.byline"><time>{{props.byline}}</time></p>
        </div>
    </Card>
</template>