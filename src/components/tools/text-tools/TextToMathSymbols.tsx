'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMathSymbols - Convert text and numbers to mathematical Unicode symbols.
 * Supports bold, italic, script, fraktur, and double-struck math styles.
 */
export default function TextToMathSymbols({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<'bold' | 'italic' | 'script' | 'fraktur' | 'double-struck'>('bold');
  const [output, setOutput] = useState('');

  const offsets: Record<string, { upper: number; lower: number; digit?: number }> = {
    'bold': { upper: 0x1D400 - 65, lower: 0x1D41A - 97, digit: 0x1D7CE - 48 },
    'italic': { upper: 0x1D434 - 65, lower: 0x1D44E - 97 },
    'script': { upper: 0x1D49C - 65, lower: 0x1D4B6 - 97 },
    'fraktur': { upper: 0x1D504 - 65, lower: 0x1D51E - 97 },
    'double-struck': { upper: 0x1D538 - 65, lower: 0x1D552 - 97, digit: 0x1D7D8 - 48 },
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const offset = offsets[style];
    const result = input.split('').map(ch => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(code + offset.upper);
      } else if (code >= 97 && code <= 122) {
        return String.fromCodePoint(code + offset.lower);
      } else if (code >= 48 && code <= 57 && offset.digit !== undefined) {
        return String.fromCodePoint(code + offset.digit);
      }
      return ch;
    }).join('');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter text to convert</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type text or numbers to convert to math symbols..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y"
        />
        <div className="mt-3">
          <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Math Style</label>
          <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value as typeof style)} aria-label="Math style" className="input-field w-auto">
            <option value="bold">𝐁𝐨𝐥𝐝</option>
            <option value="italic">𝐼𝑡𝑎𝑙𝑖𝑐</option>
            <option value="script">𝒮𝒸𝓇𝒾𝓅𝓉</option>
            <option value="fraktur">𝔉𝔯𝔞𝔨𝔱𝔲𝔯</option>
            <option value="double-struck">𝔻𝕠𝕦𝕓𝕝𝕖-𝕊𝕥𝕣𝕦𝕔𝕜</option>
          </select>
        </div>
        <button onClick={convert} className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Convert</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Math Symbols Result</label>
            <pre className="whitespace-pre-wrap text-lg text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
