import type { paths as Paths } from "./strapi.type";

const STRAPI_API_URL = `${import.meta.env.STRAPI_URL}/api`;

interface Page<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

type Media = {
  id: number;
  alternativeText: string | null;
  caption: string | null;
  formats: {
    [key in "thumbnail" | "large" | "medium" | "small"]: {
      name: string;
      hash: string;
      mime: string;
      path: string | null;
      width: number;
      height: number;
      size: number;
      url: string;
    };
  };
};

interface Article {
  id: number;
  documentId: string;
  slug: string;
  title: string;
  description: string;
  cover: Media;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

type Operation<
  TPath extends keyof Paths,
  TMethod extends keyof Paths[TPath],
> = Paths[TPath][TMethod];

// @formatter:off
type ExtractJSON<C> = C extends { content: { 'application/json': infer R } } ? R : unknown;
type SuccessJSON<T> =
  T extends { responses: infer R }
    ? 200 extends keyof R ? ExtractJSON<R[200]> :
      201 extends keyof R ? ExtractJSON<R[201]> :
        204 extends keyof R ? void : unknown
    : unknown;
// @formatter:on

async function getFetch<TPath extends keyof Paths & string>(path: TPath) {
  const res = await fetch(
    `${STRAPI_API_URL}${path}?populate=*&sort=createdAt:desc&status=draft`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = await res.json();
  return data as SuccessJSON<Operation<TPath, "get">>;
}

export async function getBlogPosts() {
  return await getFetch("/blog-posts");
}
