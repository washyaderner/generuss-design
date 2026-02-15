import { createClient } from "contentful";

let _client: ReturnType<typeof createClient> | null = null;

export function isConfigured(): boolean {
  return !!(
    import.meta.env.CONTENTFUL_SPACE_ID &&
    import.meta.env.CONTENTFUL_DELIVERY_TOKEN
  );
}

function getClient() {
  if (_client) return _client;

  const space = import.meta.env.CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!space || !accessToken) {
    throw new Error(
      "Missing CONTENTFUL_SPACE_ID or CONTENTFUL_DELIVERY_TOKEN. Add them to .env.",
    );
  }

  _client = createClient({ space, accessToken });
  return _client;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: {
    url: string;
    title: string;
    width: number;
    height: number;
  };
  publishDate: string;
  tags: string[];
}

function parsePost(entry: any): BlogPost {
  const fields = entry.fields;
  const asset = fields.headerImage;
  const image = asset?.fields?.file;

  return {
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.summary || "",
    content: fields.content || "",
    featuredImage: {
      url: image ? `https:${image.url}` : "/images/placeholder.webp",
      title: asset?.fields?.title || fields.title,
      width: image?.details?.image?.width || 1200,
      height: image?.details?.image?.height || 630,
    },
    publishDate: entry.sys.createdAt,
    tags: [],
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const client = getClient();
  const entries = await client.getEntries({
    content_type: "blogPost",
    order: ["-sys.createdAt"],
  });

  return entries.items.map(parsePost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const client = getClient();
  const entries = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  });

  if (!entries.items.length) return null;
  return parsePost(entries.items[0]);
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
