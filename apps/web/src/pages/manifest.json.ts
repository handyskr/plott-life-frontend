import type { APIRoute } from "astro";

const iconPrefix = "/icons";

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
      description: "출장, 이사, 한달살기, 리모델링까지. 전국 주요 도시의 풀옵션 원룸·투룸·오피스텔·아파트·레지던스에서 원하는 기간 머무는 단기임대의 새로운 기준.",
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
