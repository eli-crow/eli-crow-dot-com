<script setup lang="ts">
import { ref } from 'vue';
import InteractionHint from '../../components/InteractionHint.vue';
import TheShowoffPage from '../../components/TheShowoffPage.vue';
import OuijaSVG from './OuijaSVG.vue';
import { useOuijaBoard } from './useOuijaBoard';

const showHint = ref(true)
const canvas = ref<HTMLCanvasElement>()
const ouija = useOuijaBoard({
    canvas,
    onInteractionEnd() {
        showHint.value = false
    }
})
</script>

<template>
    <TheShowoffPage title="Ouija"
                    subtitle="Is anybody listening?"
                    description="Does this page actually connect with other visitors to this site? Call out. Maybe someone will respond. Maybe I'm lying to you. Is there really any way to know?"
                    tools="HTML Canvas, WebSockets?"
                    time="2022">
        <div class="-m-8 self-stretch flex justify-center overscroll-none">
            <OuijaSVG class="absolute top-0 left-0 w-full h-full" />
            <!-- canvas height set in code -->
            <canvas ref="canvas" class="relative block w-full cursor-crosshair select-none" />
        </div>

        <button class="button absolute top-0 right-0 cursor-default hover:text-gray-900 select-none"
                @click="ouija.clear">Clear</button>

        <InteractionHint :visible="showHint"
                         icon="threeD"
                         class="absolute bottom-0 left-1/2 -translate-x-1/2">
            <span class="coarse:hidden">Commune using your mouse</span>
            <span class="fine:hidden">Commune using your finger</span>
        </InteractionHint>
    </TheShowoffPage>
</template>