<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
    title: string,
    subtitle: string,
    description: string,
    tools: string,
    time: string,
}>()

onMounted(() => {
    window.scrollTo(0, 0)
})
</script>

<template>
    <div class="
    bg-gray-50 self-stretch flex flex-col relative flex-1
    md:fixed md:inset-0 md:flex-row md:gap-8 md:p-8
    ">
        <!-- 
        HACK: translate3d: maddening iOS issue where z-index unpredictably doesn't work unless you got here from the homepage. 
        I think it is because of the way ios treats 3d canvases in the stacking order. Basically, they act as if they have 3d transforms,
        so z-index is not respected, and you must use the z dimension to achieve the desired effect.
    -->
        <header :style="{ transform: 'translate3d(0,0,10px)' }"
                class="
                flex flex-col flex-grow relative z-10 w-full p-8 coarse:pt-4 rounded-t-3xl bg-white dark:bg-gray-100 min-h-[calc(100vh-24rem)]
                md:p-4 md:max-w-xs md:!bg-transparent md:dark:!bg-transparent md:rounded-none md:flex-auto md:self-center md:min-h-0
                ">
            <!-- draggable indicator -->
            <div class="fine:hidden md:hidden h-[0.3333rem] mb-2 w-12 self-center bg-gray-100 dark:bg-gray-200 rounded-full" />

            <div class="flex gap-3 items-center mb-5">
                <NuxtLink to="/"
                          title="Back"
                          class="icon-button text-gray-800 flex items-center justify-center p-4 -m-4 -mr-2 text-lg">
                    <Icon icon="chevronLeft" />
                </NuxtLink>
                <h1
                    class="font-light text-2xl text-gray-800 leading-[1.42] flex-1">{{ props.title }}</h1>
            </div>

            <p class="!mb-3 gooey-text text-lg">
                <span class="gooey-text-inner">{{ props.subtitle }}</span>
            </p>

            <p class="mb-6">{{ props.description }}</p>

            <p class="mb-2">
                <Icon icon="clock">Created:</Icon>&nbsp;
                <time>{{ props.time }}</time>
            </p>
            <p>
                <Icon icon="wrench">Tools used:</Icon>&nbsp;
                <span>{{ props.tools }}</span>
            </p>
        </header>

        <main class="
        sticky top-6 flex flex-[1_0_24rem] flex-col order-first justify-center m-6 my-6 min-h-0 min-w-0 
        md:flex-shrink md:h-auto md:m-0 md:p-8 md:top-auto md:flex-grow md:bg-white md:dark:bg-gray-100 md:relative md:rounded-sm md:order-none
        ">
            <ClientOnly>
                <Suspense>
                    <template #default>
                        <div class="flex-1 min-h-0 min-w-0 relative flex flex-col items-center justify-center md:h-full">
                            <slot />
                        </div>
                    </template>

                    <template #fallback>
                        <Spinner />
                    </template>
                </Suspense>

                <template #fallback>
                    <Spinner />
                </template>
            </ClientOnly>
        </main>
    </div>
</template>