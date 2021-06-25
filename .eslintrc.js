/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
    ],
    root: true,
    parserOptions: {
        sourceType: "module",
    },
    ignorePatterns: [".eslintrc.js", "*.config.js", "node_modules/"],
    rules: {
        "prettier/prettier": "warn",
        "linebreak-style": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
    },
};
