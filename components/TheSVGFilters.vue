<template>
  <!-- Filter: https://css-tricks.com/gooey-effect/ -->
  <svg width="0" height="0" class="invisible absolute text-teal pointer-events-none">
    <defs>
      <filter id="filter-goo">
        <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="dilate" />
        <feGaussianBlur in="dilate" stdDeviation="4" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feFlood flood-color="rgba(15, 213, 189, 1)" result="flood" />
        <feComposite in="flood" in2="goo" operator="in" result="merged" />
        <feComposite in="SourceGraphic" in2="merged" operator="atop" />
      </filter>
      <filter id="filter-goo-dark">
        <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="dilate" />
        <feGaussianBlur in="dilate" stdDeviation="4" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
        <feFlood flood-color="rgba(3, 208, 183, 1)" result="flood" />
        <feComposite in="flood" in2="goo" operator="in" result="merged" />
        <feComposite in="SourceGraphic" in2="merged" operator="atop" />
      </filter>
    </defs>
  </svg>
</template>

<style>
/* inner added to cope with safari bug */
.gooey-text {
  filter: url(#filter-goo);
  margin: -0.5em calc(0.16em - 0.5em);
  padding: 0.5em;
  box-decoration-break: clone;
}

.dark .gooey-text {
  filter: url(#filter-goo-dark);
}

.gooey-text-inner {
  @apply decoration-clone px-[0.16em] text-gray-50 bg-teal;
}

.gooey-text-inner::selection {
  @apply bg-yellow;
}
</style>