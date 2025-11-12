interface Analyzer {
    join(s: string): string;
}

export class SimpleAnalyzer implements Analyzer {
    public join(s: string): string {
        // normalize by lowercasing and removing whitespace so 'b a n a n a' matches 'Banana'
        return s.toLowerCase().replace(/\s+/g, '');
    }
}