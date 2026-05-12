'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextNgramGenerator - Generates n-grams (bigrams, trigrams, etc.) from text.
 * Supports word-level and character-level n-gram generation.
 */
export default function TextNgramGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [n, setN] = useState('2');
  const [mode, setMode] = useState<'word' | 'character'>('word');
  const [output, setOutput] = useState<string[]>([]);

  function generate() {
    if (!input.trim()) {
      setOutput([]);
      return;
    }

    const size = Math.max(1, Math.min(10, parseInt(n) || 2));
    let tokens: string[];

    if (mode === 'word') {
      tokens = input.trim().split(/\s+/);
    } else {
      tokens = input.split('');
    }

    if (tokens.length < size) {
      setOutput([]);
      return;
    }

    const ngrams: string[] = [];
    for (let i = 0; i <= tokens.length - size; i++) {
      const gram = tokens.slice(i, i + size);
      if (mode === 'word') {
        ngrams.push(gram.join(' '));
      } else {
        ngrams.push(gram.join(''));
      }
    }

    setOutput(ngrams);
  }

  const nLabel = parseInt(n) === 2 ? 'Bigrams' : parseInt(n) === 3 ? 'Trigrams' : `${n}-grams`;
  const copyText = output.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate n-grams from..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-n`} className="block text-xs text-gray-500 mb-1">N (gram size)</label>
            <input
              id={`${toolId}-n`}
              type="number"
              min="1"
              max="10"
              value={n}
              onChange={(e) => setN(e.target.value)}
              aria-label="N-gram size"
              className="input-field w-24"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-xs text-gray-500 mb-1">Mode</label>
            <select
              id={`${toolId}-mode`}
              value={mode}
              onChange={(e) => setMode(e.target.value as 'word' | 'character')}
              aria-label="N-gram mode"
              className="input-field text-sm"
            >
              <option value="word">Word-level</option>
              <option value="character">Character-level</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate n-grams" className="btn-primary">
        Generate {nLabel}
      </button>

      <OutputArea hasContent={output.length > 0}>
        {output.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">{nLabel} ({output.length} total)</label>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="max-h-64 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {output.map((gram, idx) => (
                  <span key={idx} className="inline-block bg-white border border-gray-300 rounded px-2 py-1 text-sm font-mono text-gray-700">
                    {gram}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
