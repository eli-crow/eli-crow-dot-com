<script setup lang="ts">
import TheShowoffPage from '../../components/TheShowoffPage.vue'
import InteractionHint from '../../components/InteractionHint.vue'
import BeadRailViewer from "./BeadRailViewer.vue";

const showHint = $ref(true)
</script>

<template>
  <TheShowoffPage>
    <template #description>
      <div class="flex gap-3 items-center mb-5">
        <router-link
          to="/"
          title="Back"
          class="icon-button text-gray-800 flex items-center justify-center p-4 -m-4 -mr-2 text-lg"
        >
          <Icon icon="chevronLeft" />
        </router-link>
        <h1 class="font-light text-2xl text-gray-800 leading-[1.42] flex-1">Bead Maze</h1>
      </div>

      <p class="mb-5 gooey-text text-lg">
        <span
          class="gooey-text-inner"
        >You are seven years old. Goku flexes silently on an old CRT. You slide the beads along the rail while you wait for your appointment.</span>
      </p>

      <p
        class="mb-6"
      >Many of my interactive experiments involve a bead and a track. I solved this squiggly puzzle by projecting a 3D bezier spline onto 2D and constraining the beads using projection and binary search</p>

      <p class="mb-2">
        <Icon icon="clock">Created:</Icon>
        <time>2022</time>
      </p>
      <p>
        <Icon icon="wrench">Tools used:</Icon>Blender, THREE.js
      </p>
    </template>

    <template #content>
      <BeadRailViewer @interacted="showHint = false" class="flex-1 self-stretch" ref="container" />
      <InteractionHint
        :visible="showHint"
        icon="threeD"
        class="absolute bottom-0 left-1/2 -translate-x-1/2"
      >
        <span>You know what to do</span>
      </InteractionHint>
    </template>
  </TheShowoffPage>
</template>