import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const liveURL = "https://life.plott.co.kr";
const { SITE } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

export default defineConfig({
  site: SITE,
  integrations: [
    preact(),
    sitemap({
      filter: (page) =>
        page.startsWith(liveURL) &&
        !page.startsWith(`${liveURL}/theme`),
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  build: {
    assetsPrefix: "/assets",
  },
});
