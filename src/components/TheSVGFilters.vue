<template>
    <!-- Filter: https://css-tricks.com/gooey-effect/ -->
    <svg style="visibility: hidden; position: absolute;" width="0" height="0">
      <defs>
        <filter
          v-for="([name, color]) in [['blue', 'rgba(3, 208, 183, 1)'], ['black', 'hsla(216, 16%, 4%, 1)']]"
          :key="name"
          :id="`filter-goo-${name}`">
          <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="dilate" />
          <feGaussianBlur in="dilate" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feFlood :flood-color="color" result="flood" />
          <feComposite in="flood" in2="goo" operator="in" result="merged" />
          <feComposite in="SourceGraphic" in2="merged" operator="atop" />
        </filter>
      </defs>
    </svg>
</template>

<style>
/* inner added to cope with safari bug */
.gooey-text {
  filter: url(#filter-goo-blue);
  margin: -0.5em calc(0.16em - 0.5em);
  padding: 0.5em;
  box-decoration-break: clone;
}
.gooey-text-inner {
  @apply decoration-clone px-[0.16em] text-gray-50 bg-teal;
}
.gooey-text.is-subtle {
  @apply -my-2 mx-[calc(-0.16em-0.5em)];
  filter: url(#filter-goo-black);
}
.gooey-text.is-subtle .gooey-text-inner {
  @apply bg-gray-50 text-gray-900;
}
.gooey-text-inner::selection {
  @apply bg-yellow;
}
</style>