'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface EntropyResult {
  entropy: number;
  maxEntropy: number;
  efficiency: number;
  uniqueChars: number;
  totalChars: number;
  topChars: { char: string; count: number; probability: number }[];
}

/**
 * TextEntropyCalculator - Calculates Shannon entropy of text input.
 * Measures the information content and randomness of text.
 */
export default function TextEntropyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<EntropyResult | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!input.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    const text = input;
    const totalChars = text.length;

    // Count character frequencies
    const freq: Record<string, number> = {};
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }

    const uniqueChars = Object.keys(freq).length;

    // Calculate Shannon entropy: H = -Σ p(x) * log2(p(x))
    let entropy = 0;
    for (const count of Object.values(freq)) {
      const p = count / totalChars;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }

    // Maximum possible entropy for this alphabet size
    const maxEntropy = uniqueChars > 1 ? Math.log2(uniqueChars) : 0;
    const efficiency = maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0;

    // Top characters by frequency
    const topChars = Object.entries(freq)
      .map(([char, count]) => ({ char, count, probability: count / totalChars }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setResult({ entropy, maxEntropy, efficiency, uniqueChars, totalChars, topChars });
  }

  const copyText = result
    ? `Shannon Entropy: ${result.entropy.toFixed(4)} bits/char\nMax Entropy: ${result.maxEntropy.toFixed(4)} bits/char\nEfficiency: ${result.efficiency.toFixed(2)}%\nUnique Characters: ${result.uniqueChars}\nTotal Characters: ${result.totalChars}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to analyze
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to calculate its Shannon entropy..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate entropy" className="btn-primary">
        Calculate Entropy
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.entropy.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Entropy (bits/char)</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-xl font-bold text-green-600">{result.maxEntropy.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Max Entropy</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                <div className="text-xl font-bold text-purple-600">{result.efficiency.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Efficiency</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.uniqueChars}</div>
                <div className="text-xs text-gray-500">Unique Chars</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-700">{result.totalChars}</div>
                <div className="text-xs text-gray-500">Total Chars</div>
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Top Characters by Frequency</h4>
              <div className="space-y-1">
                {result.topChars.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs w-8 text-center">
                      {item.char === ' ' ? '⎵' : item.char === '\n' ? '↵' : item.char}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.probability * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-20 text-right">
                      {item.count} ({(item.probability * 100).toFixed(1)}%)
                    </span>
                  </div>
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
