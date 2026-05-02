// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import critters from "astro-critters";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    mdx(),
    react(),
    critters(),
  ],
  markdown: {
    syntaxHighlight: "shiki",
  },
});
