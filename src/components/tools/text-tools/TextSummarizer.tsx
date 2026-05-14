'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextSummarizer - Extracts key sentences from text using extractive summarization.
 */
export default function TextSummarizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('');
  const [sentenceCount, setSentenceCount] = useState(3);
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ summary: string[]; originalSentences: number; compressionRatio: number } | null>(null);

  const summarize = () => {
    setError(undefined);
    setResult(null);
    if (!text.trim()) { setError('Please enter text to summarize'); return; }

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    if (sentences.length <= sentenceCount) {
      setResult({ summary: sentences.map(s => s.trim()), originalSentences: sentences.length, compressionRatio: 100 });
      return;
    }

    // Build word frequency (excluding stop words)
    const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'and', 'but', 'or', 'not', 'so', 'if', 'that', 'this', 'it', 'its', 'i', 'we', 'you', 'he', 'she', 'they', 'my', 'your', 'his', 'her', 'their', 'our']);
    const allWords = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
    const wordFreq: Record<string, number> = {};
    allWords.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });

    // Score each sentence
    const scored = sentences.map((sentence, index) => {
      const words = sentence.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2);
      const score = words.reduce((sum, w) => sum + (wordFreq[w] || 0), 0) / Math.max(words.length, 1);
      // Boost first and last sentences slightly
      const positionBoost = index === 0 ? 1.5 : index === sentences.length - 1 ? 1.2 : 1;
      return { sentence: sentence.trim(), score: score * positionBoost, index };
    });

    // Select top N sentences, maintain original order
    const topSentences = [...scored]
      .sort((a, b) => b.score - a.score)
      .slice(0, sentenceCount)
      .sort((a, b) => a.index - b.index)
      .map(s => s.sentence);

    const summaryWordCount = topSentences.join(' ').split(/\s+/).length;
    const originalWordCount = text.split(/\s+/).length;
    const compressionRatio = Math.round((summaryWordCount / originalWordCount) * 100);

    setResult({ summary: topSentences, originalSentences: sentences.length, compressionRatio });
  };

  const copyText = result ? result.summary.join(' ') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text to Summarize</label>
            <textarea id={`${toolId}-input`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a long article or text here..." aria-label={`Text input for ${toolName}`} className="input-field min-h-[120px]" />
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of key sentences: {sentenceCount}</label>
            <input id={`${toolId}-count`} type="range" min="1" max="10" value={sentenceCount} onChange={(e) => setSentenceCount(parseInt(e.target.value))} aria-label="Number of sentences to extract" className="w-full" />
          </div>
        </div>
      </InputArea>
      <button onClick={summarize} aria-label="Summarize text" className="btn-primary">Summarize</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.originalSentences}</div>
                <div className="text-xs text-gray-500">Original Sentences</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-lg font-bold text-green-700">{result.compressionRatio}%</div>
                <div className="text-xs text-gray-500">Of Original Length</div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium mb-2">Key Sentences:</div>
              <div className="text-sm text-gray-800 space-y-2">
                {result.summary.map((s, i) => (
                  <p key={i}>{s}</p>
                ))}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
