<script setup lang="ts">
import theme from '../store/theme'
</script>

<template>
    <button @click="theme.toggle" class="flex items-center hover:text-gray-900">
        <Icon class="text-lg" v-if="theme.theme === 'dark'" icon="sun">Light Theme</Icon>
        <Icon class="text-lg" v-else icon="moon">Dark Theme</Icon>
        <span class="ml-2">Toggle theme</span>
    </button>
</template>