import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

const { PRIVATE_API_URL } = import.meta.env;

const USER_POLICY_CODES = [
  "TERMS_OF_SERVICE",
  "PRIVACY_POLICY",
  "IS_ADULT",
  "MARKETING_CONSENT",
] as const;

export const signUp = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
    firstName: z.string().min(1).max(32),
    lastName: z.string().min(1).max(32),
    phoneCode: z.string().regex(/\d{1,3}/),
    phoneNumber: z.string().regex(/\d{6,15}/),
    agreedPolicyCodes: z.array(z.enum(USER_POLICY_CODES)),
  }),
  handler: async (input, context) => {
    const res = await fetch(`${PRIVATE_API_URL}/v1/user`, {
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

      // 이메일 본인인증 요청
      await fetch(`${PRIVATE_API_URL}/v1/verification`, {
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
export const requestVerification = defineAction({
  accept: "json",
  handler: async (input, context) => {
    const accessToken = await context.session?.get("accessToken");
    if (!accessToken) {
      throw new ActionError({
        code: "UNAUTHORIZED",
      });
    }

    const res = await fetch(`${PRIVATE_API_URL}/v1/verification`, {
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

export const verifyVerification = defineAction({
  accept: "json",
  input: z.object({
    code: z.string().length(6),
  }),
  handler: async (input, context) => {
    const accessToken = await context.session?.get("accessToken");
    if (!accessToken) {
      throw new ActionError({
        code: "UNAUTHORIZED",
      });
    }

    const res = await fetch(`${PRIVATE_API_URL}/v1/verification:verify`, {
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
