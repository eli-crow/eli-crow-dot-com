<script setup>
import { reactive } from "vue";
import AlleyOoper from "./AlleyOoper.vue";

const alleyOopers = reactive([25, 50, 75, 100]);
</script>

<template>
  <div class="card">
    <div class="card-padding">
      <div class="alley-ooper-group">
        <!-- <label class="alley-ooper">
          <span class="alley-ooper-label">Slider</span>
          <span class="alley-ooper-value">{{ alleyOopers[0].toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input" v-model="alleyOopers[0]" min="0" max="100" :curve-points="[0,0, .33,0, .66,0, 1,0]" style="height: 1rem;" />
        </label>
        <label class="alley-ooper">
          <span class="alley-ooper-label">Swooper</span>
          <span class="alley-ooper-value">{{ alleyOopers[1].toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input" v-model="alleyOopers[1]" min="0" max="100" :curve-points="[0,0, .33,1, .66,1, 1,0]" style="height: 1.5rem;" />
        </label>
        <label class="alley-ooper">
          <span class="alley-ooper-label">Swisher</span>
          <span class="alley-ooper-value">{{ alleyOopers[2].toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input" v-model="alleyOopers[2]" min="0" max="100" :curve-points="[0,1, 1.75,1.5, -0.2,-0.15, 1,0]" style="height: 3rem;" />
        </label>-->
        <label class="alley-ooper">
          <span class="alley-ooper-label">Looper</span>
          <span class="alley-ooper-value">{{ alleyOopers[0].toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input"
            v-model="alleyOopers[0]"
            min="0"
            max="100"
            :spline="[[0,1, 2,-0.85, -0.5,-1.33, 1,1]]"
            style="height: 3rem;" />
        </label>

        <label class="alley-ooper">
          <span class="alley-ooper-label">Swooper</span>
          <span class="alley-ooper-value">{{ alleyOopers[1].toFixed(0) }}</span>
          <AlleyOoper
            class="alley-ooper-input"
            v-model="alleyOopers[1]"
            min="0"
            max="100"
            :spline="[
              [0,0, .05,-.2, .15,0.5, 0.25, 0],
              [1.5, 1, 0.25, 1, 0, 1.1],
            ]"
            style="height: 1.5rem;" />
        </label>
      </div>
    </div>
    <div class="card-corner-decoration">
      <Icon icon="cursor" />
    </div>
  </div>
</template>

<style scoped>
.alley-ooper-group {
  display: flex;
  flex-direction: column;
}
.alley-ooper-group > .alley-ooper:not(:last-child) {
  margin-bottom: 32px;
}
.alley-ooper {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 10px;
}
.alley-ooper-label {
  grid-column: 1;
  grid-row: 1;
}
.alley-ooper-value {
  color: var(--text-weak);
  grid-column: 2;
  grid-row: 1;
}
.alley-ooper-input {
  grid-column: 1 / span 2;
  grid-row: 2;
  margin: 4px;
  /* height: in html */
}
</style>