import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishDate: z.string(),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().default("/images/placeholder.svg"),
    layout: z.enum(["default", "timeline"]).default("default"),
  }),
});

export const collections = { blog };
