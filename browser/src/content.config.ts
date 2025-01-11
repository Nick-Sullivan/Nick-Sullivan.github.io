import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    published: z.boolean(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/projects" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    published: z.boolean(),
  }),
});

export const collections = { blog, projects };
