import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "../lib/blog";

export async function GET(context: APIContext) {
  const posts = await getAllPosts();

  return rss({
    title: "generuss design - Blog",
    description:
      "Thoughts on web design, AI automation, and building things that work.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishDate),
      description: post.excerpt,
      link: `/blog/${post.slug}`,
    })),
    customData: "<language>en-us</language>",
  });
}
