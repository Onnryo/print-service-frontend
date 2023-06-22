import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mkcert from "vite-plugin-mkcert";
import tailwindcss from "tailwindcss";
import postcssNesting from 'postcss-nesting';

require("dotenv").config();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), mkcert()],
    server: {
        https: true,
        port: process.env.PORT,
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    css: {
        postcss: {
            plugins: [postcssNesting, tailwindcss],
        },
    },
});
