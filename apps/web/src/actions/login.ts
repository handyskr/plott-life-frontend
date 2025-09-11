import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

export const check = defineAction({
  accept: "form",
  input: z.object({
    username: z.string().email(),
  }),
  handler: async (input) => {
    console.log(`Check action: input=`, input);

    // for Test
    if (input.username !== "test@test.com") {
      throw new ActionError({ code: "NOT_FOUND" });
    }

    return { success: true };
  },
});

export const login = defineAction({
  accept: "form",
  input: z.object({
    username: z.string().email(),
    password: z.string().min(8).max(32),
  }),
  handler: async (input) => {
    console.log(`Login action: input=`, input);
  },
});
