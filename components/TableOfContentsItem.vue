<script setup lang="ts">
import { MarkdownTOCNode } from '../rollupPlugins';

const props = defineProps<{
    item: MarkdownTOCNode,
    maxDepth: number,
    visibleHashes?: string[]
}>();
</script>

<template>
    <li class="mb-2 last:mb-0">
        <a :class="`text-gray-500 hover:text-gray-900 block mb-2 transition ${props.visibleHashes?.includes(props.item.hash) ? 'text-gray-900' : ''}`" :href="`#${props.item.hash}`">{{ props.item.text }}</a>

        <ul v-if="props.item.depth < maxDepth && props.item.children" class="pl-3">
            <TableOfContentsItem v-for="item in props.item.children"
                                 :item="item"
                                 :key="item.hash"
                                 :max-depth="props.maxDepth"
                                 :visible-hashes="visibleHashes" />
        </ul>
    </li>
</template>