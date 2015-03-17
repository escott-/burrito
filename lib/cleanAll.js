var fs = require("fs");
var receipts = "./receipts/";
var configs = "./orderConfigs/";
fs.readdir(receipts, function(err, files){
  for(var i = 0, j = files.length; i < j; i++){
    fs.unlink(receipts+files[i]);
  }
});
fs.readdir(configs, function(err, files){
  for(var i = 0, j = files.length; i < j; i++){
    fs.unlink(configs+files[i]);
  }
});