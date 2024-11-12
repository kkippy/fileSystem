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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyNzMxOVxcXFxEZXNrdG9wXFxcXFx1NjU4N1x1NEVGNlx1NjcwRFx1NTJBMVx1NTY2OFxcXFxmaWxlU3lzdGVtXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyNzMxOVxcXFxEZXNrdG9wXFxcXFx1NjU4N1x1NEVGNlx1NjcwRFx1NTJBMVx1NTY2OFxcXFxmaWxlU3lzdGVtXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy8yNzMxOS9EZXNrdG9wLyVFNiU5NiU4NyVFNCVCQiVCNiVFNiU5QyU4RCVFNSU4QSVBMSVFNSU5OSVBOC9maWxlU3lzdGVtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2lufSBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7VXNlckNvbmZpZ0V4cG9ydCxDb25maWdFbnYsbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCAoe21vZGV9OkNvbmZpZ0Vudik6VXNlckNvbmZpZ0V4cG9ydD0+e1xyXG4gIGNvbnN0IGVudiAgPSBsb2FkRW52KG1vZGUscHJvY2Vzcy5jd2QoKSkvL1x1NTJBMFx1OEY3RFx1NzY4NFx1NkEyMVx1NUYwRlx1NEUzQVx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1RkYwOFx1OUVEOFx1OEJBNFx1NEUzQVx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1RkYwOVx1RkYwQ1x1NjU4N1x1NEVGNlx1NjI0MFx1NTcyOFx1NEY0RFx1N0Y2RVx1NEUzQVx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVxyXG5yZXR1cm4ge1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xyXG4gICAgICBpY29uRGlyczpbcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksJ3NyYy9hc3NldHMvaWNvbnMnKV0sXHJcbiAgICAgIHN5bWJvbElkOidpY29uLVtkaXJdLVtuYW1lXScsXHJcbiAgICB9KSxcclxuICAgIHZ1ZUpzeCgpLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjp7XHJcbiAgICBob3N0OnRydWUsXHJcbiAgICBvcGVuOnRydWUsXHJcbiAgICBwcm94eTp7XHJcbiAgICAgIFtlbnYuVklURV9BUFBfQkFTRV9BUEldOntcclxuICAgICAgICB0YXJnZXQ6ZW52LlZJVEVfU0VSVkUsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOnRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgfSxcclxuICAvL3Njc3NcdTUxNjhcdTVDNDBcdTkxNERcdTdGNkVcclxuICBjc3M6e1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczp7XHJcbiAgICAgIHNjc3M6e1xyXG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOnRydWUsXHJcbiAgICAgICAgYWRkaXRpb25hbERhdGE6YEBpbXBvcnQgXCJAL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiOyBgXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJWLFNBQVMsZUFBZSxXQUFXO0FBQzlYLFNBQVMsNEJBQTJCO0FBQ3BDLE9BQU8sVUFBVTtBQUNqQixTQUFtQyxlQUFlO0FBQ2xELE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFMOEssSUFBTSwyQ0FBMkM7QUFRbFAsSUFBTyxzQkFBUSxDQUFDLEVBQUMsS0FBSSxNQUErQjtBQUNsRCxRQUFNLE1BQU8sUUFBUSxNQUFLLFFBQVEsSUFBSSxDQUFDO0FBQ3pDLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLHFCQUFxQjtBQUFBLFFBQ25CLFVBQVMsQ0FBQyxLQUFLLFFBQVEsUUFBUSxJQUFJLEdBQUUsa0JBQWtCLENBQUM7QUFBQSxRQUN4RCxVQUFTO0FBQUEsTUFDWCxDQUFDO0FBQUEsTUFDRCxPQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQU87QUFBQSxNQUNMLE1BQUs7QUFBQSxNQUNMLE1BQUs7QUFBQSxNQUNMLE9BQU07QUFBQSxRQUNKLENBQUMsSUFBSSxpQkFBaUIsR0FBRTtBQUFBLFVBQ3RCLFFBQU8sSUFBSTtBQUFBLFVBQ1gsY0FBYTtBQUFBLFVBQ2IsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsUUFDOUM7QUFBQSxNQUNGO0FBQUEsSUFFRjtBQUFBO0FBQUEsSUFFQSxLQUFJO0FBQUEsTUFDRixxQkFBb0I7QUFBQSxRQUNsQixNQUFLO0FBQUEsVUFDSCxtQkFBa0I7QUFBQSxVQUNsQixnQkFBZTtBQUFBLFFBQ2pCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0E7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
