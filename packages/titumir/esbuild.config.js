const { build } = require("esbuild");
const glob = require("glob");
const { esbuildDecorators } = require("@anatine/esbuild-decorators");
const tsconfig = "./tsconfig.json";
build({
    entryPoints: glob.sync("./**/*.ts", {
        ignore: ["./node_modules/**", "./test/**"],
    }),
    color: true,
    outdir: "dist/",
    sourcemap: true,
    platform: "node",
    target: "node14",
    format: "cjs",
    watch: true,
    plugins: [esbuildDecorators({ tsconfig })],
    tsconfig,
}).catch(() => process.exit(1));
