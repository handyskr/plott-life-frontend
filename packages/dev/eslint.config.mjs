import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.config({
    files: ["**/*.{ts,tsx}"],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
  }),
  {
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
    },
  },
  {
    rules: {
      "no-console": "warn",
      quotes: ["error", "double", { avoidEscape: true }],
    },
  },
  {
    ignores: ["node_modules/**", "dist/**"],
  },
];
