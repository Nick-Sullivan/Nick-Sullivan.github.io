import { defineCollection, z, type CollectionEntry } from "astro:content";
import { glob } from "astro/loaders";

const blogSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  published: z.boolean(),
});
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md*", base: "./src/data/blog" }),
  schema: blogSchema,
});
const projectsSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  published: z.boolean(),
});
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md*", base: "./src/data/projects" }),
  schema: projectsSchema,
});

export type Blog = z.infer<typeof blogSchema>;
export type Project = z.infer<typeof projectsSchema>;
export type BlogEntry = CollectionEntry<"blog">;
export type ProjectsEntry = CollectionEntry<"projects">;
export const collections = { blog, projects };
