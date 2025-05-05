import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import path from 'path';
import { name as packageName } from './package.json';

const projectName = packageName
  .split('-')
  .map((item) => {
    return item.charAt(0).toUpperCase() + item.slice(1);
  })
  .join('-');

export default defineConfig({
  define: {
    __PROJECT_NAME__: JSON.stringify(projectName),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      // 自动导入GM api
      imports: [util.unimportPreset],
    }),
    Components({
      // 允许子目录作为组件的命名空间前缀
      directoryAsNamespace: true,
    }),
    monkey({
      entry: 'src/index.js',
      userscript: {
        name: 'B站收藏夹分区筛选功能',
        namespace: 'https://github.com/Jayvin-Leung',
        author: 'Jayvin Leung',
        description: '恢复B站收藏夹分区筛选功能',
        license: 'MIT',
        icon: 'https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico',
        homepageURL: `https://github.com/Jayvin-Leung/${projectName}`,
        supportURL: `https://github.com/Jayvin-Leung/${projectName}/issues`,
        match: ['https://space.bilibili.com/*/favlist*'],
        'run-at': 'document-end',
      },
      build: {
        externalGlobals: {
          vue: cdn.npmmirror('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
});
