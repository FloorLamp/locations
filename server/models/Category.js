var mongoose = require('mongoose');
var moment = require('moment');

var schema = new mongoose.Schema({
  _id: String,
  name: String,
  plural_name: String,
  short_name: String,
  icon: String,
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

var Category = mongoose.model('Category', schema);

module.exports = Category;
