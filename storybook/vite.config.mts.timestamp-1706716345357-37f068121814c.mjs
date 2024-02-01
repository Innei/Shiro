// vite.config.mts
import { readFileSync } from "node:fs";
import path, { resolve } from "node:path";
import react from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.0.12/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { parse } from "file:///Users/innei/git/innei-repo/mx-space/sprightly/node_modules/.pnpm/dotenv@16.4.1/node_modules/dotenv/lib/main.js";
import Macros from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/unplugin-macros@0.9.2_rollup@4.9.5/node_modules/unplugin-macros/dist/index.mjs";
import { defineConfig } from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/vite@5.0.12/node_modules/vite/dist/node/index.js";
import ViteRestart from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/vite-plugin-restart@0.4.0_vite@5.0.12/node_modules/vite-plugin-restart/dist/index.js";
import tsConfigPaths from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/vite-tsconfig-paths@4.3.1_vite@5.0.12/node_modules/vite-tsconfig-paths/dist/index.mjs";
import mdx from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/@mdx-js+rollup@3.0.0_rollup@4.9.5/node_modules/@mdx-js/rollup/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/vite.config.mts";
var __dirname = new URL(".", __vite_injected_original_import_meta_url).pathname;
var env = parse(readFileSync(path.resolve(__dirname, "../.env")));
var options = {
  // See https://mdxjs.com/advanced/plugins
  remarkPlugins: [
    // E.g. `remark-frontmatter`
  ],
  rehypePlugins: []
};
var vite_config_default = defineConfig({
  plugins: [
    Macros.vite(),
    react(),
    tsConfigPaths(),
    mdx(options),
    ViteRestart({
      restart: ["../**/index.demo.tsx", "../**/index.demo.mdx"]
    })
  ],
  define: {
    __ROOT__: `"${__dirname}"`,
    __COMPONENT_ROOT__: `"${resolve(__dirname, "..")}"`,
    "process.env": { ...env }
  },
  base: "",
  resolve: {
    alias: {
      "next/image": resolve(__dirname, "./mock-packages/next_image"),
      "next/link": resolve(__dirname, "./mock-packages/next_link"),
      "next/dynamic": resolve(__dirname, "./mock-packages/next_dynamic"),
      "next/navigation": resolve(__dirname, "./mock-packages/next_navigation"),
      "~": resolve(__dirname, "../src")
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [Macros.esbuild()]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2lubmVpL2dpdC9pbm5laS1yZXBvL214LXNwYWNlL3NwcmlnaHRseS9zdG9yeWJvb2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9pbm5laS9naXQvaW5uZWktcmVwby9teC1zcGFjZS9zcHJpZ2h0bHkvc3Rvcnlib29rL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvaW5uZWkvZ2l0L2lubmVpLXJlcG8vbXgtc3BhY2Uvc3ByaWdodGx5L3N0b3J5Ym9vay92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHBhdGgsIHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IHBhcnNlIH0gZnJvbSAnZG90ZW52J1xuaW1wb3J0IE1hY3JvcyBmcm9tICd1bnBsdWdpbi1tYWNyb3MnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IFZpdGVSZXN0YXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLXJlc3RhcnQnXG5pbXBvcnQgdHNDb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuXG5pbXBvcnQgbWR4IGZyb20gJ0BtZHgtanMvcm9sbHVwJ1xuXG5jb25zdCBfX2Rpcm5hbWUgPSBuZXcgVVJMKCcuJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZVxuY29uc3QgZW52ID0gcGFyc2UocmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uZW52JykpKVxuXG4vLyBgb3B0aW9uc2AgYXJlIHBhc3NlZCB0byBgQG1keC1qcy9tZHhgXG5jb25zdCBvcHRpb25zID0ge1xuICAvLyBTZWUgaHR0cHM6Ly9tZHhqcy5jb20vYWR2YW5jZWQvcGx1Z2luc1xuICByZW1hcmtQbHVnaW5zOiBbXG4gICAgLy8gRS5nLiBgcmVtYXJrLWZyb250bWF0dGVyYFxuICBdLFxuICByZWh5cGVQbHVnaW5zOiBbXSxcbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBNYWNyb3Mudml0ZSgpLFxuICAgIHJlYWN0KCksXG4gICAgdHNDb25maWdQYXRocygpLFxuICAgIG1keChvcHRpb25zKSxcbiAgICBWaXRlUmVzdGFydCh7XG4gICAgICByZXN0YXJ0OiBbJy4uLyoqL2luZGV4LmRlbW8udHN4JywgJy4uLyoqL2luZGV4LmRlbW8ubWR4J10sXG4gICAgfSksXG4gIF0sXG5cbiAgZGVmaW5lOiB7XG4gICAgX19ST09UX186IGBcIiR7X19kaXJuYW1lfVwiYCxcbiAgICBfX0NPTVBPTkVOVF9ST09UX186IGBcIiR7cmVzb2x2ZShfX2Rpcm5hbWUsICcuLicpfVwiYCxcbiAgICAncHJvY2Vzcy5lbnYnOiB7IC4uLmVudiB9LFxuICB9LFxuICBiYXNlOiAnJyxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnbmV4dC9pbWFnZSc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9tb2NrLXBhY2thZ2VzL25leHRfaW1hZ2UnKSxcbiAgICAgICduZXh0L2xpbmsnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vbW9jay1wYWNrYWdlcy9uZXh0X2xpbmsnKSxcbiAgICAgICduZXh0L2R5bmFtaWMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vbW9jay1wYWNrYWdlcy9uZXh0X2R5bmFtaWMnKSxcbiAgICAgICduZXh0L25hdmlnYXRpb24nOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vbW9jay1wYWNrYWdlcy9uZXh0X25hdmlnYXRpb24nKSxcbiAgICAgICd+JzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICBwbHVnaW5zOiBbTWFjcm9zLmVzYnVpbGQoKV0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRWLFNBQVMsb0JBQW9CO0FBQ3pYLE9BQU8sUUFBUSxlQUFlO0FBQzlCLE9BQU8sV0FBVztBQUNsQixTQUFTLGFBQWE7QUFDdEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1CO0FBRTFCLE9BQU8sU0FBUztBQVR5TSxJQUFNLDJDQUEyQztBQVcxUSxJQUFNLFlBQVksSUFBSSxJQUFJLEtBQUssd0NBQWUsRUFBRTtBQUNoRCxJQUFNLE1BQU0sTUFBTSxhQUFhLEtBQUssUUFBUSxXQUFXLFNBQVMsQ0FBQyxDQUFDO0FBR2xFLElBQU0sVUFBVTtBQUFBO0FBQUEsRUFFZCxlQUFlO0FBQUE7QUFBQSxFQUVmO0FBQUEsRUFDQSxlQUFlLENBQUM7QUFDbEI7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPLEtBQUs7QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQSxJQUNkLElBQUksT0FBTztBQUFBLElBQ1gsWUFBWTtBQUFBLE1BQ1YsU0FBUyxDQUFDLHdCQUF3QixzQkFBc0I7QUFBQSxJQUMxRCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sVUFBVSxJQUFJLFNBQVM7QUFBQSxJQUN2QixvQkFBb0IsSUFBSSxRQUFRLFdBQVcsSUFBSSxDQUFDO0FBQUEsSUFDaEQsZUFBZSxFQUFFLEdBQUcsSUFBSTtBQUFBLEVBQzFCO0FBQUEsRUFDQSxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxjQUFjLFFBQVEsV0FBVyw0QkFBNEI7QUFBQSxNQUM3RCxhQUFhLFFBQVEsV0FBVywyQkFBMkI7QUFBQSxNQUMzRCxnQkFBZ0IsUUFBUSxXQUFXLDhCQUE4QjtBQUFBLE1BQ2pFLG1CQUFtQixRQUFRLFdBQVcsaUNBQWlDO0FBQUEsTUFDdkUsS0FBSyxRQUFRLFdBQVcsUUFBUTtBQUFBLElBQ2xDO0FBQUEsRUFDRjtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osZ0JBQWdCO0FBQUEsTUFDZCxTQUFTLENBQUMsT0FBTyxRQUFRLENBQUM7QUFBQSxJQUM1QjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
