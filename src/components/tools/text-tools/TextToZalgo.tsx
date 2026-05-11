'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToZalgo - Adds Zalgo/glitch text effects with configurable intensity.
 * Uses Unicode combining diacritical marks above, below, and middle positions.
 */
export default function TextToZalgo({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [direction, setDirection] = useState<'all' | 'up' | 'down' | 'middle'>('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Combining characters above (U+0300 range)
  const combiningAbove = [
    '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
    '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F',
    '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u031A', '\u033D',
    '\u033E', '\u033F', '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0346',
  ];

  // Combining characters below
  const combiningBelow = [
    '\u0316', '\u0317', '\u0318', '\u0319', '\u031C', '\u031D', '\u031E', '\u031F',
    '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327',
    '\u0328', '\u0329', '\u032A', '\u032B', '\u032C', '\u032D', '\u032E', '\u032F',
    '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033A', '\u033B', '\u033C',
  ];

  // Combining characters middle
  const combiningMiddle = [
    '\u0334', '\u0335', '\u0336', '\u0337', '\u0338',
  ];

  const getRandomChars = (arr: string[], count: number): string => {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += arr[Math.floor(Math.random() * arr.length)];
    }
    return result;
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      let result = '';
      for (const char of input) {
        result += char;
        const count = Math.floor(Math.random() * intensity) + 1;
        if (direction === 'all' || direction === 'up') {
          result += getRandomChars(combiningAbove, count);
        }
        if (direction === 'all' || direction === 'down') {
          result += getRandomChars(combiningBelow, count);
        }
        if (direction === 'all' || direction === 'middle') {
          result += getRandomChars(combiningMiddle, Math.max(1, Math.floor(count / 2)));
        }
      }
      setOutput(result);
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, intensity, direction]);

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
          placeholder="Type text to add Zalgo effect..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor={`${toolId}-intensity`} className="text-sm font-medium text-gray-700">
            Intensity
          </label>
          <input
            id={`${toolId}-intensity`}
            type="range"
            min={1}
            max={15}
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            aria-label="Zalgo intensity level"
            className="w-32"
          />
          <span className="text-sm text-gray-600 w-6">{intensity}</span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={`${toolId}-direction`} className="text-sm font-medium text-gray-700">
            Direction
          </label>
          <select
            id={`${toolId}-direction`}
            value={direction}
            onChange={(e) => setDirection(e.target.value as typeof direction)}
            aria-label="Zalgo direction"
            className="input-field py-1 px-2 w-auto"
          >
            <option value="all">All</option>
            <option value="up">Up</option>
            <option value="down">Down</option>
            <option value="middle">Middle</option>
          </select>
        </div>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zalgo Text</label>
            <div className="text-lg text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[4rem] overflow-auto">{output}</div>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
