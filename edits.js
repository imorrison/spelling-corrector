var letters = "abcdefghijklmnopqrstuvwxyz".split("");

var deletes = function(arr) {
    var results = [];
    for (var i = 0; i < arr.length; i++) {
        results.push(arr.slice(0, i).join("") + arr.slice(i+1, arr.length).join(""));
    }
    return results;
};

var transposes = function(arr) {
    var results = [];
    for (var i = 0; i < arr.length-1; i++) {
        results.push(arr.slice(0, i).join("") + arr[i+1] + arr[i] + arr.slice(i+2, arr.length).join(""));
    }
    return results;
};

var replaces = function(arr) {
    var results = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < letters.length; j++) {
            results.push(arr.slice(0, i).join("") + letters[j] + arr.slice(i+1, arr.length).join(""));
        }
    }

    return results;
};

var inserts = function(arr) {
    var results = [];
    for (var i = 0; i <= arr.length; i++) {
        for (var j = 0; j < letters.length; j++) {
            results.push(arr.slice(0, i).join("") + letters[j] + arr.slice(i, arr.length).join(""));
        }
    }

    return results;
};

var edits1 = function(word) {
    var arr = word.split("");
    return [].concat(deletes(arr))
             .concat(transposes(arr))
             .concat(replaces(arr))
             .concat(inserts(arr));
};

var edits2 = function(word) {
    var two = [];
    var one = edits1(word);
    one.forEach(function(edit) {
        two = two.concat(edits1(edit))
    });

    return [one, two];
};

module.exports = {
    edits2: edits2,
    edits1: edits1
};


