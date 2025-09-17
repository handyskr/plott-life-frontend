import { ActionError, defineAction } from "astro:actions";
import { emailInput } from "./schema.ts";

const { API_URL } = import.meta.env;

export const test = defineAction({
  accept: "json",
  input: emailInput,
  handler: async (input) => {
    const res = await fetch(`${API_URL}/test`, {
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
