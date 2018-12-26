const path = require('path');
function resolve(dir) {
  return path.join(__dirname, '.', dir);
}
module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    //proxy: 'http://192.168.2.170:8081/',
    proxy: 'http://192.168.2.171:8081/',
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
  },

  pwa: {
    name: '东经云盘'
  }
};
