import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom", // for React/browser testing
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    // Mock CSS imports
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
