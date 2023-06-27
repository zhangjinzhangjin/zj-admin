import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import DefineOptions from "unplugin-vue-define-options/vite";
import viteCompression from "vite-plugin-compression";
import { createHtmlPlugin } from "vite-plugin-html";
// import { viteMockServe } from "vite-plugin-mock";
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      vue(),
      VueJsx(),
      DefineOptions(),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
            injectScript: `<script src="./inject.js"></script>`,
          },
        },
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/svgs")],
        symbolId: "icon-[dir]-[name]",
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
      // viteMockServe({
      //   ignore: /^\_/,
      //   mockPath: "mock",
      //   localEnabled: command != "build",
      //   prodEnabled: command == "build",
      //   injectCode: `
      //     import { setupProdMockServer } from '../mock/_createProductionServer'
      //     setupProdMockServer()
      //     `,
      // }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "./src/styles/global.scss";',
          javascriptEnabled: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
      minify: "terser",
      outDir: env.VITE_OUT_DIR || "dist",
      sourcemap: env.VITE_SOURCEMAP === "true" ? "inline" : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === "true",
          drop_console: env.VITE_DROP_CONSOLE === "true",
        },
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: false,
          manualChunks: {
            "modules-vue": ["vue", "vue-router", "@vueuse/core"],
            "modules-element-plus": ["element-plus"],
            "modules-icon": ["@element-plus/icons-vue"],
            "modules-echarts": ["echarts"],
          },
        },
      },
    },
    server: {
      port: 9527,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      hmr: {
        overlay: false,
      },
      host: "0.0.0.0",
    },
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "element-plus/es/locale/lang/zh-cn",
        "element-plus/es/locale/lang/en",
        "@vueuse/core",
        "axios",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
      ],
    },
  };
});
