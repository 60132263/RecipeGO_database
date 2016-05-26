var mongoose = require('mongoose');
var Ingredient = require('./models/Ingredient');
var Recipe_ingredient = require('./models/Recipe_ingredient');

// mongodb connect
mongoose.connect('mongodb://60132263:dutls123@ds061984.mlab.com:61984/surveyna');
mongoose.connection.on('error', console.log);

var temp = [];
var ingredient_id = [];
var ingredients = [];

Recipe_ingredient.find(function(err, lists) {
  for(var i in lists) {
    if(lists[i].ingredient_type === 'main') {
      temp[temp.length] = lists[i].ingredient_id;
    }
  }
  for(var i in temp) {
    var check = true;
    if(i===0) {
      ingredient_id[i]=temp[i];
    }
    for(var j in ingredient_id) {
      if(temp[i]===ingredient_id[j]) {
        check = false;
      }
    }
    if(check!==false){
      ingredient_id[ingredient_id.length] = temp[i];
    }
  }
  for(var i in ingredient_id) {
    (function(i) {
      Ingredient.findById(ingredient_id[i], function(err, temp){
        ingredients[i] = temp.name;
        if(i==ingredient_id.length-1) {
          if(name) {
            res.send(ingredients.filter(function(ingredient) {
              return (ingredient.name).toLowerCase().indexOf(name.toLowerCase()) > -1;
            });
          } else {
            res.send(ingredients)
          }
        }
      });
    })(i);
  }
});
