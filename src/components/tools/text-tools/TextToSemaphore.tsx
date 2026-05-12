'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToSemaphore - Convert text to flag semaphore position descriptions.
 * Each letter maps to a specific two-flag position used in maritime signaling.
 */

const SEMAPHORE: Record<string, string> = {
  a: 'Left arm: down-left (7 o\'clock), Right arm: down (6 o\'clock)',
  b: 'Left arm: left (9 o\'clock), Right arm: down (6 o\'clock)',
  c: 'Left arm: up-left (10 o\'clock), Right arm: down (6 o\'clock)',
  d: 'Left arm: up (12 o\'clock), Right arm: down (6 o\'clock)',
  e: 'Left arm: down (6 o\'clock), Right arm: down-right (5 o\'clock)',
  f: 'Left arm: down (6 o\'clock), Right arm: right (3 o\'clock)',
  g: 'Left arm: down (6 o\'clock), Right arm: up-right (2 o\'clock)',
  h: 'Left arm: left (9 o\'clock), Right arm: down-left (7 o\'clock)',
  i: 'Left arm: up-left (10 o\'clock), Right arm: down-left (7 o\'clock)',
  j: 'Left arm: up (12 o\'clock), Right arm: right (3 o\'clock)',
  k: 'Left arm: down-left (7 o\'clock), Right arm: up (12 o\'clock)',
  l: 'Left arm: down-left (7 o\'clock), Right arm: up-right (2 o\'clock)',
  m: 'Left arm: down-left (7 o\'clock), Right arm: right (3 o\'clock)',
  n: 'Left arm: down-left (7 o\'clock), Right arm: down-right (5 o\'clock)',
  o: 'Left arm: left (9 o\'clock), Right arm: up-left (10 o\'clock)',
  p: 'Left arm: left (9 o\'clock), Right arm: up (12 o\'clock)',
  q: 'Left arm: left (9 o\'clock), Right arm: up-right (2 o\'clock)',
  r: 'Left arm: left (9 o\'clock), Right arm: right (3 o\'clock)',
  s: 'Left arm: left (9 o\'clock), Right arm: down-right (5 o\'clock)',
  t: 'Left arm: up-left (10 o\'clock), Right arm: up (12 o\'clock)',
  u: 'Left arm: up-left (10 o\'clock), Right arm: up-right (2 o\'clock)',
  v: 'Left arm: up (12 o\'clock), Right arm: down-right (5 o\'clock)',
  w: 'Left arm: up-right (2 o\'clock), Right arm: right (3 o\'clock)',
  x: 'Left arm: up-right (2 o\'clock), Right arm: down-right (5 o\'clock)',
  y: 'Left arm: up-left (10 o\'clock), Right arm: right (3 o\'clock)',
  z: 'Left arm: down-right (5 o\'clock), Right arm: right (3 o\'clock)',
  ' ': '[SPACE - flags down at sides]',
};

const SEMAPHORE_SHORT: Record<string, string> = {
  a: '↙ ↓', b: '← ↓', c: '↖ ↓', d: '↑ ↓', e: '↓ ↘', f: '↓ →', g: '↓ ↗',
  h: '← ↙', i: '↖ ↙', j: '↑ →', k: '↙ ↑', l: '↙ ↗', m: '↙ →', n: '↙ ↘',
  o: '← ↖', p: '← ↑', q: '← ↗', r: '← →', s: '← ↘', t: '↖ ↑',
  u: '↖ ↗', v: '↑ ↘', w: '↗ →', x: '↗ ↘', y: '↖ →', z: '↘ →',
  ' ': '⊥',
};

export default function TextToSemaphore({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ char: string; description: string; arrows: string }[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput([]); return; }

    debounceRef.current = setTimeout(() => {
      const chars = input.toLowerCase().split('');
      const result = chars.map((char) => ({
        char: char === ' ' ? '␣' : char.toUpperCase(),
        description: SEMAPHORE[char] || `[No semaphore for "${char}"]`,
        arrows: SEMAPHORE_SHORT[char] || '?',
      }));
      setOutput(result);
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const copyText = output.map((o) => `${o.char}: ${o.description}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter Text</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to semaphore..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-24 resize-y"
        />
      </InputArea>

      <OutputArea hasContent={output.length > 0}>
        {output.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Semaphore Flag Positions</label>

            <div className="flex flex-wrap gap-2 mb-3">
              {output.map((o, i) => (
                <div key={i} className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-center min-w-[3rem]">
                  <div className="text-lg font-bold text-blue-600">{o.char}</div>
                  <div className="text-lg">{o.arrows}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Detailed Positions</h4>
              {output.filter((o) => o.char !== '␣').map((o, i) => (
                <div key={i} className="text-sm bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="font-bold text-blue-600 mr-2">{o.char}:</span>
                  <span className="text-gray-700">{o.description}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500">Flag semaphore is a visual signaling system using two hand-held flags. Positions are described from the signaler&apos;s perspective.</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
