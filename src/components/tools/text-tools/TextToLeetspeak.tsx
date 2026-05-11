'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToLeetspeak - Convert text to leetspeak (1337) with configurable intensity.
 */
export default function TextToLeetspeak({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [intensity, setIntensity] = useState<'basic' | 'moderate' | 'advanced'>('basic');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const BASIC_MAP = useMemo<Record<string, string>>(() => ({
    a: '4', e: '3', i: '1', o: '0', t: '7', s: '5', l: '1',
  }), []);

  const MODERATE_MAP = useMemo<Record<string, string>>(() => ({
    a: '4', b: '8', e: '3', g: '9', i: '1', o: '0', s: '5', t: '7', l: '1', z: '2',
  }), []);

  const ADVANCED_MAP = useMemo<Record<string, string>>(() => ({
    a: '@', b: '8', c: '(', d: '|)', e: '3', f: '|=', g: '9', h: '#', i: '!', j: '_|',
    k: '|<', l: '1', m: '|\\/|', n: '|\\|', o: '0', p: '|>', q: '0,', r: '|2', s: '$',
    t: '7', u: '|_|', v: '\\/', w: '\\/\\/', x: '><', y: '`/', z: '2',
  }), []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      const map = intensity === 'basic' ? BASIC_MAP : intensity === 'moderate' ? MODERATE_MAP : ADVANCED_MAP;
      const result = input
        .split('')
        .map((char) => {
          const lower = char.toLowerCase();
          if (map[lower]) {
            return char === char.toUpperCase() ? map[lower].toUpperCase() : map[lower];
          }
          return char;
        })
        .join('');
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, intensity, BASIC_MAP, MODERATE_MAP, ADVANCED_MAP]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert to leetspeak
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to 1337speak..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="mt-3">
          <label htmlFor={`${toolId}-intensity`} className="block text-xs text-gray-500 mb-1">Intensity</label>
          <select
            id={`${toolId}-intensity`}
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as 'basic' | 'moderate' | 'advanced')}
            aria-label="Leetspeak intensity"
            className="input-field text-sm w-40"
          >
            <option value="basic">Basic (a→4, e→3)</option>
            <option value="moderate">Moderate</option>
            <option value="advanced">Advanced (full)</option>
          </select>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Leetspeak Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-3 bg-gray-50 rounded-lg break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
