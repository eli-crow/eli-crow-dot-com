<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import theme from '../../store/theme';

const LIGHT_ENVIRONMENT = '/assets/studio-light.exr'
const DARK_ENVIRONMENT = '/assets/studio.exr'

const emit = defineEmits<{ (e: 'interaction-end'): void }>()

const { BeadScene } = await import('./BeadScene')
const scene = new BeadScene({
    onInteractionEnd() { emit('interaction-end') },
    environment: theme.theme === 'light' ? LIGHT_ENVIRONMENT : DARK_ENVIRONMENT
})
await scene.load()
const container = ref<HTMLElement>()
onMounted(() => scene.init(container.value!))
onBeforeUnmount(() => window.setTimeout(scene.dispose, 500))
watch(() => theme.theme, () => {
    if (theme.theme === 'light') {
        scene.setEnvironment(LIGHT_ENVIRONMENT)
    } else {
        scene.setEnvironment(DARK_ENVIRONMENT)
    }
})
</script>

<template>
    <div ref="container" class="min-w-0 min-h-0 animate-fade-in" />
</template>