'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToTitleCase - Smart title case conversion following AP/Chicago style rules.
 * Lowercases articles, prepositions, and conjunctions unless they start the title.
 */
export default function TextToTitleCase({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [style, setStyle] = useState<'ap' | 'chicago'>('ap');

  // Words to keep lowercase (unless first/last word)
  const LOWERCASE_WORDS = new Set([
    'a', 'an', 'the',           // articles
    'and', 'but', 'or', 'nor', 'for', 'yet', 'so',  // conjunctions
    'at', 'by', 'in', 'of', 'on', 'to', 'up',       // short prepositions
    'as', 'if', 'is', 'it',
  ]);

  // Chicago style adds more prepositions to lowercase
  const CHICAGO_EXTRA = new Set([
    'from', 'into', 'onto', 'with', 'over', 'than',
  ]);

  function toTitleCase(text: string): string {
    const words = text.toLowerCase().split(/\s+/);
    const lowercaseSet = style === 'chicago'
      ? new Set([...LOWERCASE_WORDS, ...CHICAGO_EXTRA])
      : LOWERCASE_WORDS;

    return words.map((word, index) => {
      // Always capitalize first and last word
      if (index === 0 || index === words.length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      // Keep minor words lowercase
      if (lowercaseSet.has(word)) {
        return word;
      }

      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  function handleConvert() {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    // Process each line separately
    const lines = input.split('\n');
    const result = lines.map((line) => line.trim() ? toTitleCase(line) : '').join('\n');
    setOutput(result);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2">
        <button
          onClick={() => { setStyle('ap'); setOutput(''); }}
          aria-label="AP style"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${style === 'ap' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          AP Style
        </button>
        <button
          onClick={() => { setStyle('chicago'); setOutput(''); }}
          aria-label="Chicago style"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${style === 'chicago' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Chicago Style
        </button>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to title case
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. the quick brown fox jumps over the lazy dog"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <button onClick={handleConvert} aria-label="Convert to title case" className="btn-primary">
        Convert to Title Case
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Title Case Result ({style === 'ap' ? 'AP' : 'Chicago'} Style)</label>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 break-words p-3 bg-gray-50 rounded-lg">{output}</pre>
            <div className="text-xs text-gray-500">
              {style === 'ap' ? 'AP Style: Lowercase articles (a, an, the), short prepositions, and conjunctions.' : 'Chicago Style: Also lowercases longer prepositions (from, into, onto, with, over, than).'}
            </div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
