import { ActionError, defineAction } from "astro:actions";
import { userInput } from "./schema.ts";

const { API_URL } = import.meta.env;

export const updateUser = defineAction({
  accept: "json",
  input: userInput,
  handler: async (input, context) => {
    const accessToken = await context.session?.get("accessToken");
    const res = await fetch(`${API_URL}/v1/user/me`, {
      method: "PATCH",
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
