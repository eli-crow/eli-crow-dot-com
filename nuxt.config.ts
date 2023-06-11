import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  css: ["~/global.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    // this appears to be breaking things...
    // pageTransition: {
    //   name: "fade",
    //   mode: "out-in",
    // },
    head: {
      bodyAttrs: {
        class:
          "h-full flex flex-col leading-normal bg-gray-50 transition text-base",
      },
      link: [
        // favicon
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon/favicon-32x32",
          sizes: "32x32",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon/favicon-16x16",
          sizes: "16x16",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-touch-icon",
        },
        {
          rel: "manifest",
          href: "/favicon/site.webmanifest",
        },
        {
          rel: "mask-icon",
          href: "/favicon/safari-pinned-tab.svg",
          color: "#5bbad5",
        },

        // typekit
        {
          rel: "preconnect",
          href: "https://use.typekit.net",
        },
        {
          rel: "preload",
          href: "https://use.typekit.net/gwp5zpe.css",
          as: "style",
          onload: "this.onload=null;this.rel='stylesheet'",
        },
      ],
      meta: [
        // misc
        { name: "msapplication-TileColor", content: "#00aba9" },
        { name: "theme-color", content: "#ffffff" },
      ],
      script: [
        {
          hid: "gtag",
          src: "https://www.googletagmanager.com/gtag/js?id=G-VJ6EPKW4FM",
          async: true,
          defer: true,
        },
        {
          hid: "set-theme-early",
          innerHTML: /* js */ `
  // set the color theme based on localstorage before loading the app to avoid a flash of white when a user prefers a dark theme
  const stored = localStorage.theme;
  const preferred = window?.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const otherwise = "dark";

  const theme = stored ?? preferred ?? otherwise;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  `,
        },
      ],
    },
  },
});
