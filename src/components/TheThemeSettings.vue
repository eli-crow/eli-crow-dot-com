<script setup>
import { ref, watch } from "vue"

const theme = ref(localStorage.theme ?? 'dark')

watch(theme, setTheme)
setTheme(theme.value)

function setTheme(theme) {
    localStorage.theme = theme
    if (theme === 'dark') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

function toggleTheme() {
    if (theme.value === 'dark') {
        theme.value = 'light'
    } else {
        theme.value = 'dark'
    }
}
</script>

<template>
  <button @click="toggleTheme" class="flex items-center text-gray-400">
      <Icon class="text-lg" v-if="theme === 'dark'" icon="sun" />
      <Icon class="text-lg" v-else icon="moon" />
      <span class="ml-2">Toggle theme</span>
  </button>
</template>
