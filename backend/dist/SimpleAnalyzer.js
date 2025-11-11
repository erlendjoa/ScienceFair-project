"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAnalyzer = void 0;
class SimpleAnalyzer {
    join(s) {
        // normalize by lowercasing and removing whitespace so 'b a n a n a' matches 'Banana'
        return s.toLowerCase().replace(/\s+/g, '');
    }
}
exports.SimpleAnalyzer = SimpleAnalyzer;
