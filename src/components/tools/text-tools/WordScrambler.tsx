'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WordScrambler - Scrambles/shuffles letters within each word while keeping first and last letters in place.
 * Based on the Cambridge University reading study.
 */
export default function WordScrambler({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function scrambleWord(word: string): string {
    if (word.length <= 3) return word;

    const first = word[0];
    const last = word[word.length - 1];
    const middle = word.slice(1, -1).split('');

    // Fisher-Yates shuffle on middle characters
    for (let i = middle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }

    return first + middle.join('') + last;
  }

  function handleScramble() {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result = input.replace(/\b([a-zA-Z]+)\b/g, (match) => scrambleWord(match));
    setOutput(result);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to scramble
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to scramble the middle letters of each word..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <button onClick={handleScramble} aria-label="Scramble words" className="btn-primary">
        Scramble Words
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Scrambled Text</label>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 break-words p-3 bg-gray-50 rounded-lg">{output}</pre>
            <div className="text-xs text-gray-500">
              First and last letters of each word are preserved. Middle letters are shuffled randomly.
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
