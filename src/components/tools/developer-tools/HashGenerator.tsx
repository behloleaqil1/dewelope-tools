'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { generateHash } from '@/lib/developer-tools';

const MAX_LENGTH = 1048576; // 1MB

type Algorithm = 'md5' | 'sha1' | 'sha256';

const ALGORITHMS: { value: Algorithm; label: string }[] = [
  { value: 'md5', label: 'MD5' },
  { value: 'sha1', label: 'SHA-1' },
  { value: 'sha256', label: 'SHA-256' },
];

/**
 * HashGenerator - Generate MD5, SHA-1, or SHA-256 hashes from text input.
 * Requirements: 6.2, 6.6, 6.7
 */
export default function HashGenerator({ toolId }: ToolEngineProps) {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('sha256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!input && input !== '') {
      setOutput('');
      setError(undefined);
      return;
    }

    if (input.length > MAX_LENGTH) {
      setError(`Input exceeds maximum size of 1 MB (${MAX_LENGTH.toLocaleString()} characters)`);
      setOutput('');
      return;
    }

    setError(undefined);

    debounceRef.current = setTimeout(() => {
      generateHash(input, algorithm).then((hash) => {
        setOutput(hash);
      });
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input, algorithm]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${toolId}-algorithm`} className="block text-sm font-medium text-gray-700 mb-1">
          Algorithm
        </label>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.value}
              onClick={() => setAlgorithm(algo.value)}
              aria-label={`Select ${algo.label} algorithm`}
              className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                algorithm === algo.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {algo.label}
            </button>
          ))}
        </div>
      </div>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Text to hash
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate a hash..."
          aria-label="Text input for hash generation"
          className="w-full h-36 p-3 border border-gray-300 rounded-lg resize-y font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-gray-500 text-right">
          {input.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()} characters
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {ALGORITHMS.find((a) => a.value === algorithm)?.label} Hash
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-white p-3 rounded border border-gray-200">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
