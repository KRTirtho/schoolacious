const { build } = require("esbuild");
const glob = require("glob");
const { esbuildDecorators } = require("@anatine/esbuild-decorators");
const tsconfig = "./tsconfig.json";

const label = "Build finished within";
console.time(label);
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
    plugins: [esbuildDecorators({ tsconfig })],
})
    .then(({ errors, warnings }) => {
        console.timeEnd(label);
        console.log("[Errors]: ", errors.length === 0 ? "N/A" : errors);
        console.log("[Warnings]: ", warnings.length === 0 ? "N/A" : warnings);
    })
    .catch(() => process.exit(1));
