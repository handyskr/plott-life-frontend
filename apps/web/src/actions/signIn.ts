import { ActionError, defineAction } from "astro:actions";
import { emailInput, signInInput } from "./schema.ts";
import { withQuery } from "ufo";

const { API_URL } = import.meta.env;

/**
 * 계정이 있는 경우 {}
 */
export const check = defineAction({
  accept: "json",
  input: emailInput,
  handler: async (input) => {
    const res = await fetch(`${API_URL}/v1/user:check`, {
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

    const data = await res.json();
    if (!data.exists) {
      throw new ActionError({
        code: "NOT_FOUND",
      });
    }

    return {};
  },
});

export const signIn = defineAction({
  accept: "json",
  input: signInInput,
  handler: async (input, context) => {
    const res = await fetch(`${API_URL}/v1/user:login`, {
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

      const userRes = await fetch(`${API_URL}/v1/user/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 만약 가가입 상태라면 메일 인증 요청
      const user = await userRes.json();
      if (user.status !== 'ACTIVE') {
        return {
          redirectURL: withQuery('/auth/verify-email', {
            email: user.email,
          }),
        }
      }

      return {};
    } catch (e) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
});
