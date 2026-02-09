import baseConfig from "eslint-config-loderunner/base";
import formattingConfig from "eslint-config-loderunner/formatting";
import importConfig from "eslint-config-loderunner/import";
import reactConfig from "eslint-config-loderunner/react";
import typescriptConfig from "eslint-config-loderunner/typescript";

export default [
  { ignores: [".next/", "node_modules/", "drizzle/", "*.config.ts", "*.config.mjs"] },
  ...baseConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...importConfig,
  ...formattingConfig, // MUST BE LAST
];
