<script setup>
import {onMounted} from 'vue'

onMounted(() => {
    window.scrollTo(0,0)
})
</script>


<template>
    <div class="
        bg-gray-50 self-stretch flex flex-col relative flex-1
        md:fixed md:inset-0 md:flex-row md:gap-8 md:p-8">

        <!-- 
        HACK: translate3d: maddening iOS issue where z-index unpredictably doesn't work unless you got here from the homepage. 
        I think it is because of the way ios treats 3d canvases in the stacking order. Basically, they act as if they have 3d transforms,
        so z-index is not respected, and you must use the z dimension to achieve the desired effect.
        -->
        <header 
            :style="{transform: 'translate3d(0,0,10px)'}"
            class="
                flex flex-col flex-grow relative z-10 w-full
                p-8 coarse:pt-4 rounded-t-3xl bg-white dark:bg-gray-100 
                md:p-4 md:max-w-xs md:!bg-transparent md:dark:!bg-transparent md:rounded-none md:flex-auto md:self-center">

            <!-- draggable indicator -->
            <div class="fine:hidden md:hidden h-[0.3333rem] mb-2 w-12 self-center bg-gray-100 dark:bg-gray-200 rounded-full" />

            <slot name="description"/>
        </header>

        <main
            :style="{flex: '1 0 20rem'}"
            class="
                sticky top-6 flex flex-col order-first justify-center m-6 my-6 min-h-0 min-w-0
                md:flex-shrink md:h-auto md:m-0 md:p-8 md:top-auto md:flex-grow md:bg-white md:dark:bg-gray-100 md:relative md:rounded-sm md:order-none">
    
            <suspense>
                <template #default>
                    <div class="flex-1 min-h-0 min-w-0 relative flex flex-col items-center justify-center md:h-full">
                        <slot name="content"/>
                    </div>
                </template>

                <template #fallback>
                    <div class="flex-1 flex items-center justify-center">
                        <Icon icon="loading" class="text-xl animate-spin text-gray-300"/>
                    </div>
                </template>
            </suspense>
        </main>

    </div>
</template>