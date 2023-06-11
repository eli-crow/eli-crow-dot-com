<script setup lang="ts">
import Icon from './Icon/Icon.vue'
import type * as icons from './Icon/icons'
const props = withDefaults(defineProps<{
    icon: keyof typeof icons,
    tag?: string
}>(), {
    tag: 'div'
})
</script>

<template>
    <component
        :is="props.tag"
        class="absolute inset-0 flex items-center justify-center group pointer-events-none"
    >
        <Icon
            :icon="icon"
            class="!h-12 !w-12 text-white transition opacity-0 transform scale-50 filter drop-shadow-lg group-hover:scale-100 group-hover:opacity-100"
        />
    </component>
</template>