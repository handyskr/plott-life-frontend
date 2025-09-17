import { check, signIn } from "./signIn.ts";
import { signUp, requestCode, verifyCode } from "./signUp.ts";
import { resetPassword, setPassword } from "./password.ts";
import { updateUser } from "./user.ts";

export const server = {
  check,
  signIn,
  signUp,
  requestCode,
  verifyCode,
  setPassword,
  resetPassword,
  updateUser,
}
