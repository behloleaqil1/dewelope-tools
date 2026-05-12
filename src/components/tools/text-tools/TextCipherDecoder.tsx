'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextCipherDecoder - Try multiple ciphers to decode encrypted text.
 */
export default function TextCipherDecoder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ cipher: string; result: string }[]>([]);

  const decodeCaesar = (text: string, shift: number): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
  };

  const decodeRot13 = (text: string): string => decodeCaesar(text, 13);

  const decodeAtbash = (text: string): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'a' ? 97 : 65;
      return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)));
    });
  };

  const decodeReverse = (text: string): string => text.split('').reverse().join('');

  const decodeBinary = (text: string): string => {
    const bytes = text.trim().split(/\s+/);
    if (bytes.every(b => /^[01]{7,8}$/.test(b))) {
      return bytes.map(b => String.fromCharCode(parseInt(b, 2))).join('');
    }
    return '(not valid binary)';
  };

  const decodeBase64 = (text: string): string => {
    try {
      return atob(text.trim());
    } catch {
      return '(not valid Base64)';
    }
  };

  const decode = () => {
    if (!input.trim()) { setResults([]); return; }

    const decoded: { cipher: string; result: string }[] = [];

    decoded.push({ cipher: 'ROT13', result: decodeRot13(input) });
    decoded.push({ cipher: 'Caesar (shift 1)', result: decodeCaesar(input, 1) });
    decoded.push({ cipher: 'Caesar (shift 3)', result: decodeCaesar(input, 3) });
    decoded.push({ cipher: 'Caesar (shift 5)', result: decodeCaesar(input, 5) });
    decoded.push({ cipher: 'Caesar (shift 7)', result: decodeCaesar(input, 7) });
    decoded.push({ cipher: 'Atbash', result: decodeAtbash(input) });
    decoded.push({ cipher: 'Reversed', result: decodeReverse(input) });
    decoded.push({ cipher: 'Binary', result: decodeBinary(input) });
    decoded.push({ cipher: 'Base64', result: decodeBase64(input) });

    setResults(decoded);
  };

  const copyText = results.map(r => `${r.cipher}: ${r.result}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter encrypted text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste encrypted or encoded text here..." aria-label={`Text input for ${toolName}`} className="input-field h-32 resize-y font-mono" />
      </InputArea>

      <button onClick={decode} className="btn-primary" aria-label="Try all ciphers">Decode with All Ciphers</button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Decoding Results</label>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 mb-1">{r.cipher}</div>
                  <div className="text-sm font-mono text-gray-800 break-all">{r.result}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
