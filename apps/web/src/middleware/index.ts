import { defineMiddleware } from "astro:middleware";

const { API_URL } = import.meta.env;

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith("/assets")) {
    return next();
  }

  console.log(`Middleware: ${context.url.pathname}`);
  context.session?.set("lastVisit", new Date());

  // TODO: 추후 액션은 따로 처리
  if (context.url.pathname.startsWith("/_actions")) {
    return next();
  }

  const accessToken = await context.session?.get("accessToken");
  if (!accessToken) {
    context.locals.isLoggedIn = false;
    return next();
  }

  const userRes = await fetch(`${API_URL}/v1/user/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (userRes.ok) {
    const user = await userRes.json();
    context.locals.user = user;
    context.locals.isLoggedIn = true;

    if (context.url.pathname.startsWith("/auth")) {
      return next();
    }

    switch (user.status) {
      case "ACTIVE":
        return next();
      case "INACTIVE": {
        return new Response("", {
          status: 301,
          headers: {
            Location: "/auth/verify-email",
          },
        });
      }
      default: {
        context.session?.destroy();
        return new Response("", {
          status: 301,
          headers: {
            Location: "/",
          },
        });
      }
    }
  }
  // 토큰이 만료된 경우
  try {
    const refreshToken = await context.session?.get("refreshToken");
    const tokenRes = await fetch(`${API_URL}/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (!tokenRes.ok) {
      throw new Error("Failed to refresh token");
    }
    const token = await tokenRes.json();
    context.session?.set("accessToken", token.accessToken);
    context.session?.set("refreshToken", token.refreshToken);

    return next();
  } catch (e) {
    console.error(e);

    context.session?.destroy();
    context.locals.isLoggedIn = false;
    return next();
  }
});
