"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTrieNode = void 0;
var SimpleAnalyzer_1 = require("./SimpleAnalyzer");
var SimpleTrieNode = /** @class */ (function () {
    function SimpleTrieNode() {
        this._children = new Map();
        this._meta = null;
        this._original = null; // store original-cased word for terminal nodes
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
    SimpleTrieNode.prototype._add = function (normalized, original) {
        var trie = this;
        for (var _i = 0, normalized_1 = normalized; _i < normalized_1.length; _i++) {
            var symbol = normalized_1[_i];
            var nextNode = trie._children.get(symbol);
            if (!(nextNode instanceof SimpleTrieNode)) {
                nextNode = new SimpleTrieNode();
                trie._children.set(symbol, nextNode);
            }
            trie = nextNode;
        }
        trie.update_meta();
        if (trie._original === null) {
            trie._original = original;
        }
    };
    SimpleTrieNode.prototype.add2 = function (strings, analyzer) {
        for (var _i = 0, strings_1 = strings; _i < strings_1.length; _i++) {
            var string = strings_1[_i];
            if (typeof string !== 'string') {
                throw new Error("Input string must be a non-null string.");
            }
            this._add(analyzer.join(string), string);
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
    SimpleTrieNode.prototype.getSuggestions = function (word) {
        // collect up to 3 suggestions that start with `word`, excluding the prefix itself
        var result = [];
        var analyzer = new SimpleAnalyzer_1.SimpleAnalyzer();
        var normalizedPrefix = analyzer.join(word);
        var node = this;
        for (var _i = 0, normalizedPrefix_1 = normalizedPrefix; _i < normalizedPrefix_1.length; _i++) {
            var ch = normalizedPrefix_1[_i];
            node = node ? node.child(ch) : null;
            if (!node)
                return undefined;
        }
        // DFS from node, building suffixes. isRoot=true prevents returning the exact prefix itself.
        var visit = function (n, prefix, isRoot) {
            var _a;
            if (isRoot === void 0) { isRoot = false; }
            if (result.length >= 3)
                return;
            if (n.is_final() && !isRoot) {
                // Only add if not the prefix itself (compare normalized forms)
                if (prefix !== normalizedPrefix) {
                    result.push((_a = n._original) !== null && _a !== void 0 ? _a : prefix);
                    if (result.length >= 3)
                        return;
                }
            }
            var keys = Array.from(n['_children'].keys()).filter(function (k) { return k !== ''; });
            keys.sort();
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var k = keys_1[_i];
                var child = n['_children'].get(k);
                if (child instanceof SimpleTrieNode) {
                    visit(child, prefix + k, false);
                    if (result.length >= 3)
                        return;
                }
            }
        };
        visit(node, normalizedPrefix, true);
        return result.length > 0 ? result : undefined;
    };
    return SimpleTrieNode;
}());
exports.SimpleTrieNode = SimpleTrieNode;
