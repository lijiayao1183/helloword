const config = require('../config')
const webpack = require('webpack')

const vendors = [
  'axios',
  'babel-polyfill',
  'bootstrap',
  'echarts',
  'element-ui',
  'iview',
  'jquery',
  'lodash',
  'node-uuid',
  'vee-validate',
  'vue',
  'vue-echarts-v3',
  'vue-router',
  'vuex'
]

module.exports = {
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    library: '[name]',
  },
  entry: {
    'lib': vendors,
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      name: '[name]',
      context: __dirname,
    }),
  ],
}
