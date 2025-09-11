import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const check = defineAction({
  accept: "form",
  input: z.object({
    username: z.string().email(),
  }),
  handler: async (input) => {
    console.log(`Check action: input=`, input);

    // TODO: 계정검사

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
