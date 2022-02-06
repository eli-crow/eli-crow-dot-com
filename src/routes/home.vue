<script setup lang="ts">
import Card from '../components/Card.vue'
import Icon from '../components/Icon/Icon.vue'
import CrowCard from '../components/Crow/CrowCard.vue'
import LightboxCard from "../components/Lightbox/LightboxCard.vue"
import AlleyOoperCard from '../components/AlleyOoper/AlleyOoperCard.vue'
import TheThemeSettings from '../components/TheThemeSettings.vue'
import PlayOverlay from '../components/PlayOverlay.vue'
import OuijaSVG from './ouija/OuijaSVG.vue'
</script>

<template>
  <div class="site w-full max-w-[1440px] py-8">
    <header class="px-8 pb-12 sm:py-0">
      <div class="sm:sticky sm:top-12">
        <h1 class="font-light text-2xl leading-[1.42] text-gray-800">
          <strong class="block">
            Eli Crow is a
            <span class="block my-[0.7ch]">
              <span class="gooey-text">
                <span class="gooey-text-inner">designer and developer</span>
              </span>
            </span>
          </strong>
          making software products for lasting benefit with
          <a
            href="https://sep.com"
            target="_blank"
            rel="noopener"
          >sep.com</a>
        </h1>

        <div class="mt-5 mb-6 border-t-2 border-gray-100" />

        <p
          class="text-gray-500 leading-relaxed mb-6"
        >This site is a playground for interactive experiments and thoughts on design and development. I am happily employed.</p>

        <TheThemeSettings />
      </div>
    </header>

    <main class="card-group">
      <CrowCard :style="{ gridColumn: '1 / -2' }" />

      <Card pressable link tag="article">
        <div class="relative p-8 pb-0 pr-0 cursor-default">
          <img
            class="object-contain object-right h-72 ml-[-2rem] max-w-none w-[calc(100%+2rem)]"
            src="/assets/bead-maze-thumb.webp"
            draggable="false"
          />
          <PlayOverlay icon="threeD" />
        </div>
        <div class="p-8 pt-0">
          <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">Bead Maze</h2>
          <p>
            <time>2022</time>
          </p>
        </div>
        <router-link to="/bead" class="card-icon flex items-center" title="View 3d Model">
          <span class="mr-3 sm:hidden">Interact</span>
          <Icon icon="threeD" />
        </router-link>
      </Card>

      <Card pressable link tag="article">
        <div class="relative p-8 pb-0 cursor-default flex items-center">
          <OuijaSVG class="h-72 w-auto" />
        </div>
        <div class="p-8 pt-0">
          <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">Ouija</h2>
          <p>
            <time>2022</time>
          </p>
        </div>
        <router-link to="/ouija" class="card-icon flex items-center" title="Call for contact">
          <span class="mr-3 sm:hidden">Interact</span>
          <Icon icon="cursor" />
        </router-link>
      </Card>

      <Card pressable link tag="article">
        <div class="relative p-8 pr-0 pb-0 cursor-default">
          <img
            class="object-contain object-right h-72 w-full"
            src="/assets/ute-thumb.webp"
            draggable="false"
          />
          <PlayOverlay icon="threeD" />
        </div>
        <div class="p-8 pt-0">
          <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">Ute</h2>
          <p>
            <time>2021, Blender</time>
          </p>
        </div>
        <router-link to="/ute" class="card-icon flex items-center" title="View 3d Model">
          <span class="mr-3 sm:hidden">Interact</span>
          <Icon icon="threeD" />
        </router-link>
      </Card>

      <Card pressable link class="p-8" tag="article">
        <div class="h-72 relative mb-6 cursor-default">
          <img
            class="object-contain w-full h-full"
            src="/assets/losing-sleep-thumb.webp"
            draggable="false"
          />
          <PlayOverlay icon="threeD" />
        </div>
        <h2 class="text-xl leading-snug font-light text-gray-900 mb-2">Losing Sleep</h2>
        <p>
          <time>2021, Blender</time>
        </p>
        <router-link to="/losing-sleep" class="card-icon flex items-center" title="View 3d Model">
          <span class="mr-3 sm:hidden">Interact</span>
          <Icon icon="threeD" />
        </router-link>
      </Card>

      <Card pressable link class="p-8 group" tag="article">
        <Icon
          class="text-[8rem] w-auto mb-10 self-start text-purple dark:text-gray-900"
          icon="bonesDotLive"
        />
        <h2
          class="text-xl leading-snug font-light text-gray-900 mb-2"
        >Bones.live, a multiplayer dice box. Throw the bones. Embrace your destiny.</h2>
        <p>
          <time>2021</time>
        </p>
        <a class="card-icon" href="https://bones.live" target="_blank">
          <Icon icon="externalLink">Visit Site</Icon>
        </a>
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

      <AlleyOoperCard />

      <Card class="p-8">
        <p class="text-gray-500">Imagine this is one of the 30 blog posts I never finished.</p>
        <div class="card-icon">
          <Icon icon="poo" />
        </div>
      </Card>

      <Card class="p-8">
        <p
          class="text-gray-500"
        >Pretend there is an impressive-looking chart here to show off my visualization skills.</p>
        <div class="card-icon">
          <Icon icon="poo" />
        </div>
      </Card>

      <Card class="p-8">
        <p class="text-gray-500">This is where my resumé would go if I had one.</p>
        <div class="card-icon">
          <Icon icon="poo" />
        </div>
      </Card>
    </main>
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
