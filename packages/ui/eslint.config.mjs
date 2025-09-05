import eslint from "@plott-life/utils/eslint";
import preact from "eslint-config-preact";
import eslintConfigPrettier from "eslint-config-prettier/flat";

/** @type {import("eslint").Linter.Config} */
export default [...eslint, ...preact, eslintConfigPrettier];
