<script setup lang="ts">
// @ts-ignore
import content, { toc } from './simplify.md';
</script>

<template>
    <TheBlogPage title="How to Simplify App Interfaces"
                 time="2023">
        <template #cover>
            <img src="/blog/simplify-cover.png" class="object-cover aspect-[1.777777777] bg-white" />
        </template>

        <template #default>
            <div v-html="content" />
        </template>

        <template #aside>
            <TableOfContents :toc="toc" class="sticky top-12" />
        </template>
    </TheBlogPage>
</template>