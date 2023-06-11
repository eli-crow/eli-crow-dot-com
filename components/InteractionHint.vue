<script setup lang="ts">
import type * as icons from './Icon/icons';

const {
    visible = true,
    icon = 'threeD',
} = defineProps<{
    visible?: boolean,
    icon?: keyof typeof icons
}>()
</script>

<template>
    <div class="pointer-events-none">
        <transition name="fade">
            <p v-if="visible" class="origin-center px-4 py-2 rounded-full whitespace-nowrap bg-teal text-gray-900 dark:text-gray-50">
                <Icon :icon="icon" class="mr-3 -mt-[0.3em]">3D Model</Icon>
                <span>
                    <slot />
                </span>
            </p>
        </transition>
    </div>
</template>