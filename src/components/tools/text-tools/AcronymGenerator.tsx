'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AcronymGenerator - Generate acronyms from phrases by taking the first letter of each word.
 */
export default function AcronymGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [acronym, setAcronym] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setAcronym('');
      setWords([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const wordList = input.trim().split(/\s+/).filter((w) => w.length > 0);
      setWords(wordList);
      const result = wordList.map((w) => w[0].toUpperCase()).join('');
      setAcronym(result);
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a phrase
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Application Programming Interface"
          aria-label={`Phrase input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={!!acronym}>
        {acronym && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600 font-mono">{acronym}</div>
              <div className="text-xs text-gray-500 mt-1">Acronym ({acronym.length} letters)</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">
                {words.map((word, i) => (
                  <span key={i}>
                    <span className="font-bold text-blue-600">{word[0].toUpperCase()}</span>
                    <span>{word.slice(1)}</span>
                    {i < words.length - 1 && ' '}
                  </span>
                ))}
              </div>
            </div>
            <CopyToClipboard text={acronym} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
