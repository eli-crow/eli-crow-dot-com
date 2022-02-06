<script setup lang="ts">
import TheShowoffPage from '../../components/TheShowoffPage.vue'
import InteractionHint from '../../components/InteractionHint.vue'
import OuijaSVG from './OuijaSVG.vue';
import { useOuijaBoard } from './useOuijaBoard';
import { ref } from 'vue';

let showHint = $ref(true)
const canvas = ref<HTMLCanvasElement>()
const ouija = useOuijaBoard({
    canvas,
    onInteractionEnd() {
        showHint = false
    }
})
</script>

<template>
    <TheShowoffPage
        title="Ouija"
        subtitle="Is anybody listening?"
        description="Does this page actually connect with other visitors to this site? Perhaps. Reach out and call for contact. Maybe someone will respond. Maybe I'm lying to you."
        tools="HTML Canvas, WebSockets?"
        time="2022"
    >
        <div class="-m-8 self-stretch flex justify-center">
            <div class="max-w-3xl w-full aspect-w-1 aspect-h-1 relative">
                <OuijaSVG class="p-8" />
                <canvas
                    ref="canvas"
                    class="block absolute top-0 left-0 w-full h-full cursor-crosshair select-none"
                />
            </div>
        </div>

        <button
            class="button absolute top-0 right-0 cursor-default hover:text-white select-none"
            @click="ouija.clear"
        >Clear</button>

        <InteractionHint
            :visible="showHint"
            icon="threeD"
            class="absolute bottom-0 left-1/2 -translate-x-1/2"
        >
            <span class="coarse:hidden">Draw with your mouse</span>
            <span class="fine:hidden">Draw with your finger</span>
        </InteractionHint>
    </TheShowoffPage>
</template>