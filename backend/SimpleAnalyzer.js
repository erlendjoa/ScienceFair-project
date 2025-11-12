"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleAnalyzer = void 0;
var SimpleAnalyzer = /** @class */ (function () {
    function SimpleAnalyzer() {
    }
    SimpleAnalyzer.prototype.join = function (s) {
        // normalize by lowercasing and removing whitespace so 'b a n a n a' matches 'Banana'
        return s.toLowerCase().replace(/\s+/g, '');
    };
    return SimpleAnalyzer;
}());
exports.SimpleAnalyzer = SimpleAnalyzer;
