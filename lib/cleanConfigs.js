var fs = require("fs");
var configs = "./orderConfigs/";
fs.readdir(configs, function(err, files){
    for(var i = 0, j = files.length; i < j; i++){
        fs.unlink(configs+files[i]);
    }
});
