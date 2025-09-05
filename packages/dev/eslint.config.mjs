import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import turbo from "eslint-plugin-turbo";

/** @type {import("eslint").Linter.Config} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.config({
    files: ['**/*.{ts,tsx}'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
  }),
  {
    plugins: {
      turbo,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "error",
    },
  },
]
