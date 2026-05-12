'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

// Common abbreviations that should not trigger sentence splits
const ABBREVIATIONS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'st', 'ave', 'blvd',
  'dept', 'est', 'fig', 'inc', 'ltd', 'vs', 'etc', 'approx', 'govt',
  'no', 'vol', 'rev', 'gen', 'sgt', 'cpl', 'pvt', 'capt', 'lt', 'col',
  'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
]);

/**
 * TextToSentenceBoundaries - Split text at sentence boundaries using NLP rules.
 * Handles abbreviations, decimal numbers, ellipses, and quoted sentences.
 */
export default function TextToSentenceBoundaries({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sentenceCount, setSentenceCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      setSentenceCount(0);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const sentences = splitSentences(input);
      setSentenceCount(sentences.length);
      setOutput(sentences.map((s, i) => `[${i + 1}] ${s}`).join('\n'));
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  function splitSentences(text: string): string[] {
    const results: string[] = [];
    let current = '';

    // Normalize whitespace but preserve newlines as potential boundaries
    const chars = text.split('');
    let i = 0;

    while (i < chars.length) {
      const char = chars[i];
      current += char;

      // Check for sentence-ending punctuation
      if (char === '.' || char === '!' || char === '?') {
        // Handle ellipsis (...)
        if (char === '.' && chars[i + 1] === '.' && chars[i + 2] === '.') {
          current += '..';
          i += 3;
          continue;
        }

        // Check if this period is part of an abbreviation
        if (char === '.') {
          const wordBefore = getWordBefore(current.slice(0, -1));
          if (wordBefore && ABBREVIATIONS.has(wordBefore.toLowerCase())) {
            i++;
            continue;
          }

          // Check for decimal numbers (e.g., 3.14)
          if (i > 0 && i < chars.length - 1 && /\d/.test(chars[i - 1]) && /\d/.test(chars[i + 1])) {
            i++;
            continue;
          }

          // Check for initials (e.g., U.S.A.)
          if (i >= 1 && /[A-Z]/.test(chars[i - 1]) && chars[i + 1] && /[A-Z]/.test(chars[i + 1])) {
            i++;
            continue;
          }
        }

        // Handle closing quotes/parentheses after punctuation
        while (i + 1 < chars.length && (chars[i + 1] === '"' || chars[i + 1] === '\'' || chars[i + 1] === ')' || chars[i + 1] === '"' || chars[i + 1] === '\'')) {
          i++;
          current += chars[i];
        }

        // Check if next non-space char is uppercase or end of text (sentence boundary)
        const rest = text.slice(i + 1);
        const nextNonSpace = rest.match(/^\s*(\S)/);

        if (!nextNonSpace || /[A-Z"\u201C(]/.test(nextNonSpace[1]) || rest.trim() === '') {
          const trimmed = current.trim();
          if (trimmed) results.push(trimmed);
          current = '';
        }
      }

      i++;
    }

    // Add remaining text as last sentence
    const trimmed = current.trim();
    if (trimmed) results.push(trimmed);

    return results;
  }

  function getWordBefore(text: string): string {
    const match = text.match(/(\w+)$/);
    return match ? match[1] : '';
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to split into sentences
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text here. The tool will detect sentence boundaries using NLP rules, handling abbreviations like Dr. Smith and numbers like 3.14 correctly..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Sentences Found: <span className="text-blue-600 font-bold">{sentenceCount}</span>
              </label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
