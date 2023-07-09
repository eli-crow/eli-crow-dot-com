<script setup lang="ts">
import "highlight.js/styles/github-dark.css";

const props = defineProps<{
    title: string,
}>();
</script>

<template>
    <header class="max-w-3xl px-5 pt-10 pb-6 w-full">
        <div class="flex text-2xl items-start text-gray-800">
            <NuxtLink to="/"
                      title="Back"
                      class="icon-button flex p-4 text-[inherit] -mx-4 mr-0 text-lg">
                <Icon icon="chevronLeft" />
            </NuxtLink>
            <h1 class="leading-tight">{{ title }}</h1>
        </div>
    </header>

    <main class="max-w-3xl px-5 pb-24 leading-relaxed w-full">
        <slot />
    </main>
</template>

<style scoped>
main {
    @apply text-gray-700;
}

main :is(p, ul, ol, dl, figure, blockquote, pre, table, img):not(:first-child) {
    margin-block-start: 1rem;
}

main :is(p, ul, ol, dl, figure, blockquote, pre, table, img):not(:last-child) {
    margin-block-end: 1rem;
}

main :is(ul) {
    padding-inline-start: 1.333333em;
    list-style: disc;
}

main :is(ol) {
    padding-inline-start: 1.333333em;
    list-style: decimal;
}

main :is(h1, h2, h3, h4, h5, h6) {
    @apply text-gray-800 font-semibold;
}

main :is(h1, h2, h3, h4, h5, h6):not(:first-child) {
    margin-block-start: 1.333333em;
}

main :is(h1, h2, h3, h4, h5, h6):not(:last-child) {
    margin-block-end: 0.3333333em;
}

main :is(h2) {
    @apply text-2xl leading-tight;
}

main :is(h3) {
    @apply text-xl leading-snug;
}

main :is(h4) {
    @apply text-lg;
}

main :is(h5) {
    @apply text-base;
}

main :is(h6) {
    @apply text-base;
}

main :is(li) {
    margin-block: 1em;
}

main :is(b, strong) {
    @apply font-semibold text-gray-800;
}

main :is(pre) {
    @apply text-sm rounded-lg bg-gray-100 px-5 py-4 overflow-x-auto;
}

main :is(hr) {
    @apply my-12 border-b-2 border-gray-300;
}

main :is(code):not(pre code) {
    @apply font-mono text-gray-900 rounded bg-gray-200 pt-px pb-1 px-[0.5ch] text-sm;
}
</style>
