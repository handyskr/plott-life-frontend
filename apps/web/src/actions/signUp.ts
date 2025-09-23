import { ActionError, defineAction } from "astro:actions";
import { signUpInput, verifyCodeInput } from "./schema.ts";

const { API_URL } = import.meta.env;

export const signUp = defineAction({
  accept: "json",
  input: signUpInput,
  handler: async (input, context) => {
    const res = await fetch(`${API_URL}/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new ActionError({
        code: ActionError.statusToCode(res.status),
      });
    }

    try {
      const data = await res.json();

      const { accessToken, refreshToken } = data;

      await context.session?.set("accessToken", accessToken);
      await context.session?.set("refreshToken", refreshToken);

      await fetch(`${API_URL}/v1/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {};
    } catch (e) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
});

// 이메일 본인인증 요청 - 재요청시 사용
export const requestCode = defineAction({
  accept: "json",
  handler: async (input, context) => {
    const accessToken = await context.session?.get("accessToken");
    if (!accessToken) {
      throw new ActionError({
        code: "UNAUTHORIZED",
      });
    }

    const res = await fetch(`${API_URL}/v1/verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new ActionError({
        code: ActionError.statusToCode(res.status),
      });
    }

    return {};
  },
});

export const verifyCode = defineAction({
  accept: "json",
  input: verifyCodeInput,
  handler: async (input, context) => {
    const accessToken = await context.session?.get("accessToken");
    if (!accessToken) {
      throw new ActionError({
        code: "UNAUTHORIZED",
      });
    }

    const res = await fetch(`${API_URL}/v1/verification:verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new ActionError({
        code: ActionError.statusToCode(res.status),
      });
    }

    return {};
  },
});
