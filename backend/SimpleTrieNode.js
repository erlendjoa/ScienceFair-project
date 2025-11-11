"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTrieNode = void 0;
var SimpleTrieNode = /** @class */ (function () {
    function SimpleTrieNode() {
        this._children = new Map();
        this._meta = null;
    }
    SimpleTrieNode.prototype.child = function (transition) {
        var node = this._children.get(transition);
        if (node instanceof SimpleTrieNode) {
            return node;
        }
        return null;
    };
    SimpleTrieNode.prototype.is_final = function () {
        return this._meta != null;
    };
    SimpleTrieNode.prototype.get_meta = function () {
        return this._meta;
    };
    SimpleTrieNode.prototype.update_meta = function () {
        if (this._meta != null) {
            this._meta += 1;
        }
        else {
            this._meta = 1;
        }
    };
    SimpleTrieNode.prototype._add = function (string) {
        var trie = this;
        for (var _i = 0, string_1 = string; _i < string_1.length; _i++) {
            var symbol = string_1[_i];
            var nextNode = trie._children.get(symbol);
            if (!(nextNode instanceof SimpleTrieNode)) {
                nextNode = new SimpleTrieNode();
                trie._children.set(symbol, nextNode);
            }
            trie = nextNode;
        }
        trie.update_meta();
    };
    SimpleTrieNode.prototype.add2 = function (strings, analyzer) {
        for (var _i = 0, strings_1 = strings; _i < strings_1.length; _i++) {
            var string = strings_1[_i];
            if (typeof string !== 'string') {
                throw new Error("Input string must be a non-null string.");
            }
            this._add(analyzer.join(string));
        }
    };
    SimpleTrieNode.prototype.searchTrie = function (word, analyzer) {
        var current = this;
        var normalizedWord = analyzer.join(word);
        for (var _i = 0, normalizedWord_1 = normalizedWord; _i < normalizedWord_1.length; _i++) {
            var char = normalizedWord_1[_i];
            current = current ? current.child(char) : null;
            if (!current) {
                return undefined;
            }
        }
        if (current.is_final()) {
            return current.get_meta();
        }
        return undefined;
    };
    return SimpleTrieNode;
}());
exports.SimpleTrieNode = SimpleTrieNode;
