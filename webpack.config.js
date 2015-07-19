var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var config = require('./package').config;

var DEBUG = process.env.NODE_ENV !== 'production';

var BUILD_PATH = path.resolve('./assets');

var entry = {
  app: [
    './app.jsx'
  ]
};

var jsxLoader = ['babel'];
var cssLoader;
var scssLoader;
var fileLoader = 'file-loader?name=[path][name].[ext]';
var jadeLoader = [
  'file-loader?name=[path][name].html',
  'template-html-loader?' + [
    'raw=true',
    'debug=' + DEBUG
  ].join('&')
].join('!');

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin(true),
  new webpack.ProvidePlugin({
    '_': 'lodash',
    moment: 'moment',
    request: 'browser-request',
    classNames: 'classnames',
    React: 'react'
  }),
  new webpack.DefinePlugin({
    API_SERVER: JSON.stringify('http://localhost:' + config.express.port)
  }),
  new webpack.NoErrorsPlugin()
];

if (DEBUG) {
  entry.app.push('webpack-dev-server/client?http://localhost:' + config.webpackPort);
  entry.app.push('webpack/hot/only-dev-server');

  jsxLoader.unshift('react-hot');
  cssLoader = 'style!css!postcss';
  scssLoader = 'style!css!sass';

  plugins.unshift(new webpack.HotModuleReplacementPlugin());
} else {
  cssLoader = ExtractTextPlugin.extract('css!postcss');
  scssLoader = ExtractTextPlugin.extract('css!sass');

  plugins.unshift(new ExtractTextPlugin('app.css', {allChunks: true}));
}

module.exports = {
  context: path.resolve(__dirname, 'client'),
  cache: DEBUG,
  debug: DEBUG,
  target: 'web',
  entry: entry,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: jsxLoader,
        include: path.resolve(__dirname, 'client')
      }, {
        test: /\.css$/,
        loader: cssLoader
      }, {
        test: /\.scss$/,
        loader: scssLoader
      }, {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg$|\.woff$|\.ttf$/,
        loader: fileLoader
      }, {
        test: /\.jade$/,
        loader: jadeLoader
      }
    ]
  },
  postcss: [
    require('autoprefixer-core')
  ],
  plugins: plugins,
  resolve: {
    extensions: ['', '.js', '.json', '.jsx']
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: BUILD_PATH,
    noInfo: false,
    hot: true,
    inline: true,
    stats: { colors: true }
  }
};
