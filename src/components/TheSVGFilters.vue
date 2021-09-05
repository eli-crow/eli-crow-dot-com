<template>
    <!-- Filter: https://css-tricks.com/gooey-effect/ -->
    <svg style="visibility: hidden; position: absolute;" width="0" height="0">
      <defs>
        <filter
          v-for="([name, color]) in [['blue', 'hsla(176, 66%, 54%, 1)'], ['black', 'hsla(216, 16%, 4%, 1)']]"
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