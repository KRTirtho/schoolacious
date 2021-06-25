/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    // parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
        "plugin:jest/recommended",
        "../../.eslintrc.js",
        // "plugin:@typescript-eslint/recommended",
        // "plugin:prettier/recommended",
    ],
    plugins: ["react", "@typescript-eslint/eslint-plugin", "jest", "prettier"],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    // ignorePatterns: [".eslintrc.js"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        // sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },
    rules: {
        // "prettier/prettier": "warn",
        // "linebreak-style": "off",
        // "@typescript-eslint/explicit-module-boundary-types": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "react/no-unescaped-entities": "off",
    },
    settings: {
        "import/ignore": [/\.(scss|less|css)$/, /\.(png|gif|jpg|svg)$/],
    },
};
