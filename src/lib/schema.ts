// Shared JSON-LD site graph: one source of truth for entity facts.
// Name forms are deliberate: brand "generuss design" (styled lowercase,
// matches on-site + llms.txt), legalName "Generuss LLC".
const SAME_AS = [
  "https://github.com/washyaderner",
  "https://x.com/generussai",
  "https://www.youtube.com/@generussai",
  "https://www.linkedin.com/in/russell-gardner-382b6037/",
];

const SITE_DESCRIPTION =
  "Custom websites for service businesses and founders who outgrew templates. No bloat. Designed to convert.";

export function siteGraph(site: URL | string) {
  const base = String(site);
  return [
    {
      "@type": "Organization",
      "@id": `${base}#org`,
      name: "generuss design",
      legalName: "Generuss LLC",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: new URL("/og-default.png", base).toString(),
      },
      founder: { "@id": `${base}#person` },
      sameAs: SAME_AS,
    },
    {
      "@type": "Person",
      "@id": `${base}#person`,
      name: "Russ Gardner",
      url: base,
      jobTitle: "Web Designer & Developer",
      worksFor: { "@id": `${base}#org` },
      sameAs: SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": `${base}#website`,
      url: base,
      name: "generuss design",
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${base}#org` },
    },
  ];
}

export function breadcrumbs(
  site: URL | string,
  items: Array<{ name: string; path: string }>,
) {
  const base = String(site);
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, base).toString(),
    })),
  };
}
