// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { createSvgIconsPlugin } from "file:///C:/Users/27319/Desktop/%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8/fileSystem/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
import { loadEnv } from "file:///C:/Users/27319/Desktop/%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8/fileSystem/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/27319/Desktop/%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8/fileSystem/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/27319/Desktop/%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8/fileSystem/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/27319/Desktop/%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8/fileSystem/vite.config.ts";
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      vueJsx()
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    server: {
      host: true,
      open: true,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    },
    //scss全局配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@import "@/styles/variables.scss"; `
        }
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyNzMxOVxcXFxEZXNrdG9wXFxcXFx1NjU4N1x1NEVGNlx1NjcwRFx1NTJBMVx1NTY2OFxcXFxmaWxlU3lzdGVtXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyNzMxOVxcXFxEZXNrdG9wXFxcXFx1NjU4N1x1NEVGNlx1NjcwRFx1NTJBMVx1NTY2OFxcXFxmaWxlU3lzdGVtXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8yNzMxOS9EZXNrdG9wLyVFNiU5NiU4NyVFNCVCQiVCNiVFNiU5QyU4RCVFNSU4QSVBMSVFNSU5OSVBOC9maWxlU3lzdGVtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2lufSBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7VXNlckNvbmZpZ0V4cG9ydCxDb25maWdFbnYsbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcblxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgKHttb2RlfTpDb25maWdFbnYpOlVzZXJDb25maWdFeHBvcnQ9PntcclxuICBjb25zdCBlbnYgID0gbG9hZEVudihtb2RlLHByb2Nlc3MuY3dkKCkpLy9cdTUyQTBcdThGN0RcdTc2ODRcdTZBMjFcdTVGMEZcdTRFM0FcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdUZGMDhcdTlFRDhcdThCQTRcdTRFM0FcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdUZGMDlcdUZGMENcdTY1ODdcdTRFRjZcdTYyNDBcdTU3MjhcdTRGNERcdTdGNkVcdTRFM0FcdTk4NzlcdTc2RUVcdTY4MzlcdTc2RUVcdTVGNTVcclxucmV0dXJuIHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgaWNvbkRpcnM6W3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCdzcmMvYXNzZXRzL2ljb25zJyldLFxyXG4gICAgICBzeW1ib2xJZDonaWNvbi1bZGlyXS1bbmFtZV0nLFxyXG4gICAgfSksXHJcbiAgICB2dWVKc3goKSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXJ2ZXI6e1xyXG4gICAgaG9zdDp0cnVlLFxyXG4gICAgb3Blbjp0cnVlLFxyXG4gICAgcHJveHk6e1xyXG4gICAgICBbZW52LlZJVEVfQVBQX0JBU0VfQVBJXTp7XHJcbiAgICAgICAgdGFyZ2V0OmVudi5WSVRFX1NFUlZFLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjp0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gIH0sXHJcbiAgLy9zY3NzXHU1MTY4XHU1QzQwXHU5MTREXHU3RjZFXHJcbiAgY3NzOntcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6e1xyXG4gICAgICBzY3NzOntcclxuICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDp0cnVlLFxyXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOmBAaW1wb3J0IFwiQC9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIjsgYFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVixTQUFTLGVBQWUsV0FBVztBQUM5WCxTQUFTLDRCQUEyQjtBQUNwQyxPQUFPLFVBQVU7QUFDakIsU0FBbUMsZUFBZTtBQUNsRCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBTDhLLElBQU0sMkNBQTJDO0FBU2xQLElBQU8sc0JBQVEsQ0FBQyxFQUFDLEtBQUksTUFBK0I7QUFDbEQsUUFBTSxNQUFPLFFBQVEsTUFBSyxRQUFRLElBQUksQ0FBQztBQUN6QyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixxQkFBcUI7QUFBQSxRQUNuQixVQUFTLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFFLGtCQUFrQixDQUFDO0FBQUEsUUFDeEQsVUFBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLE1BQ0QsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDdEQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFPO0FBQUEsTUFDTCxNQUFLO0FBQUEsTUFDTCxNQUFLO0FBQUEsTUFDTCxPQUFNO0FBQUEsUUFDSixDQUFDLElBQUksaUJBQWlCLEdBQUU7QUFBQSxVQUN0QixRQUFPLElBQUk7QUFBQSxVQUNYLGNBQWE7QUFBQSxVQUNiLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLFFBQzlDO0FBQUEsTUFDRjtBQUFBLElBRUY7QUFBQTtBQUFBLElBRUEsS0FBSTtBQUFBLE1BQ0YscUJBQW9CO0FBQUEsUUFDbEIsTUFBSztBQUFBLFVBQ0gsbUJBQWtCO0FBQUEsVUFDbEIsZ0JBQWU7QUFBQSxRQUNqQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNBOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
