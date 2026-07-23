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

// AEO layer (pharallax recipe): insights are pillars, guides are their
// children. Every guide names one parent pillar and one free tool.
const insights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    question: z.string(),
    directAnswer: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    parent: z.string(),
    relatedTool: z.string(),
    relatedToolName: z.string(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
  }),
});

export const collections = { blog, insights, guides };
