var fs = require("fs");
var receipts = "./receipts/";
console.log(receipts);
fs.readdir(receipts, function(err, files){
    for(var i = 0, j = files.length; i < j; i++){
        fs.unlink(receipts+files[i]);
    }
    console.log("Done!");
});
