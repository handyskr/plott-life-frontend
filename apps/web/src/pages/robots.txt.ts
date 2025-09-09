import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

/**
 * @see astro.config.mjs liveURL
 */
export const GET: APIRoute = ({ site }) => {
  if (site != "https://life.plott.co.kr") {
    return new Response("User-agent: *\nDisallow: /");
  }

  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
