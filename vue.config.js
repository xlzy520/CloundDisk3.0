const path = require('path')
function resolve(dir) {
  return path.join(__dirname, '.', dir)
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
    .rule('svg-sprite-loader')
    .test(/.svg$/)
    .include
    .add(resolve('src/icons')) //处理svg目录
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]'
    });
    // const svgRule = config.module.rule('svg');
    // // 清除已有的所有 loader。
    // // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    // svgRule.uses.clear();
    // svgRule
    // .use('svg-sprite-loader')
    // .loader('svg-sprite-loader')
    // .options({
    //   symbolId: 'icon-[name]'
    // });
  },

  pwa: {
    name: '东经云盘'
  }
};
