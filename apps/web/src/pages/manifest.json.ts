import type { APIRoute } from "astro";

const iconPrefix = "/assets";

export const GET: APIRoute = ({ site }) => {
  const icons = [48, 72, 96, 144, 168, 192, 256, 512].map((size) => ({
    src: `${iconPrefix}/favicon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: "image/png",
  }));
  const path = "/?source=homescreen";

  return new Response(
    JSON.stringify({
      short_name: "plott LIFE",
      name: "plott LIFE | 플라트 라이프",
      icons: icons,
      id: path,
      start_url: path,
      background_color: "#ffffff",
      display: "standalone",
      scope: "/",
      theme_color: "#74594B",
      shortcuts: [],
      description: "레지던스, 아파트, 오피스텔, 원룸 등 1주 이상 단기임대는 플라트 라이프",
      screenshots: [],
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
