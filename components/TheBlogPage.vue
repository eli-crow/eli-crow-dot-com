<script setup lang="ts">
import "highlight.js/styles/github-dark.css";

const props = defineProps<{
    title: string,
    time: string,
}>();

defineSlots<{
    default(props: {}): void,
    aside(props: {}): void,
    cover(props: {}): void,
}>();
</script>

<template>
    <div class="template" :data-has-aside="!!$slots.aside">
        <header class="pt-12 pb-10 font-light text-gray-800 min-w-0 border-b-2" style="grid-area: header">
            <div v-if="$slots.cover" class="mb-8 rounded-3xl overflow-hidden flex flex-col">
                <slot name="cover" />
            </div>

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

        <aside v-if="$slots.aside" style="grid-area: aside">
            <slot name="aside" />
        </aside>

        <main class="pb-24 leading-relaxed prose min-w-0" style="grid-area: main">
            <slot />
        </main>
    </div>
</template>

<style scoped>
.template {
    @apply grid gap-16 max-w-5xl px-5 min-w-0;
    grid-template:
        "header" auto
        "main" auto /
        1fr;
}

.template[data-has-aside="true"] {
    grid-template:
        "header header" auto
        "main aside" auto /
        3fr 1fr;
}
</style>