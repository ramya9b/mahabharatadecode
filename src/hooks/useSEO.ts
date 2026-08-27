import { useEffect } from "react";

import { toIsoDate } from "@/utils/articleDate";
const SITE_NAME = "MahabharataDecoded";
const BASE_URL = "https://mahabharatadecoded.com";
const DEFAULT_DESCRIPTION =
  "Ancient wisdom for modern life. Deep-dive articles decoding the Mahabharata's greatest characters and lessons.";
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`;

export interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
  keywords?: string;
  publishedAt?: string;
  author?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

function setTag(
  selector: string,
  attr: string,
  key: string,
  content: string
) {
  let el = document.querySelector(`${selector}[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta") as HTMLMetaElement;
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link") as HTMLLinkElement;
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function injectSchema(schema: Record<string, unknown> | Record<string, unknown>[]) {
  const id = "json-ld-schema";
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script") as HTMLScriptElement;
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  path = "",
  type = "website",
  keywords = "Mahabharata, ancient wisdom, Bhagavad Gita, Karna, Krishna, Arjuna, life lessons, dharma",
  publishedAt,
  author,
  schema,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const fullUrl = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  useEffect(() => {
    // ── Document title ──
    document.title = fullTitle;

    // ── Standard meta ──
    setTag("meta", "name", "description", description);
    setTag("meta", "name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setTag("meta", "name", "keywords", keywords);
    if (author) setTag("meta", "name", "author", author);

    // ── Canonical URL ──
    setLink("canonical", fullUrl);

    // ── Open Graph ──
    setTag("meta", "property", "og:title", fullTitle);
    setTag("meta", "property", "og:description", description);
    setTag("meta", "property", "og:image", ogImage);
    setTag("meta", "property", "og:url", fullUrl);
    if (publishedAt) setTag("meta", "property", "article:published_time", publishedAt);
    setTag("meta", "property", "og:site_name", SITE_NAME);
    setTag("meta", "property", "og:type", type);
    setTag("meta", "property", "og:site_name", SITE_NAME);
    if (publishedAt)
      setTag("meta", "property", "article:published_time", publishedAt);

    // ── Twitter Card ──
    setTag("meta", "name", "twitter:card", "summary_large_image");
    setTag("meta", "name", "twitter:title", fullTitle);
    setTag("meta", "name", "twitter:description", description);
    setTag("meta", "name", "twitter:image", ogImage);
    setTag("meta", "name", "twitter:site", "@MahabharataDecoded");

    // ── Canonical ──
    setLink("canonical", fullUrl);

    // ── JSON-LD Schema ──
    if (schema) injectSchema(schema);

    // ── Cleanup: restore defaults on unmount ──
    return () => {
      document.title = SITE_NAME;
    };
  }, [fullTitle, description, ogImage, fullUrl, type, keywords, publishedAt, author, schema]);
}

/** Build Article schema for blog posts */
export function buildArticleSchema(args: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    image: args.image || DEFAULT_IMAGE,
    url: `${BASE_URL}/blog/${args.slug}`,
    datePublished: toIsoDate(args.publishedAt) || "2026-01-01",
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  };
}

/** Build FAQPage schema so an article's FAQ section is eligible for Google rich results */
export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Build WebSite schema for homepage */
export function buildSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
