module.exports = {
  devServer: {
    host: 'localhost',
    port: 80,
    https: false,
    open: true,
    hotOnly: true,
    disableHostCheck: true
  },
  outputDir: './dist',
  assetsDir: './assets/',
  publicPath: './',
  indexPath: './index.html',
  transpileDependencies: ['vuetify']
}
