import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin} from "vite-plugin-svg-icons";
import path from "path";
import {UserConfigExport,ConfigEnv,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default ({mode}:ConfigEnv):UserConfigExport=>{
  const env  = loadEnv(mode,process.cwd())//加载的模式为开发环境（默认为开发环境），文件所在位置为项目根目录
return {
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
  server:{
    proxy:{
      [env.VITE_APP_BASE_API]:{
        target:env.VITE_SERVE,
        changeOrigin:true,
        // ws:true,
        rewrite:path=>path.replace(/^\/api/,'')
      }
    },

  },
  //scss全局配置
  css:{
    preprocessorOptions:{
      scss:{
        javascriptEnabled:true,
        additionalData:`@import "@/styles/variables.scss"; `
      }
    }
  }
}
}
