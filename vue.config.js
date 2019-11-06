const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}
module.exports = {
  devServer: {
    proxy: {
      '/djcpsdocument': {
        //target: 'http://192.168.2.181:8081/', //德煌
        // target: 'https://www.easy-mock.com/mock/5c47cda4f513860f4ceef676/', //mock
        //target: 'http://192.168.2.21:8888/', //朱诚
        //target: 'http://192.168.2.171:8888/', //弘权
        //target: 'http://192.168.2.65:8082/', //弘权
        // target: 'http://192.168.23.179:8016/', // 开发环境!!
        target: 'http://192.168.23.172', // 线上环境
        // target: 'http://192.168.25.218:8016/', // 预开发环境
        // target: 'http://localhost:8081/', // 预开发环境
        changeOrigin: true,
      }
    },
    port: 9528,
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  chainWebpack: config => {
    config.module
          .rule('svg')
          .exclude.add(resolve('src/icons'))
          .end();

          config.module
          .rule('icons')
          .test(/\.svg$/)
          .include.add(resolve('src/icons'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
          });
    config.resolve.alias
          .set('@', resolve('src'));
//TODO 分块
  },
  configureWebpack: config => {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // 只打包初始时依赖的第三方
          },
          elementUI: {
            name: 'chunk-elementUI', // 单独将 elementUI 拆包
            priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
            test: /[\\/]node_modules[\\/]element-ui[\\/]/
          }
        }
      },
      runtimeChunk: 'single',
    };
  },
  pwa: {
    name: '东经云盘'
  }
};
