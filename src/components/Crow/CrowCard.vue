<script setup lang="ts">
import { reactive } from 'vue'
import Crow from './Crow.vue';
import Card from '../Card.vue';
import Modal from '../Modal.vue'

const state = reactive({
    isLoaded: false,
    modalIsOpen: false,
})
</script>

<template>
    <Card class="min-h-[480px]">
        <div class="flex-1 flex">
            <Crow
                class="flex-1 pointer-events-none sm:pointer-events-auto"
                v-show="!state.modalIsOpen"
                :scale="0.65"
            />
        </div>

        <button
            @click="state.modalIsOpen = true"
            class="pr-8 pb-8 self-end flex gap-4 items-center sm:pointer-events-none sm:absolute sm:bottom-0 sm:right-0"
        >
            <span class="sm:hidden">Interact</span>
            <Icon icon="cursor" class="text-lg text-gray-300 group-hover:text-gray-900" />
        </button>

        <Modal title="Abstract" :is-open="state.modalIsOpen" @close="state.modalIsOpen = false">
            <Crow class="flex-1" :scale="0.65" />
        </Modal>
    </Card>
</template>