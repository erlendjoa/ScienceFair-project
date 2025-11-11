import { SimpleAnalyzer } from "./SimpleAnalyzer";
import { SimpleTrieNode } from "./SimpleTrieNode";


var analyzer: SimpleAnalyzer = new SimpleAnalyzer;
var root: SimpleTrieNode = new SimpleTrieNode;


var words = ["Apple", "App", "Banana"]; // TODO: ADD DICTIONARY
root.add2(words, analyzer);