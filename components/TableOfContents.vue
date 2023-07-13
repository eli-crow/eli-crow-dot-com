<script setup lang="ts">
import { MarkdownTOCNode } from '../rollupPlugins';

const props = withDefaults(defineProps<{
    toc: MarkdownTOCNode[]
    maxDepth?: number
}>(), {
    maxDepth: 3
});

const visibleHashes = ref<string[]>([]);

if (typeof IntersectionObserver !== 'undefined') {
    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const id = entry.target.getAttribute('id');
            if (id) {
                if (entry.isIntersecting) {
                    visibleHashes.value.push(id);
                } else {
                    visibleHashes.value = visibleHashes.value.filter((hash) => hash !== id);
                }
            }
        });
    }, {
        threshold: 0
    });

    onMounted(() => {
        const headers = document.querySelectorAll('.prose h1[id], .prose h2[id], .prose h3[id], .prose h4[id], .prose h5[id], .prose h6[id]');
        headers.forEach((header) => {
            intersectionObserver.observe(header);
        });
    });

    onUnmounted(() => {
        intersectionObserver.disconnect();
    });
}
</script>

<template>
    <nav class="h-screen overflow-y-auto">
        <ul>
            <TableOfContentsItem v-for="item in toc"
                                 :item="item"
                                 :key="item.hash"
                                 :maxDepth="props.maxDepth"
                                 :visibleHashes="visibleHashes" />
        </ul>
    </nav>
</template>