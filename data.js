var Recipe_name = require('./models/Recipe_name');
var Ingredient = require('./models/Ingredient');
var Recipe_order = require('./models/Recipe_order');
var Recipe_ingredient = require('./models/Recipe_ingredient');
var fs = require('fs');
var obj = [];
var temp = [];

// insert recipe_name function
function saveRecipeName(name, img, field, amount) {
  var recipe_name = new Recipe_name({
    name: name,
    img: img,
    field: field,
    amount: amount
  });
  recipe_name.save(function(error) {
    if(error) {
      console.log(error);
    } else {
      console.log('save recipe_name: '+name);
    }
  });
}

// insert ingredient function
function saveIngredient(name) {
  var ingredient = new Ingredient({
    name: name
  });
  Ingredient.findOneAndUpdate({name: name}, ingredient, {upsert: true}, function(error) {
    if(error) {
      console.log(error);
    } else {
      console.log('save ingredient: '+name);
    }
  });
}
function loopMainIngredient(i, data, callback) {
  if(i < data.main.length) {
    saveIngredient(data.main[i]);
    loopMainIngredient(i+1, data);
  }
}
function loopSubIngredient(i, data, callback) {
  if(i < data.sub.length) {
    saveIngredient(data.sub[i]);
    loopSubIngredient(i+1, data);
  }
}
function loopSeasonIngredient(i, data, callback) {
  if(i < data.season.length) {
    saveIngredient(data.season[i]);
    loopSeasonIngredient(i+1, data);
  }
}

// insert recipe_order function
function saveRecipeOrder(id, number, order) {
  var recipe_order = new Recipe_order({
    recipe_id: id,
    order_number: number,
    order: order.replace('\r\n',"")
  });
  recipe_order.save(function(error){
    if(error) {
      console.log(error);
    } else {
      console.log('save '+id+' order: '+order.replace('\r\n',""));
    }
  });
}
function loopOrder(id, data, j, callback) {
  if(j < data.recipe.length) {
    saveRecipeOrder(id, j, data.recipe[j]);
    loopOrder(id, data, j+1);
  }
}

// insert recipe_ingredient function
function saveIngredient_R(recipe_id, ingredient_id, type, data) {
  var recipe_ingredient = new Recipe_ingredient({
    recipe_id: recipe_id,
    ingredient_id: ingredient_id,
    ingredient_type: type,
    ingredient_amount: data.replace(', ',"").replace(' ',"")
  });
  recipe_ingredient.save(function(error){
    if(error) {
      console.log(error);
    } else {
      console.log('save '+recipe_id+' ingredient '+ingredient_id+': '+data.replace(', ',"").replace(' ',""));
    }
  });
}
function loopMainIngredient_R(recipe_id, data, j, callback) {
  if(j < data.main.length) {
    Ingredient.findOne({name: data.main[j]}, function(error, same){
      if(error) {
        console.log(error);
      }
      saveIngredient_R(recipe_id, same.id, 'main', data.main_a[j]);
    });
    loopMainIngredient_R(recipe_id, data, j+1);
  }
}
function loopSubIngredient_R(recipe_id, data, j, callback) {
  if(j < data.sub.length) {
    Ingredient.findOne({name: data.sub[j]}, function(error, same){
      if(error) {
        console.log(error);
      }
      saveIngredient_R(recipe_id, same.id, 'sub', data.sub_a[j]);
    });
    loopSubIngredient_R(recipe_id, data, j+1);
  }
}
function loopSeasonIngredient_R(recipe_id, data, j, callback) {
  if(j < data.season.length) {
    Ingredient.findOne({name: data.season[j]}, function(error, same){
      if(error) {
        console.log(error);
      }
      saveIngredient_R(recipe_id, same.id, 'season', data.season_a[j]);
    });
    loopSeasonIngredient_R(recipe_id, data, j+1);
  }
}

// mappingId
function mappingR_Id(data) {
  Recipe_name.findOne({name: data.name}, function(error, same){
    if(error) {
      console.log(error);
    }
    loopOrder(same.id, data, 0);
    loopMainIngredient_R(same.id, data, 0);
    loopSubIngredient_R(same.id, data, 0);
    loopSeasonIngredient_R(same.id, data, 0);
  });
}

// insert base data (recipe_name, ingredient)
function insert_base(obj, callback) {
  for(var i in obj) {
    saveRecipeName(obj[i].name, obj[i].img, obj[i].field, obj[i].amount);
    loopMainIngredient(0, obj[i]);
    loopSubIngredient(0, obj[i]);
    loopSeasonIngredient(0, obj[i]);
  }
  callback();
}

fs.readFile('./items.json', 'utf8', function(error, data) {
  if(error) {
    console.log(error);
  } else {

    // parse JSON data list
    var array = data.split("\n");
    for(var i=0; i < array.length-1; i++) {
      temp[i] = JSON.parse(array[i]);
    }

    // if recipe name is duplicate, remove its list
    for(var i in temp) {
      var check = true;
      if(i===0) {
        obj[i]=temp[i];
      }
      for(var j in obj) {
        if(temp[i].name===obj[j].name) {
          check = false;
        }
      }
      if(check!==false){
        obj[obj.length] = temp[i];
      }
    }

    // insert data
    insert_base(obj, function() {
      for(var i in obj) {
        mappingR_Id(obj[i]);
      }
    })

  }
});
