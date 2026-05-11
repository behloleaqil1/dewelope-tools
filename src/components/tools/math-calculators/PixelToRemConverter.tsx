'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PixelToRemConverter - Bidirectional converter between px and rem units.
 * Shows formula and supports custom base font size.
 */
export default function PixelToRemConverter({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'pxToRem' | 'remToPx'>('pxToRem');
  const [inputValue, setInputValue] = useState('16');
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const num = parseFloat(inputValue);
      if (isNaN(num) || baseFontSize <= 0) {
        setOutput('');
        return;
      }
      if (mode === 'pxToRem') {
        const result = parseFloat((num / baseFontSize).toFixed(4));
        setOutput(`${result}rem`);
      } else {
        const result = parseFloat((num * baseFontSize).toFixed(4));
        setOutput(`${result}px`);
      }
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, baseFontSize, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('pxToRem')}
          aria-label="Pixels to REM mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === 'pxToRem' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          PX → REM
        </button>
        <button
          onClick={() => setMode('remToPx')}
          aria-label="REM to pixels mode"
          className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${mode === 'remToPx' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          REM → PX
        </button>
      </div>

      <InputArea>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'pxToRem' ? 'Pixels (px)' : 'REM'}
            </label>
            <input
              id={`${toolId}-value`}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={mode === 'pxToRem' ? 'Enter px value' : 'Enter rem value'}
              aria-label={mode === 'pxToRem' ? 'Pixel value to convert' : 'REM value to convert'}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
              Base Font Size (px)
            </label>
            <input
              id={`${toolId}-base`}
              type="number"
              min={1}
              max={100}
              value={baseFontSize}
              onChange={(e) => setBaseFontSize(Math.max(1, parseInt(e.target.value) || 16))}
              aria-label="Base font size in pixels"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <p className="text-lg font-mono text-gray-800">{output}</p>
            <p className="text-xs text-gray-500">
              Formula: {mode === 'pxToRem'
                ? `${inputValue}px / ${baseFontSize}px = ${output}`
                : `${inputValue}rem × ${baseFontSize}px = ${output}`}
            </p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
