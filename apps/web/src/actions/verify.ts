import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const check = defineAction({
  accept: "form",
  input: z.object({
    code: z.string()
  }),
  handler: async (input) => {
    console.log(`Check action: input=`, input);
    // TODO: 코드 검증

    return { success: true };
  },
});

// export const login = defineAction({
//   accept: "form",
//   input: z.object({
//     lastName: z.string(),
//     firstName: z.string(),
//     phoneNumber: z.string(),
//     username: z.string().email(),
//     password: z.string().min(8).max(32),
//   }),
//   handler: async (input) => {
//     console.log(`Login action: input=`, input);
//   },
// });
