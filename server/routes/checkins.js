var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Checkin = require('../models/Checkin');
var User = require('../models/User');
var Venue = require('../models/Venue');

router.get('/', function(req, res, next) {
  Checkin
    .find()
    .lean()
    .populate({path: 'venue', select: 'name location categories'})
    .select({created_at: 1, venue: 1})
    .sort({created_at: -1})
    .limit(500)
    .exec(function(err, checkins) {
      Checkin.populate(checkins, {path: 'venue.categories', model: 'Category', select: 'name icon'}, function(err, checkins) {
        res.send(checkins.reverse());
      })
    })
});

module.exports = router;
