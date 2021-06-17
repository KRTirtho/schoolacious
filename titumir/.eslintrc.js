/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
        tsconfigRootDir: __dirname,
    },
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    plugins: ["@typescript-eslint/eslint-plugin", "prettier"],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: [".eslintrc.js", /\.config.js$/],
    rules: {
        "prettier/prettier": "warn",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
};
