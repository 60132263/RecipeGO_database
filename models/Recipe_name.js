var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true, unique: true},
  img: {type: String, required: true},
  field: {type: String, required: true},
  amount: {type: String, required: true}
}, {
  toJSON: {virtuals: true },
  toObject: {virtuals: true}
});

var Recipe_name = mongoose.model('Recipe_name', schema);

module.exports = Recipe_name;
