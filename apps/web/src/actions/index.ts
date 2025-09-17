import { check, signIn } from "./signIn.ts";
import { signUp, requestCode, verifyCode } from "./signUp.ts";
import { resetPassword, setPassword } from "./password.ts";

export const server = {
  check,
  signIn,
  signUp,
  requestCode,
  verifyCode,
  setPassword,
  resetPassword,
}
