import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  testPathIgnorePatterns: ["./functional/user.e2e-spec.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testTimeout: 30000,
};

export default config;
