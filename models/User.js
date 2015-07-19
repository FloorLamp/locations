var mongoose = require('mongoose');
var moment = require('moment');

var schema = new mongoose.Schema({
  created_at: Number,
  updated_at: Number,
  name: {
    first: String,
    last: String,
  },
  email: String,
  photo: String,
  foursquare: {
    id: {type: String, unique: true},
    access_token: String,
  },
  checkins: [{type: mongoose.Schema.Types.ObjectId, ref: 'Checkin'}]
}, {
  id: false,
});

schema.virtual('name.full').get(function() {
  return `${this.name.first} ${this.name.last}`;
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

var User = mongoose.model('User', schema);

module.exports = User;
