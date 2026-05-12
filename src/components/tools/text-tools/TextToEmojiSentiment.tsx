'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const POSITIVE_WORDS = ['happy', 'love', 'great', 'good', 'amazing', 'wonderful', 'excellent', 'fantastic', 'beautiful', 'awesome', 'joy', 'excited', 'brilliant', 'perfect', 'best', 'glad', 'pleased', 'delighted', 'cheerful', 'grateful', 'thankful', 'blessed', 'incredible', 'superb', 'outstanding', 'magnificent', 'terrific', 'marvelous', 'splendid', 'fabulous'];
const NEGATIVE_WORDS = ['sad', 'hate', 'bad', 'terrible', 'awful', 'horrible', 'worst', 'angry', 'upset', 'disappointed', 'frustrated', 'annoyed', 'miserable', 'depressed', 'unhappy', 'disgusted', 'furious', 'dreadful', 'pathetic', 'ugly', 'boring', 'stupid', 'fail', 'broken', 'pain', 'hurt', 'cry', 'fear', 'scared', 'worried'];

interface SentimentResult {
  score: number;
  label: string;
  emoji: string;
  positiveCount: number;
  negativeCount: number;
  breakdown: string;
}

/**
 * TextToEmojiSentiment - Analyze text sentiment and show emoji representation.
 */
export default function TextToEmojiSentiment({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);

  function analyze() {
    if (!input.trim()) {
      setResult(null);
      return;
    }

    const words = input.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach((word) => {
      const cleaned = word.replace(/[^a-z]/g, '');
      if (POSITIVE_WORDS.includes(cleaned)) positiveCount++;
      if (NEGATIVE_WORDS.includes(cleaned)) negativeCount++;
    });

    const total = positiveCount + negativeCount;
    let score: number;
    if (total === 0) {
      score = 0;
    } else {
      score = ((positiveCount - negativeCount) / total) * 100;
    }

    let label: string;
    let emoji: string;
    if (score > 60) { label = 'Very Positive'; emoji = '😄🎉✨💖🌟'; }
    else if (score > 20) { label = 'Positive'; emoji = '😊👍💚🌈'; }
    else if (score > -20) { label = 'Neutral'; emoji = '😐🤷‍♂️💭'; }
    else if (score > -60) { label = 'Negative'; emoji = '😟👎💔🌧️'; }
    else { label = 'Very Negative'; emoji = '😢😡💀🌩️😤'; }

    const breakdown = `${words.length} words analyzed • ${positiveCount} positive • ${negativeCount} negative`;

    setResult({ score: Math.round(score), label, emoji, positiveCount, negativeCount, breakdown });
  }

  const copyText = result
    ? `Sentiment: ${result.label} (${result.score}%)\nEmoji: ${result.emoji}\n${result.breakdown}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to analyze
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to analyze its sentiment..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <button onClick={analyze} aria-label="Analyze sentiment" className="btn-primary">
        Analyze Sentiment
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-center bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="text-4xl mb-2">{result.emoji}</div>
              <div className="text-xl font-bold text-gray-800">{result.label}</div>
              <div className={`text-2xl font-bold mt-1 ${result.score > 0 ? 'text-green-600' : result.score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {result.score > 0 ? '+' : ''}{result.score}%
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.positiveCount}</div>
                <div className="text-xs text-gray-500">Positive Words</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
                <div className="text-lg font-bold text-red-600">{result.negativeCount}</div>
                <div className="text-xs text-gray-500">Negative Words</div>
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center">{result.breakdown}</div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
