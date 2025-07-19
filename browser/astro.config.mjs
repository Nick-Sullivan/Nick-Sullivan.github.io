// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import umami from "@yeskunall/astro-umami";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  integrations: [
    mdx(),
    react(),
    umami({ id: "8b3578ce-5dd5-4c43-8f86-2a6e8adcf606" }),
  ],
  markdown: {
    syntaxHighlight: "shiki",
  },
});
