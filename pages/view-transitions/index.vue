<script setup lang="ts">
// @ts-ignore
import content from './view-transitions.md';

useHead({
    link: [
        { key: 'to-sep', rel: 'canonical', href: "https://sep.com/blog/shared-element-transitions/" }
    ]
})

</script>

<template>
    <TheBlogPage title="How to Design and Build Shared Element Transitions"
                 time="2023">
        <div v-html="content" />
    </TheBlogPage>
</template>