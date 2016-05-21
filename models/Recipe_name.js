var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true, trim: true}
}, {
  toJSON: {virtuals: true },
  toObject: {virtuals: true}
});

var Survey = mongoose.model('Recipe_name', schema);

module.exports = Recipe_name;
