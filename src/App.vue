<script setup>
import Crow from './components/Crow/Crow.vue';
import LinkContainer from './components/LinkContainer.vue';
import LightboxPreview from "./components/LightboxPreview.vue";
import AlleyOoperCard from './components/AlleyOoper/AlleyOoperCard.vue';
</script>

<template>
  <div class="App">
    <!-- Filter: https://css-tricks.com/gooey-effect/ -->
    <svg v-once style="visibility: hidden; position: absolute;" width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
        <filter
          v-for="([name, color]) in [['blue', '#1ed2c6'], ['black', '#080a0d']]"
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

    <div id="app" class="site">
      <div class="intro">
        <div class="intro-content">
          <h1 class="title">
            <strong style="display: block;">
              Eli Crow is a
              <span style="display: block; margin: 0.35ch 0">
                <span class="gooey-text"><span class="gooey-text-inner">designer and developer</span></span>
              </span>
            </strong>
            making software products for lasting benefit with
            <a href="https://sep.com" target="_blank" rel="noopener">sep.com</a>
          </h1>
          <hr>
          <p>This site is for interactive experiments and thoughts on design and development. I am happily employed.</p>
        </div>
      </div>

      <div class="card-group">
        <div class="card">
          <div class="crow-container">
            <Crow class="crow" :scale="0.65" />
          </div>
          <div class="card-corner-decoration">
            <Icon icon="cursor" />
          </div>
        </div>

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

        <LinkContainer tag="article" class="card is-link is-bones-live">
          <img class="card-image-bones-live" src="/assets/bones-live-dice.svg" />

          <div class="card-padding">
            <h2 class="card-title">Bones.live, a multiplayer dice box. Throw the bones. Embrace your destiny.</h2>
            <p><time>2021</time></p>
          </div>
          <a
            href="https://bones.live"
            target="_blank"
            rel="noopener"
            class="card-corner-decoration is-page"
            aria-label="Visit Site"
            data-main-link
            @click.stop>
            <Icon icon="externalLink" />
          </a>
        </LinkContainer>

        <div class="card">
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
        </div>

        <div class="card is-fake">
          <p>Imagine this is one of the 30 blog posts I never finished.</p>
        </div>
        <div class="card is-fake">
          <p>Pretend there is an impressive-looking chart here to show off my visualization skills.</p>
        </div>
        <div class="card is-fake">
          <p>Some day I'll post my resumé. Today is not that day.</p>
        </div>
      </div>
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
.title {
  font-size: 32px;
  font-weight: 300;
  line-height: 1.4;
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
.card-image-typography {
  padding-top: var(--content-padding);
  padding-left: var(--content-padding);
  height: 164px;
  object-fit: cover;
  object-position: left;
}
.card-image-bones-live {
  padding: var(--content-padding) var(--content-padding) 0;
  width: 14rem;
  object-fit: cover;
  object-position: left;
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
  box-decoration-break: clone;
  padding: 0 0.16em;
  color: var(--surface-0);
  background-color: var(--teal);
}
.gooey-text.is-subtle {
  filter: url(#filter-goo-black);
  margin: -0.5em calc(-0.16em - 0.5em);
}
.gooey-text.is-subtle .gooey-text-inner {
  background-color: var(--surface-0);
  color: var(--text-strong);
}
.gooey-text-inner::selection {
  background-color: var(--yellow);
}

.crow-container {
  position: relative;
  flex: 1 0 0;
}
.crow {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

p {
  line-height: 1.75rem;
  font-size: 18px;
  opacity: 0.65;
}

hr {
  margin: 1.5rem 0;
  border: 0;
  height: 2px;
  background-color: var(--surface-2);
}

.thumbnail:hover {
  filter: brightness(1.2);
}
</style>
