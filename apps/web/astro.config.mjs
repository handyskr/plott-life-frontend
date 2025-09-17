import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const liveURL = "https://life.plott.co.kr";
const { NODE_ENV } = process.env;
const env = loadEnv(NODE_ENV, process.cwd(), "");

console.log(env);

const { SITE, REDIS_URL } = env;

export default defineConfig({
  site: SITE,
  integrations: [
    preact({ compat: true }),
    sitemap({
      filter: (page) =>
        page.startsWith(liveURL) &&
        !page.startsWith(`${liveURL}/auth`) &&
        !page.startsWith(`${liveURL}/admin`),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  session: {
    driver: "redis",
    options: {
      url: REDIS_URL,
    },
    cookie: {
      name: "session",
      sameSite: "lax",
      httpOnly: true,
      secure: NODE_ENV === "production",
    },
  },
  build: {
    assetsPrefix: "/assets",
  },
});
