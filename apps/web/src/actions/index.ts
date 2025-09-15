import { check, signIn } from "./signIn.ts";
import { signUp, requestVerification, verifyVerification } from "./signUp.ts";

export const server = {
  check,
  signIn,
  signUp,
  requestVerification,
  verifyVerification,
}
