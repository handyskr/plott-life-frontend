import type { paths as Paths } from "./strapi.type";
import { withQuery } from "ufo";
import { markdownToHtml } from "@libs/markdown.ts";

const STRAPI_API_URL = `${import.meta.env.STRAPI_URL}/api`;

type Operation<
  TPath extends keyof Paths,
  TMethod extends keyof Paths[TPath],
> = Paths[TPath][TMethod];

// @formatter:off
type ExtractJSON<C> = C extends { content: { "application/json": infer R } }
  ? R
  : unknown;
type SuccessJSON<T> = T extends { responses: infer R }
  ? 200 extends keyof R
    ? ExtractJSON<R[200]>
    : 201 extends keyof R
      ? ExtractJSON<R[201]>
      : 204 extends keyof R
        ? void
        : unknown
  : unknown;
// @formatter:on

async function getFetch<TPath extends keyof Paths & string>(
  path: TPath | string,
  query: any = {},
) {
  const res = await fetch(withQuery(`${STRAPI_API_URL}${path}`, query), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data as SuccessJSON<Operation<TPath, "get">>;
}

export async function parseContent(content: any) {
  switch (content?.__component) {
    case "content.html":
      return content.html;
    case "content.markdown":
      return markdownToHtml(content.markdown);
  }
  return "TODO";
}

export async function getBlogPosts() {
  return await getFetch("/blog-posts", {
    populate: "*",
    sort: "createdAt:desc",
  });
}

export async function getBlogPost(slug: string) {
  const {
    data: [data],
  } = await getFetch(`/blog-posts`, {
    "filters[slug][$eq]": slug,
    populate: "*",
  });

  return data;
}

export async function getFaqs() {
  const { data: faqCategories } = await getFetch("/faq-categories", {
    "pagination[pageSize]": 100,
    populate: "*",
    'sort[0]': 'audience:asc',
    'sort[1]': "order:asc",
  });

  const { data: faqs } = await getFetch("/faqs", {
    "pagination[pageSize]": 100,
    populate: "*",
    'sort[0]': 'category.audience:asc',
    'sort[1]': "order:asc",
  });

  return { faqCategories, faqs };
}
