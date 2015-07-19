'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors')
var express = require('express');
var logger = require('winston');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');

var config = require('../package').config;

var app = express();
var db = mongoose.connection;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/checkins', require('./routes/checkins'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.send({
      message: err.message,
      status: err.status,
      stack: err.stack.split('\n')
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  logger.error(err);
  res.status(err.status || 500);
  res.send({
    message: err.message,
  });
});

mongoose.connect(config.db.url);

db.on('error', logger.error.bind(this, 'connection error:'));
db.once('open', function(callback) {
  logger.info('connected to mongo');

  app.listen(config.express.port, function() {
    logger.info('server listening on', config.express.port)
  });
});
// module.exports = app;
