'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToEnclosedAlphanumerics - Convert text and numbers to enclosed alphanumeric Unicode.
 * Maps A-Z to Ⓐ-Ⓩ, a-z to ⓐ-ⓩ, 1-9 to ①-⑨, 0 to ⓪.
 */
export default function TextToEnclosedAlphanumerics({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [style, setStyle] = useState<'circled' | 'parenthesized' | 'negative-circled'>('circled');

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result = input.split('').map(char => {
      if (style === 'circled') {
        if (char >= 'A' && char <= 'Z') return String.fromCodePoint(0x24B6 + (char.charCodeAt(0) - 65));
        if (char >= 'a' && char <= 'z') return String.fromCodePoint(0x24D0 + (char.charCodeAt(0) - 97));
        if (char >= '1' && char <= '9') return String.fromCodePoint(0x2460 + (char.charCodeAt(0) - 49));
        if (char === '0') return '⓪';
      } else if (style === 'parenthesized') {
        if (char >= 'A' && char <= 'Z') return String.fromCodePoint(0x1F110 + (char.charCodeAt(0) - 65));
        if (char >= 'a' && char <= 'z') return String.fromCodePoint(0x249C + (char.charCodeAt(0) - 97));
        if (char >= '1' && char <= '9') return String.fromCodePoint(0x2474 + (char.charCodeAt(0) - 49));
        if (char === '0') return '0';
      } else if (style === 'negative-circled') {
        if (char >= 'A' && char <= 'Z') return String.fromCodePoint(0x1F150 + (char.charCodeAt(0) - 65));
        if (char >= 'a' && char <= 'z') return String.fromCodePoint(0x1F150 + (char.charCodeAt(0) - 97));
        if (char >= '1' && char <= '9') return String.fromCodePoint(0x2776 + (char.charCodeAt(0) - 49));
        if (char === '0') return '⓿';
      }
      return char;
    }).join('');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter text to convert
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hello World 123"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
        <div className="mt-4">
          <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Style</label>
          <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value as typeof style)} aria-label="Enclosed style" className="input-field">
            <option value="circled">Circled (Ⓐ ① ⓪)</option>
            <option value="parenthesized">Parenthesized (⒜ ⑴)</option>
            <option value="negative-circled">Negative Circled (🅐 ❶)</option>
          </select>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert</button>
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
