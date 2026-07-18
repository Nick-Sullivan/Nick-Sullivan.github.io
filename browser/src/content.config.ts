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
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md*", base: "./src/data/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      description: z.string(),
      published: z.boolean(),
      image: image().optional(),
      imageFit: z.enum(["cover", "contain"]).optional(),
    }),
});

export type Blog = z.infer<typeof blogSchema>;
export type BlogEntry = CollectionEntry<"blog">;
export type ProjectsEntry = CollectionEntry<"projects">;
export type Project = ProjectsEntry["data"];
export const collections = { blog, projects };
