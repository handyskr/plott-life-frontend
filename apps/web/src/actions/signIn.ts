import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

const { PRIVATE_API_URL } = import.meta.env;

/**
 * 계정이 있는 경우 {}
 */
export const check = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
  }),
  handler: async (input) => {
    const res = await fetch(`${PRIVATE_API_URL}/v1/user:check`, {
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
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(32),
  }),
  handler: async (input, context) => {
    const res = await fetch(`${PRIVATE_API_URL}/v1/user:login`, {
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

      // TODO: 만약 비 인증 상태라면 인증하도록 유도
      return {};
    } catch (e) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
});
