<script setup>
import { ref } from "vue"

const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    href: {
        type: String,
        default: null
    },
    tag: {
      type: String,
      default: 'div'
    }
})

const link = ref()

function handleClick(e) {
  if (props.type === 'external'){
    link.value.click()
    e.preventDefault()
  }
}

const linkClasses = props.type === 'external' || props.type === 'internal'
  ? 'hover:ring-1 hover:ring-gray-100 dark:hover:ring-gray-200 ring-inset'
  : ''
</script>

<template>
    <component
      :is="props.tag" 
      :class="`relative flex flex-col bg-white dark:bg-gray-100 sm:h-[520px] overflow-hidden group sm:rounded-sm transition ${linkClasses}`" 
      @click="handleClick"
    >
        <transition name="fade">
            <suspense>
                <template #default>
                    <slot/>
                </template>
                <template #fallback>
                    <div class="loading"/>
                </template>
            </suspense>
        </transition>

        <div 
            v-if="props.type === 'interactive'" 
            class="absolute bottom-0 right-0 text-lg text-gray-300 group-hover:text-gray-900 cursor-default mix-blend-multiply dark:mix-blend-screen p-8 pointer-events-none">
            <Icon icon="cursor" />
        </div>
        <div 
            v-else-if="props.type === '3d'" 
            class="absolute bottom-0 right-0 text-lg text-gray-300 group-hover:text-gray-900 cursor-default mix-blend-multiply dark:mix-blend-screen p-8 flex items">
            <Icon icon="threeD" />
        </div>
        <a 
            v-else-if="props.type === 'external'"
            :href="href"
            ref="link"
            target="_blank"
            rel="noopener"
            class="absolute bottom-0 right-0 text-lg text-gray-300 group-hover:text-gray-900 cursor-default mix-blend-multiply dark:mix-blend-screen p-8"
            aria-label="Visit Site"
            @click.stop>
            <Icon icon="externalLink" />
        </a>
    </component>
</template>

<style scoped>
@keyframes loading {
    from {
      background: theme('colors.gray.100');
    }
    to {
      background: theme('colors.gray.50');
    }
}
.loading {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255, 0.05);
    animation: loading 0.5s ease-out infinite alternate both;
    animation-delay: 600ms;
}
</style>