interface Analyzer {
    join(s: string): string;
}

export class SimpleAnalyzer implements Analyzer {
    public join(s: string): string {
        return s.toLowerCase();
    }
}