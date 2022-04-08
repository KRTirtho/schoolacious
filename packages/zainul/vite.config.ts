import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import TsChecker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        TsChecker({
            typescript: true,
            eslint: {
                extensions: [".go"],
                files: [],
            },
            enableBuild: true,
        }),
    ],

    // server: {
    //   hmr: {
    // for making hmr work in gitpod
    //     port: 443
    //   }
    // }
});
