<script setup lang="ts">
import { FocusTrap } from 'focus-trap-vue';
import { watch } from "vue";

const props = defineProps<{
    isOpen?: boolean,
    title: string
}>()

const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'key', key: KeyboardEvent): void,
}>();

const focusRoot = ref<HTMLElement | null>(null);
watch(focusRoot, newValue => {
    newValue?.focus();
});

function close() {
    emit('close')
}

function handleKeyboard(e: KeyboardEvent) {
    emit('key', e)
}
</script>

<template>
    <teleport to="#overlay">
        <transition name="fade">
            <div class="overscroll-contain !fixed inset-0 bg-gray-50"
                 :style="{ willChange: 'opacity' }"
                 v-if="props.isOpen"
                 @scroll.stop.prevent.capture
                 @click="close" />
        </transition>

        <transition name="lift">
            <div
                 class="flex flex-col items-center !fixed inset-0 pointer-events-none"
                 :style="{ willChange: 'opacity, transform' }"
                 v-if="props.isOpen">
                <FocusTrap :active="props.isOpen" @deactivate="close">
                    <div
                         class="overscroll-contain w-full h-full pointer-events-auto min-h-0 outline-none flex flex-col"
                         tabindex="-1"
                         ref="focusRoot"
                         @click.stop
                         @keydown="handleKeyboard">
                        <header class="flex gap-3 items-center p-4">
                            <h2 class="title flex-1">{{ props.title }}</h2>
                            <button class="close icon-button p-4 -m-4" @click.prevent="close">
                                <Icon icon="close">Close</Icon>
                            </button>
                        </header>

                        <slot />
                    </div>
                </FocusTrap>
            </div>
        </transition>
    </teleport>
</template>