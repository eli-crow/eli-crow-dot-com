<script setup>
import Crow from './components/Crow/Crow.vue';
import Card from './components/Card.vue';
import LightboxCard from "./components/Lightbox/LightboxCard.vue";
import AlleyOoperCard from './components/AlleyOoper/AlleyOoperCard.vue';
import GLTFViewer from './components/GLTFViewer/GLTFViewer.vue';
import TheSVGFilters from './components/TheSVGFilters.vue'
import TheThemeSettings from './components/TheThemeSettings.vue'
</script>

<template>
  <TheSVGFilters v-once />

  <div class="site w-full max-w-[1440px]">

    <div class="px-8 pb-12 sm:py-0">
      <div class="sm:sticky sm:top-12">
        <h1 class="font-light text-2xl leading-[1.42] text-gray-900">
          <strong class="block">
            Eli Crow is a
            <span class="block my-[0.7ch]">
              <span class="gooey-text"><span class="gooey-text-inner">designer and developer</span></span>
            </span>
          </strong>
          making software products for lasting benefit with
          <a href="https://sep.com" target="_blank" rel="noopener">sep.com</a>
        </h1>

        <hr class="mt-5 mb-6 border-t-2 border-gray-100">

        <p class="text-gray-500 leading-relaxed mb-6">
          This site is a playground for interactive experiments and thoughts on design and development. I am happily employed.
        </p>

        <TheThemeSettings />
      </div>
    </div>

    <div class="card-group">
      <Card type="interactive" :style="{gridColumn: '1 / -2'}">
        <Crow class="flex-1 min-h-[480px]" :scale="0.65" />
      </Card>

      <AlleyOoperCard />

      <Card type="external" href="https://bones.live" class="p-8 group" tag="article">
        <div class="relative z-10">
          <Icon class="text-[8rem] w-auto mb-10 self-start text-purple dark:text-gray-900" icon="bonesDotLive"/>
          <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">
            Bones.live, a multiplayer dice box. Throw the bones. Embrace your destiny.
          </h2>
          <p><time>2021</time></p>
        </div>
      </Card>


      <LightboxCard
        title="Yikes Dog – Blender"
        :images="[
          {
            key: 0, 
            src: '/assets/dog-yikes.webp', 
            thumbnailSrc: '/assets/dog-yikes-thumb.webp', 
            alt: 'A satin blue dog, beset by bones. The word “Yikes!” explodes vibrantly in the foreground. He gives a sidelong stare, frightened, as if to say “That is not my problem.”'
          },
          {
            key: 1, 
            src: '/assets/dog-boned.webp', 
            thumbnailSrc: '/assets/dog-boned-thumb.webp', 
            alt: 'A satin blue dog peers down at you, desperate. Two bones cross behind him like the Jolly Roger. The word “Boned!” floats before him. He leans back, resigned to his fate.' 
          },
        ]"
      />

      <Card type="3d">
        <GLTFViewer class="h-64" gltf="/assets/ute-uncompressed.glb" rotate/>
        <div class="p-8 pt-0">
          <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">
            Ute
          </h2>
          <p><time>2021, Blender</time></p>
        </div>
      </Card>

      <Card class="p-8">
        <p class="text-gray-400">Imagine this is one of the 30 blog posts I never finished.</p>
      </Card>

      <Card class="p-8">
        <p class="text-gray-400">Pretend there is an impressive-looking chart here to show off my visualization skills.</p>
      </Card>

      <Card class="p-8">
        <p class="text-gray-400">This is where my resumé would go if I had one.</p>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.site {
  gap: 20px;
}
.card-group {
  display: flex;
  flex-direction: column;
  gap: inherit;
}
@screen sm {
  .site {
    --site-columns: repeat(auto-fit, minmax(280px, 1fr));
    display: grid;
    grid-template-columns: var(--site-columns);
  }
  .card-group {
    grid-column: 2 / -1;
    display: grid;
    grid-template-columns: var(--site-columns);
  }
}
</style>
