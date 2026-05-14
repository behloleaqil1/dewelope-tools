'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const POSITIVE_WORDS = new Set(['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love', 'happy', 'joy', 'beautiful', 'perfect', 'best', 'brilliant', 'outstanding', 'superb', 'delightful', 'pleasant', 'positive', 'success', 'win', 'enjoy', 'like', 'nice', 'kind', 'helpful', 'grateful', 'thankful', 'blessed', 'incredible']);
const NEGATIVE_WORDS = new Set(['bad', 'terrible', 'horrible', 'awful', 'worst', 'hate', 'ugly', 'sad', 'angry', 'poor', 'fail', 'failure', 'wrong', 'stupid', 'boring', 'annoying', 'disgusting', 'dreadful', 'miserable', 'pathetic', 'useless', 'waste', 'never', 'problem', 'difficult', 'hard', 'pain', 'suffer', 'loss', 'negative']);

/**
 * SentimentWordAnalyzer - Analyzes text for positive and negative word scoring
 */
export default function SentimentWordAnalyzer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ score: number; positive: string[]; negative: string[]; total: number } | null>(null);

  function analyze() {
    if (!input.trim()) return;

    const words = input.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    const positive: string[] = [];
    const negative: string[] = [];

    for (const word of words) {
      if (POSITIVE_WORDS.has(word)) positive.push(word);
      if (NEGATIVE_WORDS.has(word)) negative.push(word);
    }

    const score = positive.length - negative.length;
    setResult({ score, positive, negative, total: words.length });
  }

  const sentiment = result ? (result.score > 0 ? 'Positive' : result.score < 0 ? 'Negative' : 'Neutral') : '';
  const copyText = result ? `Sentiment: ${sentiment} (Score: ${result.score})\nPositive words: ${result.positive.join(', ')}\nNegative words: ${result.negative.join(', ')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to analyze sentiment" aria-label={`Text input for ${toolName}`} className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
      </InputArea>

      <button onClick={analyze} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Analyze Sentiment</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`text-lg font-semibold ${result.score > 0 ? 'text-green-600' : result.score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              Sentiment: {sentiment} (Score: {result.score > 0 ? '+' : ''}{result.score})
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-sm font-semibold text-green-700 mb-1">Positive ({result.positive.length})</div>
                <div className="text-xs text-green-600">{result.positive.length > 0 ? result.positive.join(', ') : 'None found'}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="text-sm font-semibold text-red-700 mb-1">Negative ({result.negative.length})</div>
                <div className="text-xs text-red-600">{result.negative.length > 0 ? result.negative.join(', ') : 'None found'}</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
