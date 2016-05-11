var fs = require("fs");
var readline = require("readline");

var json = {};

wordCount = readline.createInterface({
    input: fs.createReadStream(__dirname + "/count_big.txt")
});

wordCount.on("line", function(line) {
    var word = /[a-zA-Z]+/.exec(line)[0]
    var count = /[1-9]+/.exec(line)[0]
    json[word] = Number(count)
});

wordCount.on("close", function() {
    console.log("---> finished reading");
    console.log(JSON.stringify(json));
});

