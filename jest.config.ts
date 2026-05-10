import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.test.tsx"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFiles: ["<rootDir>/tests/setup.ts"],
  globalSetup: "<rootDir>/tests/globalSetup.ts",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "mjs",
    "cjs",
    "json",
    "node",
  ],
};

const nextConfig = createJestConfig(config);

export default async function jestConfig(): Promise<Config> {
  const resolved = await nextConfig();
  const defaultPatterns = (resolved.transformIgnorePatterns ?? []) as string[];
  return {
    ...resolved,
    // Add @prisma/client/runtime to the transform allowlist so .mjs WASM files are processed
    transformIgnorePatterns: defaultPatterns.map((p) =>
      p.startsWith("/node_modules/")
        ? p.replace(
            "/node_modules/(?!",
            "/node_modules/(?!(@prisma/client/runtime)|",
          )
        : p,
    ),
  };
}
