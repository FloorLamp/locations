var mongoose = require('mongoose');
var moment = require('moment');

var schema = new mongoose.Schema({
  _id: String,
  name: String,
  location: {
    lat: Number,
    lng: Number,
    address: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  },
  categories: [
    {
      _id: String,
      name: String,
      primary: Boolean
    }
  ],
  created_at: Number,
  updated_at: Number,
});

schema.pre('update', function() {
  this.update({}, { $set: { updated_at: moment().unix() } });
});

schema.pre('save', function(next) {
  var now = moment().unix();
  this.updated_at = now;
  if (!this.created_at) this.created_at = now;

  next();
});

var Venue = mongoose.model('Venue', schema);

module.exports = Venue;
