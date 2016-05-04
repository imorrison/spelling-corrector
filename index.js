var fs = require("fs");
var readline = require("readline");

var Trie = function() {
    var data = {};

    var insert = function(word) {
        var length = word.length;
        var temp = data;
        var curr;

        for (var i = 0; i < length; i++) {
            curr = word[i];

            if (temp.hasOwnProperty(curr)) {
                temp = temp[curr];
            } else {
                temp[word[i]] = {}
                temp = temp[word[i]];
            }

            if (i === word.length - 1) {
                temp["$"] = true;
            }
        }
    };

    var contains = function(word) {
        var length = word.length;
        var temp = data;
        var curr;
        for (var i = 0; i < length; i++) {
            curr = word[i];

            if (temp.hasOwnProperty(curr)) {
                temp = temp[curr];
            } else {
                return false;
            }

            if (i === word.length - 1) {
                return temp["$"]
            }

        }
    };

    var containsPrefix = function(word) {
        var length = word.length;
        var temp = data;
        var curr;
        for (var i = 0; i < length; i++) {
            curr = word[i];

            if (temp.hasOwnProperty(curr)) {
                temp = temp[curr];
            } else {
                return false;
            }

        }
        return true;
    };

    var print = function() {
        console.log(JSON.stringify(data));
    };

    return {
        insert: insert,
        contains: contains,
        containsPrefix: containsPrefix,
        print: print
    };
};

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
    if (temp.length === 0 ) temp = [""];

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

var randomIndex = function(len) {
    return Math.floor(Math.random() * len);
};

var uppercaseAtIndex = function(arr, i) {
    arr[i] = arr[i].toUpperCase();
};

var repeatLetterAtIndex = function(arr, i) {
    arr[i] = arr[i] + arr[i];
};

var readDict = readline.createInterface({
    input: fs.createReadStream("/usr/share/dict/words")
});

var askForWord = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readDict.on("line", function(line) {
    DICT.insert(line.toLowerCase());
});

readDict.on("close", function() {
    start()
});

var attempt = function(word) {
    if (DICT.contains(word)) {
        console.log(word);
        return true
    }
};

var start = function() {
    askForWord.question("> ", function(answer) {
        var normalized = answer.toLowerCase();
        if (attempt(normalized)) {
            start();
            return;
        }

        var noDoubles = multiplesToSingle(normalized);

        if (attempt(noDoubles.join(""))) {
            start();
            return;
        }

        var onlyDoubles = multiplesToDouble(normalized);

        if (attempt(onlyDoubles.join(""))) {
            start();
            return;
        }

        var p1 = vowelPermutations(normalized);
        var p2 = vowelPermutations(noDoubles);

        var finalP = p1.concat(p2);

        for (var i = 0; i < finalP.length; i++) {
            if (attempt(finalP[i])) {
                start();
                return;
            }
        }

        console.log("NO CORRECTION");
        start();
    });
};



