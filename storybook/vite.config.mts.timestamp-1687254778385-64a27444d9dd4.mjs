// vite.config.mts
import { resolve } from "node:path";
import react from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/@vitejs+plugin-react@4.0.0_vite@4.3.9/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/vite@4.3.9/node_modules/vite/dist/node/index.js";
import ViteRestart from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/vite-plugin-restart@0.3.1_vite@4.3.9/node_modules/vite-plugin-restart/dist/index.mjs";
import tsConfigPaths from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/vite-tsconfig-paths@4.2.0_vite@4.3.9/node_modules/vite-tsconfig-paths/dist/index.mjs";
import mdx from "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/node_modules/.pnpm/@mdx-js+rollup@2.3.0_rollup@3.25.1/node_modules/@mdx-js/rollup/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/innei/git/innei-repo/mx-space/sprightly/storybook/vite.config.mts";
var __dirname = new URL(".", __vite_injected_original_import_meta_url).pathname;
var options = {
  // See https://mdxjs.com/advanced/plugins
  remarkPlugins: [
    // E.g. `remark-frontmatter`
  ],
  rehypePlugins: []
};
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    tsConfigPaths(),
    mdx(options),
    ViteRestart({
      restart: ["../**/index.demo.tsx", "../**/index.demo.mdx"]
    })
  ],
  define: {
    __ROOT__: `"${__dirname}"`,
    __COMPONENT_ROOT__: `"${resolve(__dirname, "..")}"`
  },
  resolve: {
    alias: {
      "next/image": resolve(__dirname, "./mock-packages/next_image"),
      "~": resolve(__dirname, "../src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2lubmVpL2dpdC9pbm5laS1yZXBvL214LXNwYWNlL3NwcmlnaHRseS9zdG9yeWJvb2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9pbm5laS9naXQvaW5uZWktcmVwby9teC1zcGFjZS9zcHJpZ2h0bHkvc3Rvcnlib29rL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvaW5uZWkvZ2l0L2lubmVpLXJlcG8vbXgtc3BhY2Uvc3ByaWdodGx5L3N0b3J5Ym9vay92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBWaXRlUmVzdGFydCBmcm9tICd2aXRlLXBsdWdpbi1yZXN0YXJ0J1xuaW1wb3J0IHRzQ29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcblxuaW1wb3J0IG1keCBmcm9tICdAbWR4LWpzL3JvbGx1cCdcblxuY29uc3QgX19kaXJuYW1lID0gbmV3IFVSTCgnLicsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWVcblxuLy8gYG9wdGlvbnNgIGFyZSBwYXNzZWQgdG8gYEBtZHgtanMvbWR4YFxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgLy8gU2VlIGh0dHBzOi8vbWR4anMuY29tL2FkdmFuY2VkL3BsdWdpbnNcbiAgcmVtYXJrUGx1Z2luczogW1xuICAgIC8vIEUuZy4gYHJlbWFyay1mcm9udG1hdHRlcmBcbiAgXSxcbiAgcmVoeXBlUGx1Z2luczogW10sXG59XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG5cbiAgICB0c0NvbmZpZ1BhdGhzKCksXG4gICAgbWR4KG9wdGlvbnMpLFxuICAgIFZpdGVSZXN0YXJ0KHtcbiAgICAgIHJlc3RhcnQ6IFsnLi4vKiovaW5kZXguZGVtby50c3gnLCAnLi4vKiovaW5kZXguZGVtby5tZHgnXSxcbiAgICB9KSxcbiAgXSxcblxuICBkZWZpbmU6IHtcbiAgICBfX1JPT1RfXzogYFwiJHtfX2Rpcm5hbWV9XCJgLFxuICAgIF9fQ09NUE9ORU5UX1JPT1RfXzogYFwiJHtyZXNvbHZlKF9fZGlybmFtZSwgJy4uJyl9XCJgLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICduZXh0L2ltYWdlJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL21vY2stcGFja2FnZXMvbmV4dF9pbWFnZScpLFxuICAgICAgJ34nOiByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3NyYycpLFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VixTQUFTLGVBQWU7QUFDcFgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1CO0FBRTFCLE9BQU8sU0FBUztBQU55TSxJQUFNLDJDQUEyQztBQVExUSxJQUFNLFlBQVksSUFBSSxJQUFJLEtBQUssd0NBQWUsRUFBRTtBQUdoRCxJQUFNLFVBQVU7QUFBQTtBQUFBLEVBRWQsZUFBZTtBQUFBO0FBQUEsRUFFZjtBQUFBLEVBQ0EsZUFBZSxDQUFDO0FBQ2xCO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFHTixjQUFjO0FBQUEsSUFDZCxJQUFJLE9BQU87QUFBQSxJQUNYLFlBQVk7QUFBQSxNQUNWLFNBQVMsQ0FBQyx3QkFBd0Isc0JBQXNCO0FBQUEsSUFDMUQsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUVBLFFBQVE7QUFBQSxJQUNOLFVBQVUsSUFBSTtBQUFBLElBQ2Qsb0JBQW9CLElBQUksUUFBUSxXQUFXLElBQUk7QUFBQSxFQUNqRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsY0FBYyxRQUFRLFdBQVcsNEJBQTRCO0FBQUEsTUFDN0QsS0FBSyxRQUFRLFdBQVcsUUFBUTtBQUFBLElBQ2xDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
