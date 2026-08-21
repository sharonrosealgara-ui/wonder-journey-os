import js from "@eslint/js";
import tseslint from "typescript-eslint";

const dummyRule = {
  create() {
    return {};
  },
};

const nextPlugin = {
  rules: {
    "no-img-element": dummyRule,
  },
};

const reactHooksPlugin = {
  rules: {
    "exhaustive-deps": dummyRule,
    "rules-of-hooks": dummyRule,
  },
};

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-console": "off",
      "no-empty": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "public/**",
      "artifacts/**",
      "scripts/**",
      "tests/**",
    ],
  }
);
