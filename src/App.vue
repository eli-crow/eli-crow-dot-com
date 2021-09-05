<script setup>
import Crow from './components/Crow/Crow.vue';
import Card from './components/Card.vue';
import LightboxPreview from "./components/LightboxPreview.vue";
import AlleyOoperCard from './components/AlleyOoper/AlleyOoperCard.vue';
import TheSVGFilters from './components/TheSVGFilters.vue'
</script>

<template>
  <TheSVGFilters v-once />

  <div class="site">

    <div class="intro">
      <div class="intro-content">
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
          v-slot="{images, open}">
          <img
            class="thumbnail"
            v-for="image in images"
            :key="image.key"
            :src="image.thumbnailSrc"
            :alt="image.alt"
            @click="open(image.key)" />
        </LightboxPreview>
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
  --site-padding-top: 40px;
  --site-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
@screen sm {
  .site {
    --site-padding-top: 52px;
    display: grid;
    grid-template-columns: var(--site-columns);
    padding-top: var(--site-padding-top);
  }
}

.intro {
  padding-left: 32px;
  padding-right: 32px;
}
.intro-content {
  position: sticky;
  top: var(--site-padding-top);
  transform: translateY(-0.5rem);
  padding-bottom: var(--site-padding-top);
}
@screen sm {
  .intro-content {
    padding-bottom: 0;
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

.thumbnail:hover {
  filter: brightness(1.2);
}
</style>
