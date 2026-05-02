// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import critters from "astro-critters";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.google(),
      name: "PT Serif",
      cssVariable: "--font-pt-serif",
      display: "block",
    },
    {
      provider: fontProviders.google(),
      name: "Caveat",
      cssVariable: "--font-caveat",
      display: "block",
    },
  ],
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
