#!/usr/bin/env node
var fs = require("fs");
var readline = require("readline");
var Trie = require("./trie");

var DICT = Trie();

var multiplesToSingle = function(wordArray) {
    var newWord = [];
    for (var i = 0; i < wordArray.length; i++) {
        if (i === 0) newWord.push(wordArray[i])

        if (i > 0 && wordArray[i-1] !== wordArray[i]) {
            newWord.push(wordArray[i])
        }
    }
    return newWord;
};

var multiplesToDouble = function(wordArray) {
    var newWord = [];
    var count = 0;

    for (var i = 0; i < wordArray.length; i++) {
        if (i > 0 && wordArray[i-1] === wordArray[i]) {
            count++;
            if (count < 2) newWord.push(wordArray[i])

        } else {
            count = 0;
            newWord.push(wordArray[i])
        }
    }
    return newWord;
};

var mapVowel = function(arr, vowel) {
    var returnVal = [];
    var temp = arr.slice();
    if (temp.length === 0 ) temp = [];

    temp.forEach(function(str) {
        var newPrefix = str + vowel
        if(DICT.containsPrefix(newPrefix)) {
            returnVal.push(newPrefix)
        }
    });

    return returnVal;
};

var vowelPermutations = function(wordArray) {
    var r = new RegExp("[aeiou]");
    var length = wordArray.length;
    var permutations = [""];

    for (var index = 0; index < length; index++ ) {
        if (r.test(wordArray[index])) {
            var temp = permutations.slice();
            var a = mapVowel(temp, "a");
            var e = mapVowel(temp, "e");
            var i = mapVowel(temp, "i");
            var o = mapVowel(temp, "o");
            var u = mapVowel(temp, "u");
            permutations = a.concat(e).concat(i).concat(o).concat(u);

        } else {
            permutations = permutations.map(function(str) {
                return str + wordArray[index];
            });
        }
    }

    return permutations;
};

var swapIndex = function(wordArray, char, index) {
    var arr = wordArray.slice();
    arr[index] = char;
    return arr.join("");
};

var singleVowelEdit = function(wordArray) {
    var r = new RegExp("[aeiou]");
    var length = wordArray.length;
    var edits = [];

    for (var index = 0; index < length; index++) {
        if (r.test(wordArray[index])) {
            edits.push(swapIndex(wordArray, "a", index));
            edits.push(swapIndex(wordArray, "e", index));
            edits.push(swapIndex(wordArray, "i", index));
            edits.push(swapIndex(wordArray, "o", index));
            edits.push(swapIndex(wordArray, "u", index));
        }
    }

    return edits;
};

var attempt = function(word) {
    if (DICT.contains(word)) {
        return true
    }
};

var correction = function(word) {
    var normalized = word.toLowerCase();
    if (attempt(normalized)) {
        return normalized;
    }

    var noDoubles = multiplesToSingle(normalized);

    if (attempt(noDoubles.join(""))) {
        return noDoubles.join("");
    }

    var onlyDoubles = multiplesToDouble(normalized);

    if (attempt(onlyDoubles.join(""))) {
        return onlyDoubles.join("");
    }

    var p1 = singleVowelEdit(normalized.split(""));
    var p2 = singleVowelEdit(noDoubles)
    var finalP = p1.concat(p2);

    for (var i = 0; i < finalP.length; i++) {
        if (attempt(finalP[i])) {
            return finalP[i];
        }
    }


    var p3 = vowelPermutations(normalized);
    var p4 = vowelPermutations(noDoubles);

    var finalP2 = p3.concat(p4);

    for (var i = 0; i < finalP2.length; i++) {
        if (attempt(finalP2[i])) {
            return finalP2[i];
        }
    }

    return "NO CORRECTION";
};


var readDict = readline.createInterface({
    input: fs.createReadStream("/usr/share/dict/words")
});

readDict.on("line", function(line) {
    DICT.insert(line.toLowerCase());
});

var askForWord = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var LOADED = false;
var buffered = [];

var start = function() {
    askForWord.question("> ", respond);
};

var respond = function(answer) {
    var words = answer.split(/\s+/).filter(Boolean);

    if (LOADED) {
        words.forEach(function(w) {
            console.log(correction(w));
        });
    } else {
        buffered = buffered.concat(words);
    }

    start();
};

start();

readDict.on("close", function() {
    LOADED = true;
    respond(buffered.join(" "));
});

