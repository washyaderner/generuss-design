import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const timelinePhase = z.object({
  phase: z.number(),
  title: z.string(),
  subtitle: z.string().optional(),
  milestones: z.array(z.string()).default([]),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    excerpt: z.string(),
    metaDescription: z.string().optional(),
    publishDate: z.string(),
    updatedDate: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().default("/images/placeholder.svg"),
    layout: z.enum(["default", "timeline"]).default("default"),
    timeline: z.array(timelinePhase).optional(),
  }),
});

export const collections = { blog };
