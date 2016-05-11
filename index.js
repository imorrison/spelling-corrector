#!/usr/bin/env node
var Model = require("./count_big.json");
var fs = require("fs");
var readline = require("readline");
var Trie = require("./trie");
var Edits = require("./edits");

var pickBest = function(wordArr) {
    var possible = [];
    var currentBest = [ "NONE", 0 ];
    wordArr.forEach(function(word) {
        var score = Model[word]
        if (score) {
            possible.push(word);
            if (score >= currentBest[1]) {
                currentBest = [ word, score ];
            }
        }
    });
    //console.log(possible);
    return currentBest[0];
};


wordCount = readline.createInterface({
    input: fs.createReadStream(__dirname + "/spell-errors.txt")
});

wordCount.on("line", function(line) {
    var record = line.split(":");
    var correct = record[0];
    var spellingErrors = record[1]
        .replace(/ /g, "")
        .replace(/\*/g, "")
        .replace(/[1-9]+/g, "")
        .split(",");

    spellingErrors.forEach(function(wordError) {
        var permutations = Edits.edits2(wordError);
        var best = pickBest(permutations[0]);
        if (best === correct) {
            console.log("\nCorrect: Picked:", best, " For: ", wordError);
            return;
        }

        best = pickBest(permutations[1]);

        if (best === correct) {
            console.log("\nCorrect: Picked:", best, " For: ", wordError);
        } else {
            console.log("\n", wordError, "  Picked: ", best, " For: ", correct);
        }
    });
});

wordCount.on("close", function() {
    console.log("---> finished <---");
});

