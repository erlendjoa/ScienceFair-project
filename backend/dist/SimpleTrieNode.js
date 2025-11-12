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
    update_meta() {
        if (this._meta != null) {
            this._meta += 1;
        }
        else {
            this._meta = 1;
        }
    }
    _add(normalized, original) {
        let trie = this;
        for (const symbol of normalized) {
            let nextNode = trie._children.get(symbol);
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
    }
    add2(strings, analyzer) {
        for (const string of strings) {
            if (typeof string !== 'string') {
                throw new Error("Input string must be a non-null string.");
            }
            this._add(analyzer.join(string), string);
        }
    }
    searchTrie(word, analyzer) {
        let current = this;
        const normalizedWord = analyzer.join(word);
        for (const char of normalizedWord) {
            current = current ? current.child(char) : null;
            if (!current) {
                return undefined;
            }
        }
        if (current.is_final()) {
            return current.get_meta();
        }
        return undefined;
    }
    getSuggestions(word) {
        // collect up to 3 suggestions that start with `word`, excluding the prefix itself
        const result = [];
        const analyzer = new SimpleAnalyzer_1.SimpleAnalyzer();
        const normalizedPrefix = analyzer.join(word);
        let node = this;
        for (const ch of normalizedPrefix) {
            node = node ? node.child(ch) : null;
            if (!node)
                return undefined;
        }
        // DFS from node, building suffixes. isRoot=true prevents returning the exact prefix itself.
        const visit = (n, prefix, isRoot = false) => {
            if (result.length >= 3)
                return;
            if (n.is_final() && !isRoot) {
                // Only add if not the prefix itself (compare normalized forms)
                if (prefix !== normalizedPrefix) {
                    result.push(n._original ?? prefix);
                    if (result.length >= 3)
                        return;
                }
            }
            const keys = Array.from(n['_children'].keys()).filter(k => k !== '');
            keys.sort();
            for (const k of keys) {
                const child = n['_children'].get(k);
                if (child instanceof SimpleTrieNode) {
                    visit(child, prefix + k, false);
                    if (result.length >= 3)
                        return;
                }
            }
        };
        visit(node, normalizedPrefix, true);
        return result.length > 0 ? result : undefined;
    }
}
exports.SimpleTrieNode = SimpleTrieNode;
