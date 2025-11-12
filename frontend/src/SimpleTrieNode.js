"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTrieNode = void 0;
const SimpleAnalyzer_1 = require("./SimpleAnalyzer");
class SimpleTrieNode {
    constructor() {
        this._children = new Map();
        this._meta = null;
        this._original = null; // store original-cased word for terminal nodes
    }
    child(transition) {
        const node = this._children.get(transition);
        if (node instanceof SimpleTrieNode) {
            return node;
        }
        return null;
    }
    is_final() {
        return this._meta != null;
    }
    get_meta() {
        return this._meta;
    }
    update_meta(freq) {
        this._meta = freq;
    }
    set_meta(new_meta) {
        this._meta = new_meta;
    }
    _add(normalized, original, freq) {
        let trie = this;
        for (const symbol of normalized) {
            let nextNode = trie._children.get(symbol);
            if (!(nextNode instanceof SimpleTrieNode)) {
                nextNode = new SimpleTrieNode();
                trie._children.set(symbol, nextNode);
            }
            trie = nextNode;
        }
        trie.update_meta(freq);
        if (trie._original === null) {
            trie._original = original;
        }
    }
    add2(strings, analyzer) {
        // Use an explicit iterator to support older TS targets without downlevelIteration
        const iterator = strings[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done) {
            const str = next.value;
            if (typeof str !== "string") {
                throw new Error("Input string must be a non-null string.");
            }
            this._add(analyzer.join(str), str, 1);
            next = iterator.next();
        }
    }
    add3(strings, analyzer, freqencies) {
        // Use an explicit iterator to support older TS targets without downlevelIteration
        const iterator = strings[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done) {
            const str = next.value;
            if (typeof str !== "string") {
                throw new Error("Input string must be a non-null string.");
            }
            const joined_str = analyzer.join(str);
            this._add(joined_str, str, freqencies[joined_str] ?? 1);
            next = iterator.next();
        }
    }
    getSuggestions(word) {
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
            keys.sort(function (a, b) {
                var ca = n['_children'].get(a);
                var cb = n['_children'].get(b);
                var ma = (ca instanceof SimpleTrieNode && typeof ca._meta === 'number') ? ca._meta : 0;
                var mb = (cb instanceof SimpleTrieNode && typeof cb._meta === 'number') ? cb._meta : 0;
                if (mb !== ma)
                    return mb - ma; // descending by metascore
                return a < b ? -1 : a > b ? 1 : 0; // tie-breaker: lexical
            });
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
}
exports.SimpleTrieNode = SimpleTrieNode;
