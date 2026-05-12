'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToReverseCipher - Simple reverse writing cipher with word grouping.
 * Reverses text and optionally groups into fixed-size word blocks for obfuscation.
 */
export default function TextToReverseCipher({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [groupSize, setGroupSize] = useState(5);
  const [preserveSpaces, setPreserveSpaces] = useState(false);
  const [output, setOutput] = useState('');

  const encode = (text: string) => {
    let reversed = text.split('').reverse().join('');
    if (!preserveSpaces) {
      // Remove spaces and regroup
      const stripped = reversed.replace(/\s+/g, '');
      const groups: string[] = [];
      for (let i = 0; i < stripped.length; i += groupSize) {
        groups.push(stripped.slice(i, i + groupSize));
      }
      reversed = groups.join(' ');
    }
    return reversed;
  };

  const decode = (text: string) => {
    const stripped = preserveSpaces ? text : text.replace(/\s+/g, '');
    return stripped.split('').reverse().join('');
  };

  const handleProcess = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (mode === 'encode') {
      setOutput(encode(input));
    } else {
      setOutput(decode(input));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'encode'}
              onChange={() => setMode('encode')}
            />
            <span className="text-sm font-medium text-gray-700">Encode</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'decode'}
              onChange={() => setMode('decode')}
            />
            <span className="text-sm font-medium text-gray-700">Decode</span>
          </label>
        </div>

        <div className="flex gap-4 mb-3 items-center">
          <div>
            <label htmlFor={`${toolId}-group`} className="block text-sm font-medium text-gray-700 mb-1">
              Group Size
            </label>
            <input
              id={`${toolId}-group`}
              type="number"
              min={2}
              max={10}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 5)}
              className="input-field w-20"
              aria-label="Group size for word blocks"
            />
          </div>
          <label className="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              checked={preserveSpaces}
              onChange={(e) => setPreserveSpaces(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Preserve original spacing</span>
          </label>
        </div>

        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Text to encode' : 'Text to decode'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to reverse cipher...' : 'Enter cipher text to decode...'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />

        <button
          onClick={handleProcess}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
