'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToCombiningLigatureLeftHalf - Add combining ligature left half (U+FE20) to text.
 */
export default function TextToCombiningLigatureLeftHalf({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'between' | 'after'>('between');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input) {
      setOutput('');
      return;
    }

    const combiningChar = '\uFE20'; // Combining ligature left half
    let result = '';

    if (mode === 'between') {
      const chars = [...input];
      for (let i = 0; i < chars.length; i++) {
        result += chars[i];
        if (i < chars.length - 1 && chars[i] !== ' ' && chars[i + 1] !== ' ') {
          result += combiningChar;
        }
      }
    } else {
      const chars = [...input];
      for (let i = 0; i < chars.length; i++) {
        result += chars[i];
        if (chars[i] !== ' ') {
          result += combiningChar;
        }
      }
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter Text</label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to add combining ligature left half..."
              aria-label={`Text input for ${toolName}`}
              className="input-field h-32 resize-y"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'between' | 'after')} className="input-field" aria-label="Placement mode">
              <option value="between">Between characters</option>
              <option value="after">After each character</option>
            </select>
          </div>
          <button onClick={convert} className="btn-primary">Apply Combining Mark</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all text-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
