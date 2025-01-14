export default defineNuxtConfig({
  components: true,
  imports: {
    autoImport: true,
  },

  devtools: { enabled: false },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  ssr: false,
  pages: true,
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@nuxt/test-utils/module",
    "@vueuse/nuxt"
  ],
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
  css: ["~/assets/scss/_general.scss"],

  tailwindcss: {
    cssPath: "../assets/css/tailwind.css",
    configPath: "tailwind.config",
    exposeConfig: { level: 1 },
    viewer: true,
  },
  plugins: ["~/plugins/websocket.client.ts"],
  app: {
    head: {
      title: "This is my test ",
      htmlAttrs: { lang: "de" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: "index" },
        { name: "theme-color", content: "#fff" },
        {
          name: "google-site-verification",
          content: "",
        },
        {
          name: "description",
          content:
            "this is my test",
        },
        { name: "keywords", content: "comment" },
        { name: "author", content: "" },
        { property: "og:title", content: "Welcome / acb.studio" },
        { property: "og:site_name", content: "acb.studio" },
        { property: "og:type", content: "website" },
       
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [],
    },
  },

  compatibilityDate: "2024-12-09",
});
