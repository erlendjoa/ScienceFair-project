import { SimpleAnalyzer } from "./SimpleAnalyzer";

type Meta = number | null


export class SimpleTrieNode {
    private _children: Map<string, SimpleTrieNode> = new Map();
    private _meta: Meta = null;

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

    private _add(string: string): void {
        let trie: SimpleTrieNode = this;
        for (const symbol of string) {
            let nextNode = trie._children.get(symbol);

            if (!(nextNode instanceof SimpleTrieNode)) {
                nextNode = new SimpleTrieNode();
                trie._children.set(symbol, nextNode);
            }
            trie = nextNode;
        }
        trie.update_meta(); 

    }

    public add2(strings: Iterable<string>, analyzer: SimpleAnalyzer): void {
        for (const string of strings) {
            if (typeof string !== 'string') {
                 throw new Error("Input string must be a non-null string.");
            }
            this._add(analyzer.join(string));
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
}