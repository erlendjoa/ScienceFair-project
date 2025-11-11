import { SimpleAnalyzer } from "./SimpleAnalyzer";

type Meta = number | null


export class SimpleTrieNode {
    private _children: Map<string, SimpleTrieNode> = new Map();
    private _meta: Meta = null;
    private _original: string | null = null; // store original-cased word for terminal nodes

    public child(transition: string): SimpleTrieNode | null {
        const node = this._children.get(transition);
        if (node instanceof SimpleTrieNode) {
            return node;
        }
        return null;
    }

    public is_final(): boolean {
        return this._meta != null;
    }
    public get_meta(): Meta {
        return this._meta;
    }
    public update_meta(): void {
        if (this._meta != null) {
            this._meta += 1
        }
        else {
            this._meta = 1
        }
    }

    private _add(normalized: string, original: string): void {
        let trie: SimpleTrieNode = this;
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

    public add2(strings: Iterable<string>, analyzer: SimpleAnalyzer): void {
        for (const string of strings) {
            if (typeof string !== 'string') {
                throw new Error("Input string must be a non-null string.");
            }
            this._add(analyzer.join(string), string);
        }
    }

    public searchTrie(word: string, analyzer: SimpleAnalyzer): Meta | undefined {
        let current: SimpleTrieNode | null = this;
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

    public getSuggestions(word: string): string[] | undefined {
        // collect up to 3 suggestions that start with `word`, excluding the prefix itself
        const result: string[] = [];
        const analyzer = new SimpleAnalyzer();
        const normalizedPrefix = analyzer.join(word);
        let node: SimpleTrieNode | null = this;
        for (const ch of normalizedPrefix) {
            node = node ? node.child(ch) : null;
            if (!node) return undefined;
        }
        // DFS from node, building suffixes. isRoot=true prevents returning the exact prefix itself.
        const visit = (n: SimpleTrieNode, prefix: string, isRoot: boolean = false) => {
            if (result.length >= 3) return;
            if (n.is_final() && !isRoot) {
                // Only add if not the prefix itself (compare normalized forms)
                if (prefix !== normalizedPrefix) {
                    result.push(n._original ?? prefix);
                    if (result.length >= 3) return;
                }
            }
            const keys = Array.from(n['_children'].keys()).filter(k => k !== '');
            keys.sort();
            for (const k of keys) {
                const child = n['_children'].get(k);
                if (child instanceof SimpleTrieNode) {
                    visit(child, prefix + k, false);
                    if (result.length >= 3) return;
                }
            }
        };
        visit(node, normalizedPrefix, true);
        return result.length > 0 ? result : undefined;
    }
}