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
        <h1 class="font-light text-2xl leading-snug">
          <strong style="display: block;">
            Eli Crow is a
            <span style="display: block; margin: 0.35ch 0">
              <span class="gooey-text"><span class="gooey-text-inner">designer and developer</span></span>
            </span>
          </strong>
          making software products for lasting benefit with
          <a href="https://sep.com" target="_blank" rel="noopener">sep.com</a>
        </h1>
        <hr class="my-6 border-gray-200">
        <p class="text-gray-300">This site is for interactive experiments and thoughts on design and development. I am happily employed.</p>
      </div>
    </div>

    <div class="card-group">
      <Card type="interactive">
        <Crow class="flex-1" :scale="0.65" />
      </Card>

      <!-- <LinkContainer tag="article" class="card is-link is-bones-live">
        <img class="card-image-typography" src="/assets/typography.svg" />

        <div class="card-padding">
          <h2 class="card-title is-high-leading"><span contenteditable class="gooey-text is-subtle"><span class="gooey-text-inner">A call for a typographic box model that actually makes sense</span></span></h2>
          <p><time>2021</time></p>
        </div>
        <a data-main-link href="#" class="card-corner-decoration is-page" aria-label="Read Article" @click.stop>
          <Icon icon="chevronRight" />
        </a>
      </LinkContainer> -->

      <AlleyOoperCard />

      <Card type="external" href="https://bones.live" class="p-8" tag="article">
        <img class="h-32 mb-8 self-start" src="/assets/bones-live-dice.svg" />
        <h2 class="text-xl font-light text-gray-900 mb-4">
          Bones.live, a multiplayer dice box. Throw the bones. Embrace your destiny.
        </h2>
        <p><time>2021</time></p>
      </Card>

      <Card>
        <LightboxPreview
          title="Yikes Dog – Blender"
          :images="[
            {
              key: 0, 
              src: '/assets/dog-yikes.jpg', 
              thumbnailSrc: '/assets/dog-yikes-thumb.jpg', 
              alt: 'A satin blue dog, beset by bones. The word “Yikes!” explodes vibrantly in the foreground. He gives a sidelong stare, frightened, as if to say “That is not my problem.”'
            },
            {
              key: 1, 
              src: '/assets/dog-boned.jpg', 
              thumbnailSrc: '/assets/dog-boned-thumb.jpg', 
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
        <p>Imagine this is one of the 30 blog posts I never finished.</p>
      </Card>
      <Card class="p-8">
        <p>Pretend there is an impressive-looking chart here to show off my visualization skills.</p>
      </Card>
      <Card class="p-8">
        <p>This is where my resumé would go if I had one.</p>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.site {
  --site-padding-top: 52px;
  --site-columns: repeat(auto-fit, minmax(300px, 1fr));
  display: grid;
  grid-template-columns: var(--site-columns);
  gap: 20px;
  padding-top: var(--site-padding-top);
}
@media screen and (max-width: 700px) {
  .site {
    --site-padding-top: 40px;
    display: block;
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
}
@media screen and (max-width: 700px) {
  .intro-content {
    padding-bottom: var(--site-padding-top);
  }
}

.card-group {
  grid-column: 2 / -1;
  display: grid;
  grid-template-columns: var(--site-columns);
  gap: inherit;
}
@media screen and (max-width: 700px) {
  .card-group {
    padding-right: 0;
  }
}

.space {
  flex: 1 0 0;
}

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

.thumbnail:hover {
  filter: brightness(1.2);
}
</style>
