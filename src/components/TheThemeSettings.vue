<script setup lang="ts">
import { ref, watch } from "vue"

const preferred = window?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const theme = ref(localStorage.theme ?? preferred ?? 'dark')

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
    <button @click="toggleTheme" class="flex items-center hover:text-gray-900">
        <Icon class="text-lg" v-if="theme === 'dark'" icon="sun">Light Theme</Icon>
        <Icon class="text-lg" v-else icon="moon">Dark Theme</Icon>
        <span class="ml-2">Toggle theme</span>
    </button>
</template>