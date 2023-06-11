<script setup lang="ts">
import InteractionHint from '../../components/InteractionHint.vue';
import TheShowoffPage from '../../components/TheShowoffPage.vue';
import BeadRailViewer from "./BeadRailViewer.vue";

const showHint = ref(true)
</script>

<template>
  <TheShowoffPage title="Bead Maze"
                  subtitle="You are seven years old. Goku flexes silently on an old CRT. You fiddle idly in the sterile waiting room."
                  description="Many of my interactive experiments involve a bead and a track. I solved this squiggly puzzle by projecting a 3D bezier spline onto 2D and constraining the beads using projection and binary search"
                  tools="Blender, THREE.js"
                  time="2022">
    <BeadRailViewer @interaction-end="showHint = false"
                    class="flex-1 self-stretch"
                    ref="container" />
    <InteractionHint :visible="showHint"
                     icon="threeD"
                     class="absolute bottom-0 left-1/2 -translate-x-1/2">You know what to do</InteractionHint>
  </TheShowoffPage>
</template>