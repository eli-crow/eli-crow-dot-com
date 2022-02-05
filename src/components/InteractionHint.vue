<script setup lang="ts">
import Transition from './Transition.vue'

const props = defineProps({
    visible: { type: Boolean, default: true },
    icon: { type: String, default: 'cursor' },
})
</script>

<template>
    <div class="pointer-events-none">
        <Transition >
            <p 
                v-if="props.visible"
                class="
                    origin-center px-4 py-2 rounded-full whitespace-nowrap
                    bg-gray-100 dark:bg-gray-100 
                    md:dark:bg-gray-200">
            <Icon :icon="props.icon" class="mr-2">3D Model</Icon>
            <span><slot/></span>
        </p>
        </Transition>
    </div>
</template>