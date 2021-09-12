<script setup>
import Crow from './components/Crow/Crow.vue';
import Card from './components/Card.vue';
import LightboxPreview from "./components/LightboxPreview.vue";
import AlleyOoperCard from './components/AlleyOoper/AlleyOoperCard.vue';
import GLTFViewer from './components/GLTFViewer/GLTFViewer.vue';
import TheSVGFilters from './components/TheSVGFilters.vue'
</script>

<template>
  <TheSVGFilters v-once />

  <div class="site py-12">

    <div class="px-8 pb-12 sm:py-0">
      <div class="sm:sticky sm:top-12">
        <h1 class="font-light text-2xl leading-[1.42] text-gray-500">
          <strong style="display: block;">
            Eli Crow is a
            <span class="block my-[0.7ch]">
              <span class="gooey-text"><span class="gooey-text-inner">designer and developer</span></span>
            </span>
          </strong>
          making software products for lasting benefit with
          <a href="https://sep.com" target="_blank" rel="noopener">sep.com</a>
        </h1>

        <hr class="my-8 border-t-2 border-gray-100">

        <p class="text-gray-400 leading-relaxed">This site is for interactive experiments and thoughts on design and development. I am happily employed.</p>
      </div>
    </div>

    <div class="card-group">
      <Card type="interactive">
        <Crow class="flex-1" :scale="0.65" />
      </Card>

      <AlleyOoperCard />

      <Card type="external" href="https://bones.live" class="p-8 group" tag="article">
        <div class="card-gradient-purple absolute inset-0 z-1 transition duration-[1s] transform scale-125 group-hover:scale-100"/>
        <div class="relative z-10">
          <img class="h-32 mb-8 self-start" src="/assets/bones-live-dice.svg" />
          <h2 class="text-xl leading-snug font-light text-gray-900 mb-4">
            Bones.live, a multiplayer dice box. Throw the bones. Embrace your destiny.
          </h2>
          <p><time>2021</time></p>
        </div>
      </Card>

      <Card>
        <div class="p-8">
          <LightboxPreview
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
            v-slot="{images}">

            <h2 class="text-xl leading-snug font-light text-gray-900 mb-1 mt-8">
              Yikes Dog
            </h2>
            <p><time>2021, Blender</time></p>

            <div class="absolute bottom-0 right-0 text-lg text-gray-300 group-hover:text-gray-900 cursor-default mix-blend-screen p-8 flex items">
              <span class="mr-2 text-lg leading-none">{{images.length}}</span>
              <Icon icon="image" />
            </div>
          </LightboxPreview>
        </div>
      </Card>

      <Card>
        <GLTFViewer class="h-64" gltf="/assets/ute.glb"/>
        <div class="p-8 pt-0">
          <h2 class="text-xl leading-snug font-light text-gray-900 mb-1">
            Ute
          </h2>
          <p><time>2021, Blender</time></p>
        </div>
        <div class="absolute bottom-0 right-0 text-lg text-gray-300 group-hover:text-gray-900 cursor-default mix-blend-screen p-8 flex items">
          <Icon icon="threeD" />
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
  --site-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
@screen sm {
  .site {
    display: grid;
    grid-template-columns: var(--site-columns);
  }
}

.card-group {
  grid-column: 2 / -1;
  display: grid;
  grid-template-columns: var(--site-columns);
  gap: inherit;
}

.card-gradient-purple {
  background-image: radial-gradient(32rem 32rem at 6rem 6rem, transparent 50%, theme('colors.purple.DEFAULT'));
  transform-origin: 6rem 6rem;
}
</style>
