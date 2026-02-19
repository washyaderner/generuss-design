---
title: "Static Sites Are Fast Sites"
excerpt: "Why I build on Astro and Cloudflare Pages instead of reaching for Next.js. The case for static-first architecture."
publishDate: "2026-02-12"
tags: ["performance", "architecture"]
featuredImage: "/images/placeholder.svg"
layout: default
---

I build portfolio and business sites on Astro with Cloudflare Pages. Not Next.js. Not WordPress. Not Webflow. Here's why.

## The JavaScript Tax

Next.js ships a React runtime to every visitor. For a SaaS dashboard with real-time features, that makes sense. For a portfolio site with a contact form? You're shipping 80KB+ of framework code so the visitor can... read text and look at images.

Astro ships zero JavaScript by default. Every script on the page is there because I put it there intentionally. The GSAP animations on generussdesign.com add ~45KB gzip. That's it. No framework overhead, no hydration, no client-side routing for a site with 3 pages.

## Edge Deployment Changes Everything

Cloudflare Pages deploys to 300+ edge locations worldwide. Your visitor in Tokyo gets the same load time as your visitor in Portland. No origin server. No cold starts. No "waiting for the serverless function to spin up."

Static HTML served from the edge is the fastest possible architecture for content that doesn't change between requests. And for a portfolio site, nothing changes between requests.

## But What About Dynamic Content?

The blog on this site pulls from markdown files at build time. When I publish a new post, a webhook triggers a rebuild. The new post is live in under 60 seconds, served as static HTML from the edge.

For a contact form, Formspree handles the POST request. For a booking widget, Cal.com provides an iframe. Neither requires a server runtime.

The question isn't "can static handle it?" The question is "does this actually need a server?" For most business websites, the answer is no.

## The Build Pipeline

My deploy pipeline is one command: `npm run build && wrangler pages deploy ./dist`. Build locally, push to the edge. Total deploy time: about 30 seconds.

No Docker containers. No CI/CD pipelines. No environment variable juggling across staging and production. The site is HTML, CSS, and a few kilobytes of JavaScript. It doesn't need infrastructure. It needs a CDN.
