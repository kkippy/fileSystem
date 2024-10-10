import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin} from "vite-plugin-svg-icons";
import path from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs:[path.resolve(process.cwd(),'src/assets/icons')],
      symbolId:'icon-[dir]-[name]',
    }),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // server:{
  //   proxy:{
  //     [env.VITE_APP_BASE_API]:{
  //       target:env.VITE_SERVE,
  //       changeOrigin:true,
  //       rewrite:path=>path.replace(/^\/api/,'')
  //     }
  //   }
  // },
  //scss全局配置
  css:{
    preprocessorOptions:{
      scss:{
        javascriptEnabled:true,
        additionalData:`@import "@/styles/variables.scss"; `
      }
    }
  }
})
