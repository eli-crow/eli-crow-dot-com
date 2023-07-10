<script setup lang="ts">
import "highlight.js/styles/github-dark.css";

const props = defineProps<{
    title: string,
}>();
</script>

<template>
    <header class="max-w-3xl px-5 pt-12 pb-10 w-full font-light">
        <div class="flex text-3xl items-start text-gray-800">
            <NuxtLink to="/"
                      title="Back to Home"
                      class="icon-button flex p-4 text-[inherit] -mx-4 mr-3 text-lg hover:bg-gray-100 rounded">
                <Icon icon="chevronLeft" />
            </NuxtLink>
            <h1 class="leading-tight">{{ title }}</h1>
        </div>
    </header>

    <main class="max-w-3xl px-5 pb-24 leading-relaxed w-full prose">
        <slot />
    </main>
</template>