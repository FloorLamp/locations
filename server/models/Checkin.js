var moment = require('moment');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  venue: {type: mongoose.Schema.Types.ObjectId, ref: 'Venue'},
  foursquare: {
    id: {type: String, unique: true}
  },
  is_deleted: {type: Boolean, default: false},
  created_at: Number,
  updated_at: Number,
}, {
  id: false,
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
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

var Checkin = mongoose.model('Checkin', schema);

module.exports = Checkin;
