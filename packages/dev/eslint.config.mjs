import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import turbo from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.config({
    files: ["**/*.{ts,tsx,astro}"],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
  }),
  {
    plugins: {
      turbo,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "error",
      // Airbnb에서 필요한 최소 override
      "import/prefer-default-export": "off",
      "no-console": "warn",
      // import 정렬
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // 싱글쿼터
      quotes: ["error", "single", { avoidEscape: true }],
    },
  },
  {
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
      },
    },
  },
  {
    ignores: ["node_modules/**", "dist/**"],
  },
];
