<script setup lang="ts">
import { watchEffect } from "vue";

type Values = [number, number, number, number]
const DEFAULT_VALUES: Values = [25, 50, 75, 95]

const status = ref<'normal' | 'wild'>('normal')
const values = ref<Values>(DEFAULT_VALUES)
const wildValue = ref<number>(0)

watchEffect(() => {
  if (values.value.every(a => a === 100)) {
    status.value = 'wild'
    values.value = [25, 50, 75, 95]
  }
})

watchEffect(() => {
  if (wildValue.value >= 100) {
    status.value = 'normal'
    wildValue.value = 0
  }
})
</script>

<template>
  <Card type="interactive" class="p-8">
    <transition name="fade" mode="out-in">
      <div v-if="status === 'normal'" class="alley-ooper-group pb-16">
        <label class="alley-ooper">
          <span class="alley-ooper-label">Slider</span>
          <span class="alley-ooper-value">{{ values[0].toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input"
                      v-model="values[0]"
                      :min="0"
                      :max="100"
                      :spline="[[0, 0, .33, 0, .66, 0, 1, 0]]"
                      style="height: 1rem" />
        </label>
        <label class="alley-ooper">
          <span class="alley-ooper-label">Swooper</span>
          <span class="alley-ooper-value">{{ values[1].toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input"
                      v-model="values[1]"
                      :min="0"
                      :max="100"
                      :spline="[[0, 0, .33, 1, .66, 1, 1, 0]]"
                      style="height: 1.5rem" />
        </label>
        <label class="alley-ooper">
          <span class="alley-ooper-label">Swisher</span>
          <span class="alley-ooper-value">{{ values[2].toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input"
                      v-model="values[2]"
                      :min="0"
                      :max="100"
                      :spline="[[0, 1, 1.75, 1.5, -0.2, -0.15, 1, 0]]"
                      style="height: 3rem" />
        </label>
        <label class="alley-ooper">
          <span class="alley-ooper-label">Looper</span>
          <span class="alley-ooper-value">{{ values[3].toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input"
                      v-model="values[3]"
                      :min="0"
                      :max="100"
                      :spline="[[0, 1, 2, -0.85, -0.5, -1.33, 1, 1]]"
                      style="height: 3rem" />
        </label>
      </div>

      <div v-else class="pb-16">
        <label class="alley-ooper">
          <span class="alley-ooper-label">Alley-Ooper</span>
          <span class="alley-ooper-value">{{ wildValue.toFixed(0) }}</span>
          <AlleyOoper class="alley-ooper-input"
                      v-model="wildValue"
                      :min="0"
                      :max="100"
                      :spline="[
                        [0.04, 0.03, 0.151922, 0.121118, 0.580877, 0.288622, 0.737267, 0.207631],
                        [0.833169, 0.157965, 0.777481, 0, 0.540662, 0],
                        [0.370867, 0, 0.0544846, 0.133272, 0.03125, 0.268229],
                        [0.0044403, 0.423952, 0.446828, 0.591171, 0.705989, 0.478705],
                        [0.965149, 0.366238, 1.06345, 0.19898, 0.938339, 0.11535],
                        [0.838587, 0.0486727, 0.57194, 0.158613, 0.335121, 0.288382],
                        [0.109671, 0.411921, -0.00189018, 0.507787, 0.03125, 0.609375],
                        [0.0669963, 0.718952, 0.454211, 0.742725, 0.705989, 0.72383],
                        [0.898125, 0.709411, 1.01434, 0.608178, 0.965149, 0.478705],
                        [0.908872, 0.330592, 0.705989, 0.259539, 0.57194, 0.366238],
                        [0.415096, 0.491082, 0.585345, 0.824762, 0.482575, 0.914159],
                        [0.379804, 1.00356, 0.192136, 1.02374, 0.0714925, 0.971834],
                        [-0.0363247, 0.925445, -0.0178731, 0.772854, 0.192136, 0.787273],
                        [0.402145, 0.801692, 0.697052, 0.997788, 0.889188, 0.971834],
                        [1.01534, 0.954793, 1.03664, 0.842059, 0.938339, 0.787273],
                      ]"
                      style="height: 24rem" />
        </label>
      </div>
    </transition>

    <div class="card-icon">
      <Icon icon="cursor">Interactive</Icon>
    </div>
  </Card>
</template>

<style scoped>
.alley-ooper-group {
  display: flex;
  flex-direction: column;
}

.alley-ooper-group>.alley-ooper:not(:last-child) {
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
  @apply text-gray-500;
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