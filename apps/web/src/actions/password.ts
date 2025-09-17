import { ActionError, defineAction } from "astro:actions";
import { resetPasswordInput, setPasswordInput } from "./schema.ts";

const { API_URL } = import.meta.env;

/**
 * 비밀번호 변경
 */
export const setPassword = defineAction({
  accept: "json",
  input: setPasswordInput,
  handler: async (input) => {
    const res = await fetch(`${API_URL}/v1/user/me/password`, {
      method: "PUT",
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

    return {};
  },
});

/**
 * 비밀번호 재설정 이메일 발송
 */
export const resetPassword = defineAction({
  accept: "json",
  input: resetPasswordInput,
  handler: async (input) => {
    const res = await fetch(`${API_URL}/v1/user/me/password`, {
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

    return {};
  },
});
