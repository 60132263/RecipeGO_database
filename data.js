var fs = require('fs');
var obj = [];

fs.readFile('./items.json', 'utf8', function(error, data) {
  if(error) {
    console.log(error);
  } else {
    var array = data.split("\n");
    for(var i=0; i < array.length-1; i++) {
      obj[i] = JSON.parse(array[i]);
      console.log(obj[i].name);
    }
  }
});
