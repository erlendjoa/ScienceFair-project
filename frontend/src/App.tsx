import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

function find_last_word(sentence: String): String {
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
  // put in logic here
  const suggested_words = [last_word, "2", "1", "3"];
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
