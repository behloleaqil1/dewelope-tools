'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToInvisibleCharacters - Encode text using zero-width Unicode characters.
 * Converts text to invisible zero-width characters and decodes them back.
 */
export default function TextToInvisibleCharacters({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  // Zero-width characters used for encoding
  const ZERO = '\u200B'; // zero-width space = 0
  const ONE = '\u200C';  // zero-width non-joiner = 1
  const SEP = '\u200D';  // zero-width joiner = separator between chars
  const WORD = '\uFEFF'; // byte order mark = word separator

  const encode = () => {
    if (!input.trim()) return;

    const result = input
      .split('')
      .map((char) => {
        if (char === ' ') return WORD;
        const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
        return binary.split('').map((bit) => (bit === '0' ? ZERO : ONE)).join('');
      })
      .join(SEP);

    setEncoded(result);
    setDecoded('');
  };

  const decode = () => {
    if (!input) return;

    try {
      const words = input.split(WORD);
      const result = words
        .map((word) => {
          if (!word) return ' ';
          const chars = word.split(SEP).filter(Boolean);
          return chars
            .map((charBits) => {
              const binary = charBits
                .split('')
                .map((bit) => {
                  if (bit === ZERO) return '0';
                  if (bit === ONE) return '1';
                  return '';
                })
                .join('');
              if (binary.length === 0) return '';
              return String.fromCharCode(parseInt(binary, 2));
            })
            .join('');
        })
        .join(' ');

      setDecoded(result);
      setEncoded('');
    } catch {
      setDecoded('Error: Could not decode. Make sure the input contains valid zero-width encoded text.');
    }
  };

  const handleAction = () => {
    if (mode === 'encode') encode();
    else decode();
  };

  const outputText = mode === 'encode' ? encoded : decoded;
  const charCount = encoded ? encoded.length : 0;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
          Mode
        </label>
        <select
          id={`${toolId}-mode`}
          value={mode}
          onChange={(e) => { setMode(e.target.value as typeof mode); setEncoded(''); setDecoded(''); }}
          aria-label={`Mode for ${toolName}`}
          className="input-field"
        >
          <option value="encode">Encode (text → invisible)</option>
          <option value="decode">Decode (invisible → text)</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Text to encode' : 'Invisible text to decode'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to hide...' : 'Paste invisible text here...'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={handleAction} aria-label={mode === 'encode' ? 'Encode text' : 'Decode text'} className="btn-primary">
        {mode === 'encode' ? 'Encode to Invisible' : 'Decode to Text'}
      </button>

      <OutputArea hasContent={!!outputText}>
        {outputText && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {mode === 'encode' ? 'Encoded (invisible characters)' : 'Decoded Text'}
            </label>
            {mode === 'encode' ? (
              <div className="space-y-2">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500 italic">The encoded text is invisible. It contains {charCount} zero-width characters.</p>
                  <div className="mt-2 p-2 bg-white border border-dashed border-gray-300 rounded min-h-[40px] text-sm font-mono">
                    {encoded}
                  </div>
                </div>
                <p className="text-xs text-gray-500">Copy the invisible text above and paste it anywhere — it will be invisible to readers.</p>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100">{decoded}</pre>
            )}
            <CopyToClipboard text={outputText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
