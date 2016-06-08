var Recipe = require('./models/Recipe');
var Ingredient = require('./models/Ingredient');
var Recipe_ingredient = require('./models/Recipe_ingredient');
var fs = require('fs');
var obj = [];
var temp = [];

// Recipe콜렉션에 데이터를 넣어줌
function insertRecipe(recipe) {
  var recipe = new Recipe({
    name: recipe.name,
    img: recipe.img,
    amount: recipe.amount,
    order_count: recipe.order.length,
    ingredient_count: recipe.main.length,
    main_ingredient: recipe.main,
    season_ingredient: recipe.season,
    main_amount: recipe.main_a,
    season_amount: recipe.season_a,
    order_list: recipe.order
  });
  recipe.save(function(error) {
    if(error) {
      console.log(error);
    } else {
      console.log('save recipe_name: '+recipe.name);
    }
  });
}

// Ingredient콜렉션에 데이터를 넣어줌
function insertIngredient(recipe, j) {
  if(j < recipe.main.length) {
    var ingredient = new Ingredient({
      name: recipe.main[j]
    });
    Ingredient.findOneAndUpdate({name: recipe.main[j]}, ingredient, {upsert: true}, function(error) {
      if(error) {
        console.log('already exist!: '+recipe.main[j]);
      } else {
        console.log('save ingredient: '+recipe.main[j]);
      }
    });
    insertIngredient(recipe, j+1);
  }
}

// Recipe_ingredient콜렉션에 데이터를 넣어줌
function insert(recipe_id, ingredient_id, ingredient) {
  var recipe_ingredient = new Recipe_ingredient({
    recipe_id: recipe_id,
    ingredient_id: ingredient_id,
    ingredient_amount: ingredient
  });
  recipe_ingredient.save(function(error){
    if(error) {
      console.log(error);
    } else {
      console.log('save '+recipe_id+' ingredient '+ingredient_id+': '+ingredient);
    }
  });
}

// Recipe_ingredient콜렉션에 데이터를 넣어줌
function insertRecipeIngredient(recipe) {
  // 레시피에 알맞는 아이디 탐색
  Recipe.findOne({name: recipe.name}, function(error, same){
    if(error) {
      console.log('cannot find recipe id!!\n'+error);
    } else {
      for(var j in recipe.main) {
        (function(recipe_id, recipe, j){
          // 재료에 알맞는 아이디 탐색 후 데이터를 넣어줌
          mappingId(recipe.main[j], recipe_id);
        })(same.id, recipe, j);
      }
    }
  });
}
function mappingId(ingredient, recipe_id) {
  Ingredient.findOne({name: ingredient}, function(error, same){
    if(error) {
      console.log('cannot find ingredient id!!\n'+error);
    } else {
      var recipe_ingredient = new Recipe_ingredient({
        recipe_id: recipe_id,
        ingredient_id: same.id,
        ingredient_amount: ingredient
      });
      recipe_ingredient.save(function(error){
        if(error) {
          console.log(error);
        } else {
          console.log('save '+recipe_id+' ingredient '+same.id+': '+ingredient);
        }
      });
    }
  });
}

// Recipe_ingredient콜렉션을 채우기 전 베이스가 되는 콜렉션(Recipe, Ingredient)에 먼저 데이터를 채워줌
function insertBase(obj, callback) {
  for(var i in obj) {
    insertRecipe(obj[i]);
    insertIngredient(obj[i], 0);
  }
  callback();
}

fs.readFile('./items.json', 'utf8', function(error, data) {
  if(error) {
    console.log(error);
  } else {

    // JSON형태의 데이터를 스플릿하고 파싱해서 사용가능한 형태로 만듬
    var array = data.split("\n");
    for(var i=0; i < array.length-1; i++) {
      temp[i] = JSON.parse(array[i]);
    }

    // 만약 중복된 이름의 레시피 데이터가 존재할 경우 삭제
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

    // 서브재료와 메인재료의 구분을 없앰
    for(var i in obj) {
      var k=0;
      for(var j=obj[i].main.length; k<obj[i].sub.length; j++,k++){
        obj[i].main[j] = obj[i].sub[k];
        obj[i].main_a[j] = obj[i].sub_a[k];
      }
    }

    // 불필요한 기호 제거
    for(var i in obj) {
      for(var j in obj[i].order) {
        obj[i].order[j] = obj[i].order[j].replace('\r\n',"").replace('  ',"");
      }
      for(var j in obj[i].main_a) {
        obj[i].main_a[j] = obj[i].main_a[j].replace(',',"").replace(' ',"");
      }
      for(var j in obj[i].season_a) {
        obj[i].season_a[j] = obj[i].season_a[j].replace(',',"").replace(' ',"");
      }
    }

    // 레시피 데이터들을 원하는 형태로 데이터베이스에 저장
    insertBase(obj, function() {
      for(var i in obj) {
        insertRecipeIngredient(obj[i]);
      }
    });

  }
});
