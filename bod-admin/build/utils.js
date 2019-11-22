var path = require('path')
var glob = require('glob')
var config = require('../config')
var fs = require('fs')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // =========
  // SASS 配置
  // =========
  function resolveResouce (name) {
    var tmp = path.resolve(__dirname, '../src/assets/sass/common/' + name)
    console.dir(tmp)
    return tmp
  }

  function generateSassResourceLoader () {
    var loaders = [
      cssLoader,
      // 'postcss-loader',
      'sass-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          // it need a absolute path
          resources: [resolveResouce('my-special.scss')]
        }
      }
    ]
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateSassResourceLoader(),
    scss: generateSassResourceLoader(),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.getJsEntry = function (globPath) {
  let entries = {}, basename
  glob.sync(globPath).forEach(function (entry) {
    let htmlName = entry.substring(0, entry.lastIndexOf('.')) + '.html'
    try {
      fs.statSync(htmlName, fs.F_OK)
      basename = path.basename(entry, path.extname(entry))
      entries[basename] = ['babel-polyfill', entry]
      console.log(htmlName)

    } catch (error) {

    }
  })
  return entries
}

exports.getTemplatePath = function (globPath) {
  let entries = {}, basename
  glob.sync(globPath).forEach(function (entry) {
    let jsName = entry.substring(0, entry.lastIndexOf('.')) + '.js'
    try {
      fs.statSync(jsName, fs.F_OK)
      basename = path.basename(entry, path.extname(entry))
      entries[basename] = entry
      console.log(jsName)

    } catch (error) {

    }
  })
  return entries
}
