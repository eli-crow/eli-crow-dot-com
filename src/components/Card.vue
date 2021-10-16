<script setup>
import { effect, onMounted, ref } from "vue"

const props = defineProps({
    pressable: {
        type: Boolean,
        default: false,
    },
    link: {
        type: Boolean,
        default: false,
    },
    href: {
        type: String,
        default: null
    },
    tag: {
      type: String,
      default: 'div'
    }
})

function handleClick(event) {
    if (props.link) {
        const card = event.currentTarget
        const firstLink = card.querySelector('a, button')
        firstLink?.click()
    }
}
</script>

<template>
    <component
      :is="props.tag" 
      :class="`Card relative flex flex-col bg-white dark:bg-gray-100 sm:h-[520px] overflow-hidden group sm:rounded-sm transition cursor-default ${props.pressable ? 'hover:ring-1 hover:ring-gray-100 dark:hover:ring-gray-200 ring-inset' : ''}`" 
      @click="handleClick"
    >
        <suspense>
            <template #default>
                <slot/>
            </template>
            <template #fallback>
                <div class="absolute inset-0 animate-pulse bg-gray-100 flex items-center justify-center">
                    <Icon icon="loading" class="text-xl animate-spin" />
                </div>
            </template>
        </suspense>
    </component>
</template>

<style>
.card-icon {
    @apply absolute bottom-0 right-0 text-lg text-gray-300 transition group-hover:text-gray-900 cursor-default mix-blend-multiply dark:mix-blend-screen p-8;
}
</style>