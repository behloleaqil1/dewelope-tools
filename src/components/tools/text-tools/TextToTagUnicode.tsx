'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToTagUnicode - Convert text to tag Unicode characters (invisible tags).
 * Maps ASCII characters (U+0020-U+007E) to their tag equivalents (U+E0020-U+E007E).
 * Tag characters are invisible and used in Unicode language tagging.
 */
export default function TextToTagUnicode({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      // Convert ASCII to tag characters: U+E0000 + ASCII code point
      const tagBegin = String.fromCodePoint(0xE0001); // Language tag begin (optional)
      const tagEnd = String.fromCodePoint(0xE007F); // Cancel tag
      const encoded = input.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 0x20 && code <= 0x7E) {
          return String.fromCodePoint(0xE0000 + code);
        }
        return char;
      }).join('');
      setOutput(tagBegin + encoded + tagEnd);
    } else {
      // Decode tag characters back to ASCII
      const decoded = Array.from(input).map(char => {
        const code = char.codePointAt(0) || 0;
        if (code >= 0xE0020 && code <= 0xE007E) {
          return String.fromCharCode(code - 0xE0000);
        }
        if (code === 0xE0001 || code === 0xE007F) {
          return ''; // Skip tag begin/end markers
        }
        return char;
      }).join('');
      setOutput(decoded);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="radio" name={`${toolId}-mode`} checked={mode === 'encode'} onChange={() => setMode('encode')} />
            Encode (Text → Tags)
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="radio" name={`${toolId}-mode`} checked={mode === 'decode'} onChange={() => setMode('decode')} />
            Decode (Tags → Text)
          </label>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Enter text to encode as invisible tags' : 'Paste tag characters to decode'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to convert to invisible tag characters...' : 'Paste invisible tag characters to decode...'}
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <button onClick={convert} className="btn-primary mt-3">{mode === 'encode' ? 'Encode to Tags' : 'Decode Tags'}</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {mode === 'encode' ? 'Tag Characters (invisible — copy to use)' : 'Decoded Text'}
            </label>
            {mode === 'encode' ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Characters are invisible. Length: {Array.from(output).length} code points</p>
                <div className="font-mono text-sm text-gray-800 break-all min-h-[2rem] border border-dashed border-gray-300 p-2 rounded">{output || '(invisible characters)'}</div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg break-all">{output}</pre>
            )}
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
