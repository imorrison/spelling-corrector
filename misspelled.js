#!/usr/bin/env node

var randomIndex = function(len) {
    return Math.floor(Math.random() * len);
};

var uppercaseAtIndex = function(arr, i) {
    arr[i] = arr[i].toUpperCase();
};

var repeatLetterAtIndex = function(arr, i) {
    arr[i] = arr[i] + arr[i];
};

var swapRandomVowel = function(arr, i) {
    var vowels = ["a", "e", "i", "o", "u"];
    var index = randomIndex(vowels.length);
    var vowel = vowels[index];
    arr[i] = vowel;
};

var vowelIndices = function(arr) {
    var indices = [];
    var r = new RegExp("[aeiou]");

    for (var i = 0; i < arr.length; i++) {
        if (r.test(arr[i]))  {
            indices.push(i);
        }
    }

    return indices;
};

var misspell = function(word) {
    var arr = word.split("");
    var len = arr.length;
    var vowels = vowelIndices(word);
    var vowelIndex = vowels[randomIndex(len)];

    repeatLetterAtIndex(arr, randomIndex(len));
    swapRandomVowel(arr, vowelIndex);
    uppercaseAtIndex(arr, randomIndex(len));

    return arr.join("");
};

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(text) {
    var words = text.split(/\s+/).filter(Boolean);
    var output = words.map(misspell).join(" ");
    console.log(output);

    process.exit(0);
});

