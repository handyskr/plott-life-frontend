import { check, signIn } from "./signIn.ts";
import { signUp, requestCode, verifyCode } from "./signUp.ts";
import { resetPassword, setPassword } from "./password.ts";
import { updateUser } from "./user.ts";
import { test } from "./crm.ts";
import { signOut } from "./signOut.ts";

export const server = {
  check,
  signIn,
  signUp,
  signOut,
  requestCode,
  verifyCode,
  setPassword,
  resetPassword,
  updateUser,
  test,
}
