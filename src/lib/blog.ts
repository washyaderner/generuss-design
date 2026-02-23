import { getCollection, getEntry, render } from "astro:content";

export interface TimelinePhase {
  phase: number;
  title: string;
  subtitle?: string;
  milestones: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: string;
  tags: string[];
  featuredImage: string;
  layout: "default" | "timeline";
  timeline?: TimelinePhase[];
}

function toPost(entry: any): BlogPost {
  return {
    slug: entry.id,
    title: entry.data.title,
    excerpt: entry.data.excerpt,
    publishDate: entry.data.publishDate,
    tags: entry.data.tags,
    featuredImage:
      !entry.data.featuredImage ||
      entry.data.featuredImage === "/images/placeholder.svg"
        ? `/images/blog/${entry.id}-og.svg`
        : entry.data.featuredImage,
    layout: entry.data.layout,
    timeline: entry.data.timeline,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const entries = await getCollection("blog");
  return entries
    .map(toPost)
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    );
}

export async function getPostBySlug(slug: string) {
  const entry = await getEntry("blog", slug);
  if (!entry) return null;
  return { post: toPost(entry), entry };
}

export async function renderPost(entry: any) {
  return render(entry);
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
