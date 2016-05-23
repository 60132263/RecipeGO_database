var Recipe_name = require('./models/Recipe_name');
var Ingredient = require('./models/Ingredient');
var Recipe_order = require('./models/Recipe_order');
var Recipe_ingredient = require('./models/Recipe_ingredient');
var fs = require('fs');
var obj = [];
var id = [];

fs.readFile('./items.json', 'utf8', function(error, data) {
  if(error) {
    console.log(error);
  } else {

    var array = data.split("\n");
    for(var i=0; i < array.length-1; i++) {
      obj[i] = JSON.parse(array[i]);
    }

    // // recipe_name
    // for(var i=0; i<obj.length; i++) {
    //   recipe = new Recipe_name({
    //     name: obj[i].name,
    //     img: obj[i].img,
    //     field: obj[i].field,
    //     amount: obj[i].amount
    //   });
    //   recipe.save(function(error) {
    //     if(error) {
    //       console.log(error);
    //     } else {
    //       console.log('save name');
    //     }
    //   });
    // }
    //
    // // Ingredient
    // function subLoop(i, j, callback) {
    //   if(j < obj[i].sub.length) {
    //     console.log('i: '+i+' j: '+j+' obj: '+obj[i].sub[j]);
    //     Ingredient.findOne({name: obj[i].sub[j]}, function(error, same){
    //       if(error) {
    //         console.log(error);
    //       }
    //       // console.log(same);
    //       // if(same === null) {
    //         same = new Ingredient({
    //           name: obj[i].sub[j]
    //         });
    //         same.save(function(error) {
    //           if(error) {
    //             console.log(error);
    //           } else {
    //             console.log('save sub');
    //           }
    //         });
    //       // }
    //     });
    //     subLoop(i, j+1);
    //   }
    // }
    // function mainLoop(i, j, callback) {
    //   if(j < obj[i].main.length) {
    //     console.log('i: '+i+' j: '+j+' obj: '+obj[i].main[j]);
    //     Ingredient.findOne({name: obj[i].main[j]}, function(error, same){
    //       if(error) {
    //         console.log(error);
    //       }
    //       // console.log(same);
    //       // if(same === null) {
    //         same = new Ingredient({
    //           name: obj[i].main[j]
    //         });
    //         same.save(function(error) {
    //           if(error) {
    //             console.log(error);
    //           } else {
    //             console.log('save main');
    //           }
    //         });
    //       // }
    //     });
    //     mainLoop(i, j+1);
    //   }
    // }
    // function seasonLoop(i, j, callback) {
    //   if(j < obj[i].season.length) {
    //     console.log('i: '+i+' j: '+j+' obj: '+obj[i].season[j]);
    //     Ingredient.findOne({name: obj[i].season[j]}, function(error, same){
    //       if(error) {
    //         console.log(error);
    //       }
    //       // console.log(same);
    //       // if(same === null) {
    //         same = new Ingredient({
    //           name: obj[i].season[j]
    //         });
    //         same.save(function(error) {
    //           if(error) {
    //             console.log(error);
    //           } else {
    //             console.log('save season');
    //           }
    //         });
    //       // }
    //     });
    //     seasonLoop(i, j+1);
    //   }
    // }
    // for(var i in obj) {
    //   subLoop(i, 0, function(){
    //     console.log('finish');
    //   });
    //   mainLoop(i, 0, function(){
    //     console.log('finish');
    //   });
    //   seasonLoop(i, 0, function(){
    //     console.log('finish');
    //   });
    // }

    // // Ingredient x
    // for(var i=0; i<obj.length; i++) {
    //   for(var j=0; j<obj[i].sub.length; j++) {
    //     console.log(obj[i].sub[j]);
    //     var ingredient = new Ingredient({
    //       name: obj[i].sub[j]
    //     });
    //     ingredient.save();
    //   }
    // }
    //
    // // Ingredient x
    // function ingredientLoop(i, j, callback) {
    //   if(j < obj[i].sub.length) {
    //     console.log('i: '+i+' j: '+j+' obj: '+obj[i].sub[j]);
    //     var ingredient = new Ingredient({
    //       name: obj[i].sub[j]
    //     });
    //     ingredient.save();
    //     ingredientLoop(i, j+1);
    //   } else {
    //
    //   }
    // }
    // for(var i in obj) {
    //   ingredientLoop(i, 0, function(){
    //     console.log('Finish');
    //   });
    // }

    // // Recipe_order
    // function loopOrder(j, i, id, callback) {
    //   if(j < obj[i].recipe.length) {
    //     var recipe_order = new Recipe_order({
    //       recipe_id: id,
    //       order_number: j,
    //       order: obj[i].recipe[j].replace('\r\n',"")
    //     });
    //     recipe_order.save(function(error){
    //       if(error) {
    //         console.log(error);
    //       } else {
    //         console.log('save order');
    //       }
    //     });
    //     loopOrder(j+1, i, id);
    //   }
    // }

    // Recipe_ingredient
    function loopMainIngredient(j, i, r_id, callback) {
      if(j < obj[i].main.length) {
        Ingredient.findOne({name: obj[i].main[j]}, function(error, same){
          if(error) {
            console.log(error);
          }
          console.log('MainI_Id: '+same.id+' Main: '+same.name);
          var recipe_ingredient = new Recipe_ingredient({
            recipe_id: r_id,
            ingredient_id: same.id,
            ingredient_type: 'main',
            ingredient_amount: obj[i].main_a[j].replace(', ',"").replace(' ',"")
          });
          recipe_ingredient.save(function(error){
            if(error) {
              console.log(error);
            } else {
              console.log('save main_i');
            }
          })
        });
        loopMainIngredient(j+1, i, r_id);
      }
    }
    function loopSubIngredient(j, i, r_id, callback) {
      if(j < obj[i].sub.length) {
        Ingredient.findOne({name: obj[i].sub[j]}, function(error, same){
          if(error) {
            console.log(error);
          }
          console.log('SubI_Id: '+same.id+' Sub: '+same.name);
          var recipe_ingredient = new Recipe_ingredient({
            recipe_id: r_id,
            ingredient_id: same.id,
            ingredient_type: 'sub',
            ingredient_amount: obj[i].sub_a[j].replace(', ',"").replace(' ',"")
          });
          recipe_ingredient.save(function(error){
            if(error) {
              console.log(error);
            } else {
              console.log('save sub_i');
            }
          })
        });
        loopSubIngredient(j+1, i, r_id);
      }
    }
    function loopSeasonIngredient(j, i, r_id, callback) {
      if(j < obj[i].season.length) {
        Ingredient.findOne({name: obj[i].season[j]}, function(error, same){
          if(error) {
            console.log(error);
          }
          console.log('SeasonI_Id: '+same.id+' Season: '+same.name);
          var recipe_ingredient = new Recipe_ingredient({
            recipe_id: r_id,
            ingredient_id: same.id,
            ingredient_type: 'season',
            ingredient_amount: obj[i].season_a[j].replace(', ',"").replace(' ',"")
          });
          recipe_ingredient.save(function(error){
            if(error) {
              console.log(error);
            } else {
              console.log('save season_i');
            }
          })
        });
        loopSeasonIngredient(j+1, i, r_id);
      }
    }

    // mappingId
    function mappingR_Id(i, callback) {
      if(i < obj.length) {
        Recipe_name.findOne({name: obj[i].name}, function(error, same){
          if(error) {
            console.log(error);
          }
          console.log('R_Id: '+same.id);
          // loopOrder(0, i, same.id);
          loopMainIngredient(0, i, same.id);
          loopSubIngredient(0, i, same.id);
          loopSeasonIngredient(0, i, same.id);
        });
        mappingR_Id(i+1);
      }
    }
    mappingR_Id(0, function(){
      console.log('finish');
    });

  }
});
