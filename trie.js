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

module.exports = Trie;
