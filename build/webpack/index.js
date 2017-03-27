import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import InlineChunksWebpackPlugin from 'inline-chunks-html-webpack-plugin'
// import OfflinePlugin from 'offline-plugin'
import * as style from './style'
import path from 'path'
import _debug from 'debug'
import config, { paths } from '../config'
const { __DEV__, __PROD__, __TEST__ } = config.globals

const debug = _debug('koa:webpack:config')
const assetsPath = _path => path.posix.join(config.dir_static, _path)
const svgBase = paths.src('assets/icons/')

debug('Create configuration.')
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: config.compiler_devtool,
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      paths.src(),
      paths.base('node_modules')
    ],
    alias: {
      'src': paths.src(),
      'assets': paths.src('assets'),
      'views': paths.src('views'),
      'components': paths.src('components'),
      'directives': paths.src('directives'),
      'routers': paths.src('routers'),
      'stores': paths.src('stores'),
      'mixins': paths.src('mixins'),
      'filters': paths.src('filters'),
      'utils': paths.src('utils'),
      'apis': paths.src('apis')
    }
  },
  module: {},
  node: {
    fs: 'empty'
  }
}

// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY_PATH = paths.src('main.js')

webpackConfig.entry = {
  app: __DEV__
    ? [APP_ENTRY_PATH, 'webpack-hot-middleware/client']
    : [APP_ENTRY_PATH],
  vendor: config.compiler_vendor
}

// ------------------------------------
// Bundle Output
// ------------------------------------

webpackConfig.output = {
  path: paths.dist(),
  publicPath: config.compiler_public_path,
  filename: assetsPath(`[name].[${config.compiler_hash_type}].js`),
  chunkFilename: assetsPath(`[id].[${config.compiler_hash_type}].js`)
}

// ------------------------------------
// Externals
// ------------------------------------

webpackConfig.externals = {
  'ga': 'window.ga',
  'wx': 'window.jWeixin'
}

// ------------------------------------
// Pre-Loaders
// ------------------------------------

const preLoaders = [
  {
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    exclude: /node_modules/,
    options: {
      formatter: require('eslint-friendly-formatter')
    }
  }
]

// ------------------------------------
// Loaders
// ------------------------------------

const rules = [
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      loaders: style.cssLoaders({
        extract: __PROD__
      }),
      postcss: [
        require('autoprefixer')({
          browsers: ['> 5%']
        })
      ]
    }
  },
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.json$/,
    loader: 'json-loader'
  },
  {
    test: /\.svg$/,
    loader: 'svg-sprite-loader',
    include: svgBase
  },
  {
    test: /\.(png|jpe?g|gif|svg|webp|woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    exclude: svgBase,
    query: {
      limit: 5000,
      name: assetsPath('[name].[hash:7].[ext]')
    }
  }
]

webpackConfig.module.rules = [...preLoaders, ...rules]

if (__DEV__) {
  [].concat(webpackConfig.module.rules, style.styleLoaders())
  webpackConfig.module.rules = [...webpackConfig.module.rules, ...style.styleLoaders()]
}

if (__PROD__) {
  webpackConfig.module.rules = [...webpackConfig.module.rules, ...style.styleLoaders({ sourceMap: false, extract: true })]
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  // generate dist index.html with correct asset hash for caching.
  // you can customize output by editing /index.html
  // see https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: paths.src('index.html'),
    favicon: paths.src('static/favicon.ico'),
    hash: false,
    inject: true,
    minify: {
      removeComments: config.compiler_html_minify,
      removeAttributeQuotes: config.compiler_html_minify,
      collapseWhitespace: config.compiler_html_minify,
      minifyJS: config.compiler_html_minify
    }
  }),
  new CopyWebpackPlugin([{
    from: paths.src('static')
  }], {
    ignore: ['*.ico', '*.md']
  })
]

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  )
}

if (__PROD__) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackConfig.plugins.push(
    // new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 10240 // ~10kb
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: assetsPath('[name].[contenthash:20].css')
    }),
    // minimize files
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new InlineChunksWebpackPlugin({
      inlineChunks: ['manifest'],
      deleteFile: true
    }),
    // new OfflinePlugin()
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  )
}

export default webpackConfig
