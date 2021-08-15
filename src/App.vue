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
          <img class="card-image-typography" src="@/assets/typography.svg" />

          <div class="card-padding">
            <h2 class="card-title is-high-leading"><span contenteditable class="gooey-text is-subtle"><span class="gooey-text-inner">A call for a typographic box model that actually makes sense</span></span></h2>
            <p><time>2021</time></p>
          </div>
          <a data-main-link href="#" class="card-corner-decoration is-page" aria-label="Read Article" @click.stop>
            <Icon icon="chevron-right" />
          </a>
        </LinkContainer> -->

        <div class="card">
          <div class="card-padding">
            <div class="alley-ooper-group">
              <label class="alley-ooper">
                <span class="alley-ooper-label">Slider</span>
                <span class="alley-ooper-value">{{ alleyOopers[0].toFixed(0) }}</span>
                <AlleyOoper class="alley-ooper-input" v-model="alleyOopers[0]" min="0" max="100" :curve-points="[0,0, .33,0, .66,0, 1,0]" style="height: 1rem;" />
              </label>
              <label class="alley-ooper">
                <span class="alley-ooper-label">Swooper</span>
                <span class="alley-ooper-value">{{ alleyOopers[1].toFixed(0) }}</span>
                <AlleyOoper class="alley-ooper-input" v-model="alleyOopers[1]" min="0" max="100" :curve-points="[0,0, .33,1, .66,1, 1,0]" style="height: 1.5rem;" />
              </label>
              <label class="alley-ooper">
                <span class="alley-ooper-label">Swisher</span>
                <span class="alley-ooper-value">{{ alleyOopers[2].toFixed(0) }}</span>
                <AlleyOoper class="alley-ooper-input" v-model="alleyOopers[2]" min="0" max="100" :curve-points="[0,1, 1.75,1.5, -0.2,-0.15, 1,0]" style="height: 3rem;" />
              </label>
              <label class="alley-ooper">
                <span class="alley-ooper-label">Looper</span>
                <span class="alley-ooper-value">{{ alleyOopers[3].toFixed(0) }}</span>
                <AlleyOoper class="alley-ooper-input" v-model="alleyOopers[3]" min="0" max="100" :curve-points="[0,1, 2,-0.85, -0.5,-1.33, 1,1]" style="height: 3rem;" />
              </label>
            </div>
          </div>
          <div class="card-corner-decoration">
            <Icon icon="cursor" />
          </div>
        </div>

        <LinkContainer tag="article" class="card is-link is-bones-live">
          <img class="card-image-bones-live" src="@/assets/bones-live-dice.svg" />

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
            <Icon icon="external-link" />
          </a>
        </LinkContainer>

        <div class="card">

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



<script>
import Crow from '@/components/Crow/Crow.vue';
import LinkContainer from '@/components/LinkContainer.vue';
import AlleyOoper from "./components/AlleyOoper.vue";
export default {
  components: {
    Crow,
    LinkContainer,
    AlleyOoper,
  },
  data() {
    return {
      alleyOopers: [25, 50, 75, 100]
    };
  }
};
</script>



<style>
@import url("https://use.typekit.net/gwp5zpe.css");

:root {
  --surface-0: hsl(216, 24%, 4%);
  --surface-1: hsl(216, 11%, 10%);
  --surface-2: hsl(216, 8%, 14%);
  --text-weak: hsl(216, 8%, 28%);
  --text: hsl(217, 8%, 56%);
  --text-strong: hsl(216, 31%, 93%);
  --blue: hsl(209, 90%, 56%);
  --teal: hsl(176, 75%, 47%);
  --yellow: hsl(43, 100%, 50%);
  --purple: hsl(269, 54%, 49%);

  /* --surface-0: hsl(220, 16%, 93%);
  --surface-1: hsl(0, 0%, 100%);
  --surface-2: hsl(0, 0%, 81%);
  --text: hsl(217, 7%, 44%);
  --text-strong: hsl(0, 0%, 0%);
  --teal: hsl(176, 75%, 47%);
  --yellow: hsl(43, 100%, 50%); */

  --proxima-nova: "proxima-nova", "Open Sans", "Gill Sans MT", "Gill Sans",
    Corbel, Helvetica, Arial, sans-serif;
}

html {
  height: 100%;
}

::selection {
  background-color: var(--teal);
  opacity: 1 !important;
  color: var(--surface-0);
  padding-left: 4px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  display: flex;
  flex-direction: column;
  height: 100%;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: var(--proxima-nova);
  line-height: 1.3;
  color: var(--text);
  background-color: var(--surface-0);
}
body > * {
  flex: 1 0 0;
}
em {
  font-weight: 700;
}

a {
  color: var(--teal);
}
a:not(:hover) {
  text-decoration: none;
}

strong {
  color: var(--text-strong);
}

::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: var(--surface-0);
}
::-webkit-scrollbar-thumb {
  background-color: var(--text-weak);  
  border-radius: 99999px;     
  border: solid 3px var(--surface-0);
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--text);  
}
</style>

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

.card {
  --content-padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-1);
  height: 520px;
}
.card.is-fake {
  padding: var(--content-padding);
}
.card.is-link {
}
.card.is-link:hover {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.card.is-bones-live {
  background-image: linear-gradient(
    220deg,
    var(--purple) 0%,
    var(--surface-1) 30%
  );
}
.card-padding {
  padding: var(--content-padding);
}
.card-title {
  font-size: 28px;
  font-weight: 300;
  color: var(--text-strong);
  margin-bottom: 1rem;
}
.is-high-leading {
  line-height: 1.8;
}
.card-corner-decoration {
  position: absolute;
  bottom: 0;
  right: 0;
  text-decoration: none;
  font-size: 1.25rem;
  color: var(--text-weak);
  cursor: default;
  pointer-events: none;
  padding: var(--content-padding);
}
.card-corner-decoration.is-link {
  pointer-events: all;
}
.card:hover .card-corner-decoration {
  color: var(--text-strong);
}
.card-image-typography {
  padding-top: var(--content-padding);
  padding-left: var(--content-padding);
  height: 164px;
  object-fit: cover;
  object-position: left;
}
.card-image-bones-live {
  padding-right: var(--content-padding);
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

.alley-ooper-group {
  display: flex;
  flex-direction: column;
}
.alley-ooper-group > .alley-ooper:not(:last-child) {
  margin-bottom: 32px;
}
.alley-ooper {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 10px;
}
.alley-ooper-label {
  grid-column: 1;
  grid-row: 1;
}
.alley-ooper-value {
  color: var(--text-weak);
  grid-column: 2;
  grid-row: 1;
}
.alley-ooper-input {
  grid-column: 1 / span 2;
  grid-row: 2;
  margin: 4px;
  /* height: in html */
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
</style>
