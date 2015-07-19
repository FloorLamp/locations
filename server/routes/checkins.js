var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Checkin = require('../models/Checkin');
var Venue = require('../models/Venue');

router.get('/', function(req, res, next) {
  Checkin
    .find()
    .populate('venue', 'name location categories')
    .select({created_at: 1, venue: 1})
    .sort({created_at: -1})
    .limit(500)
    .exec(function(err, checkins) {
      res.send(checkins);
    })
});

module.exports = router;
