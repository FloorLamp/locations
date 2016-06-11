var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./package').config;

var webpack_config = require('./webpack.config');

var server = new WebpackDevServer(
  webpack(webpack_config),
  webpack_config.devServer
);

server.listen(config.webpackPort, 'localhost', function (err) {
  if (err) console.log(err);
  console.log('webpack devserver listening on', config.webpackPort);
});
