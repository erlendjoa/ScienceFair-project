// test.ts
import { SimpleTrieNode } from "./SimpleTrieNode";
import { SimpleAnalyzer } from "./SimpleAnalyzer";

// Utility function for consistent logging
function test(name: string, assertion: () => boolean): void {
    const result = assertion();
    const status = result ? 'PASS' : 'FAIL';
    console.log(`${status}: ${name}`);
    if (!result) {
        console.error(`\t\tAssertion failed in test: ${name}`);
    }
}

// --- Setup ---
console.log("--- Starting SimpleTrieNode Tests ---");
const analyzer = new SimpleAnalyzer();
const root = new SimpleTrieNode();

// --- Test 1: Initial State ---
test("Initial state: Trie is empty and 'is_final' is false", () => {
    return !root.is_final() && root.get_meta() === null;
});

// --- Test 2: Adding and Searching a single word ---
const words = ["Apple", "App", "Banana"];
root.add2(words, analyzer);

test("Search for 'Apple' (meta should be 1)", () => {
    return root.searchTrie("Apple", analyzer) === 1;
});
test("Search for 'App' (meta should be 1)", () => {
    return root.searchTrie("App", analyzer) === 1;
});
test("Search for 'Banana' (meta should be 1)", () => {
    return root.searchTrie("Banana", analyzer) === 1;
});

// --- Test 3: Case and Space Normalization (from SimpleAnalyzer mock) ---
test("Search with different casing ('aPpLe')", () => {
    return root.searchTrie("aPpLe", analyzer) === 1;
});
test("Search with spaces ('b a n a n a')", () => {
    return root.searchTrie("b a n a n a", analyzer) === 1;
});

// --- Test 4: Re-adding words to check meta update ---
root.add2(["Apple", "App"], analyzer);

test("Search for 'Apple' after re-add (meta should be 2)", () => {
    return root.searchTrie("Apple", analyzer) === 2;
});
test("Search for 'App' after re-add (meta should be 2)", () => {
    return root.searchTrie("App", analyzer) === 2;
});
test("Search for 'Banana' (meta should still be 1)", () => {
    return root.searchTrie("Banana", analyzer) === 1;
});

// --- Test 5: Non-existent words ---
test("Search for non-existent word 'Cherry' (should be undefined)", () => {
    return root.searchTrie("Cherry", analyzer) === undefined;
});

// --- Test 6: Partial match check (word not explicitly added) ---
test("Search for partial word 'Appl' (should be undefined)", () => {
    return root.searchTrie("Appl", analyzer) === undefined;
});

// --- Test 7: Full match is required (is_final logic) ---
test("Search for longer word 'Application' (not added, should be undefined)", () => {
    // Note: 'App' is a prefix, but 'Application' was never added as a full word.
    return root.searchTrie("Application", analyzer) === undefined;
});

// --- Test 8: Error handling in add2 ---
test("Error handling for non-string input in add2", () => {
    try {
        root.add2([123 as any], analyzer); // Casting to simulate invalid input
        return false; // Should not reach here
    } catch (e: any) {
        return e.message === "Input string must be a non-null string.";
    }
});

console.log("--- Tests Complete ---");