'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Suggestion { type: string; message: string; severity: 'info' | 'warning' | 'error'; }

/**
 * ParagraphRewriterSuggestions - Analyzes a paragraph and provides improvement suggestions.
 */
export default function ParagraphRewriterSuggestions({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const analyze = () => {
    setError(undefined);
    setSuggestions([]);
    if (!text.trim()) { setError('Please enter a paragraph to analyze'); return; }

    const results: Suggestion[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);

    // Sentence length analysis
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);
    if (longSentences.length > 0) {
      results.push({ type: 'Length', message: `${longSentences.length} sentence(s) exceed 25 words. Consider breaking them into shorter sentences for clarity.`, severity: 'warning' });
    }

    // Repeated sentence starts
    const starts = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase());
    const startCounts: Record<string, number> = {};
    starts.forEach(s => { if (s) startCounts[s] = (startCounts[s] || 0) + 1; });
    const repeated = Object.entries(startCounts).filter(([, c]) => c > 2);
    if (repeated.length > 0) {
      results.push({ type: 'Variety', message: `Sentences repeatedly start with "${repeated[0][0]}" (${repeated[0][1]} times). Vary your sentence openings.`, severity: 'warning' });
    }

    // Weak words
    const weakWords = ['very', 'really', 'just', 'quite', 'rather', 'somewhat', 'basically', 'actually', 'literally'];
    const foundWeak = weakWords.filter(w => new RegExp(`\\b${w}\\b`, 'gi').test(text));
    if (foundWeak.length > 0) {
      results.push({ type: 'Precision', message: `Weak/filler words found: ${foundWeak.join(', ')}. Replace with stronger, more specific language.`, severity: 'info' });
    }

    // Paragraph length
    if (words.length > 150) {
      results.push({ type: 'Structure', message: 'Paragraph exceeds 150 words. Consider splitting into multiple paragraphs for better readability.', severity: 'warning' });
    }

    // Passive voice check
    const passivePattern = /\b(is|are|was|were|been|being)\s+\w+ed\b/gi;
    const passiveMatches = text.match(passivePattern) || [];
    if (passiveMatches.length > 2) {
      results.push({ type: 'Voice', message: `${passiveMatches.length} passive constructions found. Use active voice for more engaging writing.`, severity: 'info' });
    }

    // Adverb overuse
    const adverbs = text.match(/\b\w+ly\b/gi) || [];
    if (adverbs.length > 3) {
      results.push({ type: 'Adverbs', message: `${adverbs.length} adverbs found. Consider using stronger verbs instead of verb+adverb combinations.`, severity: 'info' });
    }

    // Topic sentence check
    if (sentences.length > 0 && sentences[0].split(/\s+/).length > 30) {
      results.push({ type: 'Opening', message: 'Opening sentence is very long. A concise topic sentence helps readers understand the paragraph quickly.', severity: 'info' });
    }

    if (results.length === 0) {
      results.push({ type: 'Overall', message: 'Your paragraph looks well-structured. No major issues detected.', severity: 'info' });
    }

    setSuggestions(results);
  };

  const copyText = suggestions.map(s => `[${s.type}] ${s.message}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Paragraph to Analyze</label>
        <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a paragraph here to get improvement suggestions..." aria-label={`Paragraph input for ${toolName}`} className="input-field min-h-[120px]" />
      </InputArea>
      <button onClick={analyze} aria-label="Get writing suggestions" className="btn-primary">Get Suggestions</button>
      <OutputArea hasContent={suggestions.length > 0}>
        {suggestions.length > 0 && (
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <div key={i} className={`p-3 rounded-lg border ${s.severity === 'error' ? 'bg-red-50 border-red-200' : s.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${s.severity === 'error' ? 'bg-red-100 text-red-700' : s.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{s.type}</span>
                </div>
                <div className="text-sm text-gray-700">{s.message}</div>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
