'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface SentenceMetric { text: string; words: number; clauses: number; complexity: 'simple' | 'moderate' | 'complex'; }

/**
 * SentenceComplexityAnalyzer - Analyzes text and provides complexity metrics per sentence.
 */
export default function SentenceComplexityAnalyzer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<{ sentences: SentenceMetric[]; avgWords: number; avgClauses: number } | null>(null);

  const analyze = () => {
    setError(undefined);
    setResults(null);
    if (!text.trim()) { setError('Please enter text to analyze'); return; }

    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) { setError('No sentences detected'); return; }

    const clauseMarkers = /\b(which|that|because|although|while|when|if|unless|since|whereas|however|therefore|moreover|furthermore|nevertheless|but|and|or|yet|so|nor)\b/gi;

    const metrics: SentenceMetric[] = sentences.map(s => {
      const words = s.split(/\s+/).filter(w => w.length > 0).length;
      const clauseMatches = s.match(clauseMarkers) || [];
      const clauses = clauseMatches.length + 1;
      let complexity: 'simple' | 'moderate' | 'complex';
      if (words <= 15 && clauses <= 1) complexity = 'simple';
      else if (words <= 25 && clauses <= 2) complexity = 'moderate';
      else complexity = 'complex';
      return { text: s.trim(), words, clauses, complexity };
    });

    const avgWords = metrics.reduce((sum, m) => sum + m.words, 0) / metrics.length;
    const avgClauses = metrics.reduce((sum, m) => sum + m.clauses, 0) / metrics.length;

    setResults({ sentences: metrics, avgWords, avgClauses });
  };

  const copyText = results ? `Average words/sentence: ${results.avgWords.toFixed(1)}\nAverage clauses/sentence: ${results.avgClauses.toFixed(1)}\n\n${results.sentences.map((s, i) => `${i + 1}. [${s.complexity}] ${s.words} words, ${s.clauses} clauses`).join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Analyze</label>
        <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your text here. Each sentence will be analyzed for complexity." aria-label={`Text input for ${toolName}`} className="input-field min-h-[120px]" />
      </InputArea>
      <button onClick={analyze} aria-label="Analyze sentence complexity" className="btn-primary">Analyze</button>
      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{results.avgWords.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Avg words/sentence</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{results.avgClauses.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Avg clauses/sentence</div>
              </div>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {results.sentences.map((s, i) => (
                <div key={i} className={`p-3 rounded-lg border ${s.complexity === 'simple' ? 'bg-green-50 border-green-200' : s.complexity === 'moderate' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${s.complexity === 'simple' ? 'bg-green-100 text-green-700' : s.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{s.complexity}</span>
                    <span className="text-xs text-gray-500">{s.words} words, {s.clauses} clause(s)</span>
                  </div>
                  <div className="text-sm text-gray-700 line-clamp-2">{s.text}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
