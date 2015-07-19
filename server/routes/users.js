var express = require('express');
var router = express.Router();

var User = require('../models/User');

router.get('/', function(req, res, next) {
  User.find({}, function(err, user) {
    res.send(user);
  })
});

module.exports = router;
