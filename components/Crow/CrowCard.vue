<script setup lang="ts">
import Card from '../Card.vue';
import Modal from '../Modal.vue';
import Crow from './Crow.vue';

const modalIsOpen = ref<boolean>(false)
</script>

<template>
    <Card class="min-h-[480px]">
        <div class="flex-1 flex">
            <ClientOnly>
                <Crow class="flex-1 pointer-events-none sm:pointer-events-auto animate-fade-in"
                      v-show="!modalIsOpen"
                      :scale="0.65" />

                <template #fallback>
                    <Spinner />
                </template>
            </ClientOnly>
        </div>

        <button @click="modalIsOpen = true"
                class="pr-8 pb-8 self-end flex gap-4 items-center sm:pointer-events-none sm:absolute sm:bottom-0 sm:right-0">
            <span class="sm:hidden">Interact</span>
            <Icon icon="cursor" class="text-lg text-gray-300 group-hover:text-gray-900" />
        </button>

        <ClientOnly>
            <Modal title="Abstract" :is-open="modalIsOpen" @close="modalIsOpen = false">
                <Crow class="flex-1" :scale="0.65" />
            </Modal>
        </ClientOnly>
    </Card>
</template>