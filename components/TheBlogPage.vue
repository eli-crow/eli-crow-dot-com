<script setup lang="ts">
import "highlight.js/styles/github-dark.css";

const props = defineProps<{
    title: string,
    time: string,
}>();

// const intersectionObserver = new IntersectionObserver((entries, observer) => {
//     for (const entry of entries) {
//         if (entry.isIntersecting) {
//         }
//     }
// })
// onMounted(() => {
//     intersectionObserver = 
// })
</script>

<template>
    <header class="max-w-3xl px-5 pt-12 pb-10 w-full font-light text-gray-800">
        <div class="flex items-start">
            <NuxtLink to="/"
                      title="Back to Home"
                      class="icon-button flex p-4 -mx-4 mr-3 hover:bg-gray-100 rounded text-gray-800">
                <Icon icon="chevronLeft" class="h-6" />
            </NuxtLink>
            <div>
                <h1 class="leading-tight text-3xl text-teal mb-4">{{ title }}</h1>
                <div class="flex">
                    <p class="mb-2">
                        <Icon icon="clock">Created:</Icon>&nbsp;
                        <time>{{ props.time }}</time>
                    </p>
                </div>
            </div>
        </div>
    </header>

    <main class="max-w-3xl px-5 pb-24 leading-relaxed w-full prose">
        <slot />
    </main>
</template>