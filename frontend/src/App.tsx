import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

var SimpleTrieNode_1 = require("./SimpleTrieNode");
var SimpleAnalyzer_1 = require("./SimpleAnalyzer");

var analyzer = new SimpleAnalyzer_1.SimpleAnalyzer();
var root = new SimpleTrieNode_1.SimpleTrieNode();
(async () => {
  try {
    // Fetch CSV and word list from the public root; ensure the files are placed in the public folder
    const url = new URL('./words_freq.csv', import.meta.url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load words_freq.csv: ${res.status}`);
    const text = await res.text();
    console.log(text)
    // split into non-empty lines and remove header
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const dataLines = lines.slice(1); // drop header row

    // build tuples: [lemma, freq] in a type-safe way
    const wordFreqTuples: Record<string, number> = dataLines.reduce((acc, line) => {
      const cols = line.split(',');
      // require at least 4 columns where lemma is at index 1 and freq at index 3
      if (cols.length < 4) return acc;
      const lemma = (cols[1] ?? "").trim();
      if (lemma.length === 0) return acc;
      const freq = Number(cols[3]);
      acc[lemma] = isNaN(freq) ? 0 : freq;
      return acc;
    }, {} as Record<string, number>);
    console.log(wordFreqTuples)
    console.log("WORDFREQTUPLES ^^^")

    const url1 = new URL('./words_alpha.txt', import.meta.url);
    const res1 = await fetch(url1);
    if (!res1.ok) throw new Error(`Failed to load words_alpha.txt: ${res1.status}`);
    const text1 = await res1.text();
    console.log(text1)
    const words = text1.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    // Add all words from the file to the trie
    root.add3(words, analyzer, wordFreqTuples);
  } catch (err) {
    console.error(err);
  }
})();

function find_last_word(sentence: String): String {
  console.log(root)
  if (sentence.length === 0) {
    return "";
  } else {
    const splitted = sentence.split(" ");
    const last = splitted.at(-1)
    if (last) {
      return last;
    } else {
      return "";
    }
  }
}

function suggest_words(sentence: String): String[] {
  const last_word = find_last_word(sentence);
  const suggested_words = root.getSuggestions(last_word);
  if (suggested_words == null) {
    return ["asd", "abc", "cde"]
  }
  return suggested_words;
}

function InputField() {
  const [inputValue, setInputValue] = useState("")

  return (
    <div className="w-full h-full border-2 border-black">
      <div className="flex w-full justify-center items-center space-x-2">
        {suggest_words(inputValue).map((word, idx) => (
          <>
            <span key={idx} className="px-2 py-1">
              {word}
            </span>
            <span>|</span>
          </>
        ))}
      </div>
      <input
        className="w-full border border-gray-300"
        value={inputValue}
        onChange={e => setInputValue(e.currentTarget.value)}
      />
    </div>
  )
}


function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <header className="text-center">
        <h1 className="text-2xl font-bold mb-4">Very cool autocorrect demo!</h1>
        <div>
          <InputField />
        </div>
      </header>
    </div>
  );
}

export default App;
