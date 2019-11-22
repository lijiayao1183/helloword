var path = require('path')
var glob = require('glob')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#module-eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery',
      videojs: 'video.js'
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/lib'),
        to: '../static/lib',
        ignore: ['.*']
      }
    ])
  ]
})


const pages = utils.getTemplatePath('./src/**/*.html');
for (const pathname in pages) {
  const conf = {
    filename: path.resolve(__dirname, path.join('../static/html', pathname + '.html')), // html文件输出路径
    template: path.resolve(__dirname, path.join('../', pages[pathname])), // k
    inject: true,
    favicon: path.resolve('favicon.ico')
  };

  if (pathname in webpackConfig.entry) {
    conf.chunks = [pathname, 'vendors', 'manifest']//给html引入js文件
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
}

module.exports = webpackConfig;
