<template>
    <transition name="fade">
        <slot/>
    </transition>
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: 1.8s cubic-bezier(0.075, 0.82, 0.165, 1);
  transition-property: opacity;
}

.fade-leave-active {
  transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  transition-property: opacity;
  pointer-events: none;
}



.lift-enter-from {
  transform: translateY(10%);
  opacity: 0;
}

.lift-leave-to {
  transform: translateY(10%);
  opacity: 0;
}

.lift-enter-active {
  transition: 0.75s cubic-bezier(0.075, 0.82, 0.165, 1);
  transition-property: transform, opacity;
}

.lift-leave-active {
  transition: 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
  transition-property: transform, opacity;
  position: absolute;
  pointer-events: none;
}

.lift-move {
  transition: 0.75s cubic-bezier(0.075, 0.82, 0.165, 1);
  transition-property: transform;
}
</style>