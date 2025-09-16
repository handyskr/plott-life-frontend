import { check, signIn } from "./signIn.ts";
import { signUp, requestCode, verifyCode } from "./signUp.ts";

export const server = {
  check,
  signIn,
  signUp,
  requestVerification: requestCode,
  verifyVerification: verifyCode,
}
