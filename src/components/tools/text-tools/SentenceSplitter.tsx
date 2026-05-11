'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SentenceSplitter - Splits text into individual sentences, one per line.
 * Handles common sentence-ending punctuation (. ! ?) with abbreviation awareness.
 */
export default function SentenceSplitter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [count, setCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      setCount(0);
      return;
    }

    debounceRef.current = setTimeout(() => {
      // Common abbreviations that shouldn't split sentences
      const abbreviations = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Sr', 'Jr', 'vs', 'etc', 'Inc', 'Ltd', 'Corp', 'St', 'Ave', 'Blvd', 'Dept', 'Est', 'Fig', 'Vol', 'No', 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const abbrPattern = abbreviations.join('|');

      // Split on sentence-ending punctuation followed by space and uppercase letter or end
      // But not after common abbreviations
      const text = input.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

      const sentences: string[] = [];
      let current = '';

      for (let i = 0; i < text.length; i++) {
        current += text[i];

        if ((text[i] === '.' || text[i] === '!' || text[i] === '?') && i < text.length - 1) {
          // Check if followed by closing quote/paren then space
          let nextIdx = i + 1;
          while (nextIdx < text.length && (text[nextIdx] === '"' || text[nextIdx] === "'" || text[nextIdx] === ')' || text[nextIdx] === ']')) {
            current += text[nextIdx];
            nextIdx++;
            i = nextIdx - 1;
          }

          // Check if next char is space followed by uppercase or end
          if (nextIdx < text.length && text[nextIdx] === ' ') {
            const nextNonSpace = text[nextIdx + 1];
            if (nextNonSpace && nextNonSpace === nextNonSpace.toUpperCase() && nextNonSpace !== nextNonSpace.toLowerCase()) {
              // Check if this is an abbreviation
              const wordBefore = current.trim().split(/\s+/).pop()?.replace(/[.!?]+$/, '') || '';
              const isAbbr = new RegExp(`^(${abbrPattern})$`, 'i').test(wordBefore);

              if (!isAbbr) {
                sentences.push(current.trim());
                current = '';
                i = nextIdx; // skip the space
                continue;
              }
            }
          } else if (nextIdx >= text.length) {
            // End of text
            sentences.push(current.trim());
            current = '';
          }
        }
      }

      if (current.trim()) {
        sentences.push(current.trim());
      }

      const filtered = sentences.filter(s => s.length > 0);
      setOutput(filtered.join('\n'));
      setCount(filtered.length);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

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
          placeholder="Paste your paragraph here. Each sentence will appear on its own line. It handles abbreviations like Dr. Smith correctly!"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Sentences ({count})</label>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
