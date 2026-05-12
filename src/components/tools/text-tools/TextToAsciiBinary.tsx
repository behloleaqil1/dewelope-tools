'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToAsciiBinary - Show ASCII code and binary for each character in text.
 */
export default function TextToAsciiBinary({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ char: string; ascii: number; binary: string; hex: string }[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input) {
      setOutput([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const result = Array.from(input).map((char) => {
        const code = char.charCodeAt(0);
        return {
          char: char === ' ' ? '␣' : char === '\n' ? '↵' : char === '\t' ? '⇥' : char,
          ascii: code,
          binary: code.toString(2).padStart(8, '0'),
          hex: code.toString(16).toUpperCase().padStart(2, '0'),
        };
      });
      setOutput(result);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const copyText = output.map(r => `${r.char}\t${r.ascii}\t${r.binary}\t0x${r.hex}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter Text</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to see ASCII codes and binary..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <OutputArea hasContent={output.length > 0}>
        {output.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Character Breakdown</label>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">Char</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">ASCII</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">Binary</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-700">Hex</th>
                  </tr>
                </thead>
                <tbody>
                  {output.slice(0, 200).map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-3 py-1 font-mono">{row.char}</td>
                      <td className="border border-gray-200 px-3 py-1 font-mono">{row.ascii}</td>
                      <td className="border border-gray-200 px-3 py-1 font-mono">{row.binary}</td>
                      <td className="border border-gray-200 px-3 py-1 font-mono">0x{row.hex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {output.length > 200 && <p className="text-xs text-gray-500">Showing first 200 characters...</p>}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
