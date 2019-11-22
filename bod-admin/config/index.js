// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var url = require('../src/scripts/url')
//000000000000000000
module.exports = {
  build: {
    env: require('./prod.env'),
    // index: path.resolve(__dirname, '../static/index.html'),
    assetsRoot: path.resolve(__dirname, '../static'),
    assetsSubDirectory: './',
    assetsPublicPath: '../',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8000,
    autoOpenBrowser: true,
    assetsSubDirectory: './',
    assetsPublicPath: '/static',
    proxyTable: {
      '/api': {
        // target: 'http://192.168.3.126:8080/api',
        //http://101.132.45.246:9083
        target: 'http://localhost:8081/api', 
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      } 
    },
    cssSourceMap: false
  }
}
