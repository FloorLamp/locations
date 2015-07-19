'use strict';

var _ = require('lodash');
var async = require('async');
var logger = require('winston');
var moment = require('moment');
var request = require('request');
var mongoose = require('mongoose');

var Category = require('../models/Category');
var Checkin = require('../models/Checkin');
var User = require('../models/User');
var Venue = require('../models/Venue');

var db = mongoose.connection;
var config = require('../../package').config;
mongoose.connect(config.db.url);

const USER_URL = 'https://api.foursquare.com/v2/users/self';
const CHECKIN_URL = 'https://api.foursquare.com/v2/users/self/checkins';


function fetch_user(token, cb) {
  request.get({
    url: USER_URL,
    qs: {
      v: '20150718',
      oauth_token: token,
    },
    json: true,
  }, function(err, res, body) {
    if (err) {
      logger.error(err);
      return cb();
    }
    if (res.statusCode !== 200) {
      logger.error(res.statusCode, body);
      return cb();
    }
    if (body.meta.code !== 200) {
      logger.warn(body)
      return cb();
    }

    var user_data = body.response.user;

    User.findOneAndUpdate(
      {'foursquare.id': user_data.id},
      {
        name: {
          first: user_data.firstName,
          last: user_data.lastName,
        },
        email: user_data.contact.email,
        photo: user_data.photo.prefix + user_data.photo.suffix,
        foursquare: {
          id: user_data.id,
          access_token: token
        },
      },
      {
        upsert: true,
        new: true
      },
      function(err, user) {
        if (err) logger.error(err);
        logger.info('Processed user', user.name.full, user.email);
        cb(user);
      }
    );
  });
}

function fetch_checkins(user, cb) {
  var keep_fetching = true;
  var beforeTimestamp;
  var inserted_count = 0;
  var insert_total = 0;

  async.doWhilst(function(cb) {
    // when fetching is done, wait for inserts to finish
    if (beforeTimestamp === -1) {
      if (inserted_count == insert_total) {
        keep_fetching = false;
      }
      return cb();
    }

    var qs = {
      v: '20150717',
      oauth_token: user.foursquare.access_token,
      limit: 250,
      beforeTimestamp
    };
    logger.info(`fetching checkins for ${user.name.full} with qs:`, qs);

    request.get({
      url: CHECKIN_URL,
      qs,
      json: true,
    }, function(err, res, body) {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      if (res.statusCode !== 200) {
        logger.error(res.statusCode, body);
        return cb(body);
      }
      if (body.meta.code !== 200) {
        logger.warn(body.meta.code, body)
        return cb(body);
      }
      if (body.response.checkins.items && body.response.checkins.items.length) {
        if (beforeTimestamp === undefined) logger.info('total checkins:', body.response.checkins.count);
        insert_total++;
        beforeTimestamp = body.response.checkins.items.slice(-1)[0].createdAt;
        insert_checkins(user, body.response.checkins.items, function(err) {
          inserted_count++;
          cb(err);
        });
      } else {
        beforeTimestamp = -1;
        cb();
      }
    });
  }, function() { // test
    return keep_fetching;
  }, function(err) {
    cb(err);
  })
}

function insert_checkins(user, items, cb) {
  async.each(_.filter(items, function(item) {
    return item.type === 'checkin';
  }), function(item, cb) {
    Checkin.findOne({'foursquare.id': item.id}, function(err, checkin) {
      if (err) logger.error(err);
      if (checkin) {
        return cb();
      }

      if (!item.venue) {
        logger.warn('missing venue', item);
        create_checkin(user, item, cb);
        return;
      }

      // create venue
      Venue.findOne({id: item.venue.id}, function(err, venue) {
        if (err) logger.error('findOne Venue:', err);
        if (venue) return;

        var new_venue = Venue({
          _id: item.venue.id,
          name: item.venue.name,
          location: {
            lat: item.venue.location.lat,
            lng: item.venue.location.lng,
            address: item.venue.location.address,
            city: item.venue.location.city,
            state: item.venue.location.state,
            postal_code: item.venue.location.postalCode,
            country: item.venue.location.country,
          },
          categories: _.pluck(item.venue.categories, 'id')
        });
        new_venue.save(function(err) {
          if (err && err.code !== 11000) { // skip dupes
            logger.error('save venue:', err);
          } else {
            logger.info('create venue', item.venue.id, item.venue.name);
          }
        });

        // create categories
        async.each(item.venue.categories, function(category, cb) {

          Category.findOne({id: category.id}, function(err, found_category) {
            if (err) logger.error('findOne Category:', err);
            if (found_category) return cb();

            var new_category = Category({
              _id: category.id,
              name: category.name,
              plural_name: category.pluralName,
              short_name: category.shortName,
              icon: category.icon.prefix + 'bg_32' + category.icon.suffix
            });
            new_category.save(function(err) {
              if (err && err.code !== 11000) { // skip dupes
                logger.error('save category:', err);
              } else {
                logger.info('create category', category.name);
              }
              cb();
            });
          });

        }, function() {
          create_checkin(user, item, cb);
        });
      });
    });
  }, function(err) {
    if (err) logger.error(err);
    logger.info('processed', items.length, 'checkins');
    cb();
  });
}

function create_checkin(user, item, cb) {
  var new_checkin = Checkin({
    user: user._id,
    created_at: item.createdAt,
    foursquare: {
      id: item.id
    },
    venue: item.venue ? item.venue.id : null
  });
  new_checkin.save(function(err) {
    if (err) logger.error('save checkin:', err);
    logger.info('create checkin', item.id);
    cb(err);
  });
}

db.on('error', logger.error.bind(this, 'connection error:'));
db.once('open', function(callback) {
  logger.info('connected to mongo');

  User.findOne({}, function(err, user) {
    fetch_checkins(user, function(err) {
      db.close();
    });
  });
});

module.exports = {
  fetch_user,
  fetch_checkins
};
