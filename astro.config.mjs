import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  adapter: cloudflare(),
  site: "https://generussdesign.com",
  redirects: {
    "/connect": "https://generuss.com/connect",
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
