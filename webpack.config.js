'use strict'
var path = require('path')
var webpack = require('webpack')
var glob = require('globby')
var config = require('./build/config.js')

var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
  comments: false,
  compress: {
    warnings: false
  }
})

/**
 * 获取所有的JS文件入口
 * @returns 
*/
function getEntries() {
  var map = {}
  var fileList = glob.sync([
    'src/**/*.js',
    '!src/**/_*.js',
    '!src/js/lib/**/*.js',
    '!src/js/util/**/*.js',
    '!src/js/react/common.js',
    '!src/css/**/*.js',
  ])

  fileList.forEach(function (file) {
    var name = path.basename(file)
    var filePath = path.relative('src', file)
    map[filePath] = filePath
  })
  return map
}

module.exports = [
  {
    context: __dirname,
    devtool: '#source-map',
    entry: getEntries(),
    output: {
      path: path.join(__dirname, config.output),
      filename: '[name]'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: ['es2015']
          }
        }
      ]
    },
    /**
     * 必须配置这个，否则报找不到  babel-loader
     * 因为配置文件没有放在根目录
     */
    resolveLoader: {
      root: path.resolve(__dirname, 'node_modules')
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
        }
      }),
      uglifyJsPlugin
    ],
    externals: {
      'react': 'var React',
      'react-dom': 'var ReactDOM',
      'react-addons-css-transition-group': 'var ReactCSSTransitionGroup'
    },
    resolve: {
      root: path.join(__dirname, config.root),
      extensions: ['', '.js', '.jsx'],
    }
  }, {
    entry: {
      'common': './src/js/react/common.js'
    },
    output: {
      path: path.join(__dirname, config.output + '/js/react'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: ['es2015']
          }
        }
      ]
    },
    resolve: {
      root: path.resolve(__dirname, 'node_modules')
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      uglifyJsPlugin
    ]
  }
]
