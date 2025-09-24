import { z } from "zod";

export const USER_POLICY_CODES = [
  "TERMS_OF_SERVICE",
  "PRIVACY_POLICY",
  // "IS_ADULT",
  // "MARKETING_CONSENT",
] as const;

export const emailInput = z.object({
  email: z.string().email(),
});

export const password = z.string().min(8).max(20);

export const signInInput = emailInput.extend({
  password: password,
});

export const passwordConfirmInput = z.object({
  password: password,
  passwordConfirm: password,
});

export const setPasswordInput = passwordConfirmInput
  .extend({
    email: z.string().email(),
    token: z.string().min(1),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
  });

export const resetPasswordInput = emailInput.extend({
  redirectUri: z.string().url(),
});

export const phoneInput = z.object({
  phoneCode: z.string().regex(/\d{1,3}/),
  phoneNumber: z.string().regex(/\d{6,15}/),
});

export const userInput = z.union([
  z
    .object({
      password: password,
      newPassword: password,
      passwordConfirm: password,
    })
    .refine((data) => data.newPassword === data.passwordConfirm, {
      path: ["passwordConfirm"],
    }),
  phoneInput,
]);

// NOTE: 구려..astro는 zod3 밖에 지원을 안해서 약간 요상하게 해야함.
export const signUpInput = signInInput
  .extend({
    ...passwordConfirmInput.shape,
    firstName: z.string().min(1).max(32),
    lastName: z.string().min(1).max(32),
    ...phoneInput.shape,
    agreedPolicyCodes: z.array(z.enum(USER_POLICY_CODES)).optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
  });

export const termAgreementInput = z.object({
  TERMS_OF_SERVICE: z.literal(true),
  PRIVACY_POLICY: z.literal(true),
  // IS_ADULT: z.literal(true),
  // MARKETING_CONSENT: z.boolean().optional(),
});

export const verifyCodeInput = z.object({
  code: z.string().length(6),
});

export const contractData = z.object({
  buildingUnitId: z.number(),
  start: z.string(),
  end: z.string(),
});

export const contractCancelData = contractData.extend({
  id: z.number(),
});

export const contractIdData = z.object({
  id: z.number(),
});
