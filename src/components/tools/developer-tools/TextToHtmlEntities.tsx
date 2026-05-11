'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToHtmlEntities - Converts special characters to HTML entities and back.
 * Supports named entities and numeric character references.
 */
export default function TextToHtmlEntities({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState<'named' | 'numeric' | 'all'>('named');

  const namedEntities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    '©': '&copy;', '®': '&reg;', '™': '&trade;', '€': '&euro;', '£': '&pound;',
    '¥': '&yen;', '¢': '&cent;', '§': '&sect;', '°': '&deg;', '±': '&plusmn;',
    '×': '&times;', '÷': '&divide;', '¶': '&para;', '•': '&bull;', '…': '&hellip;',
    '–': '&ndash;', '—': '&mdash;', '←': '&larr;', '→': '&rarr;', '↑': '&uarr;',
    '↓': '&darr;', '♠': '&spades;', '♣': '&clubs;', '♥': '&hearts;', '♦': '&diams;',
    '\u00A0': '&nbsp;', '¡': '&iexcl;', '¿': '&iquest;', '«': '&laquo;', '»': '&raquo;',
  };

  const reverseEntities: Record<string, string> = {};
  for (const [char, entity] of Object.entries(namedEntities)) {
    reverseEntities[entity] = char;
  }

  const encode = (text: string): string => {
    if (encodeMode === 'all') {
      return Array.from(text).map(char => {
        if (char.charCodeAt(0) > 127 || namedEntities[char]) {
          return `&#${char.charCodeAt(0)};`;
        }
        if (char === '&') return '&amp;';
        if (char === '<') return '&lt;';
        if (char === '>') return '&gt;';
        if (char === '"') return '&quot;';
        return char;
      }).join('');
    }

    if (encodeMode === 'numeric') {
      return Array.from(text).map(char => {
        if (char.charCodeAt(0) > 127 || ['&', '<', '>', '"', "'"].includes(char)) {
          return `&#${char.charCodeAt(0)};`;
        }
        return char;
      }).join('');
    }

    // Named mode
    return Array.from(text).map(char => {
      if (namedEntities[char]) return namedEntities[char];
      if (char.charCodeAt(0) > 127) return `&#${char.charCodeAt(0)};`;
      return char;
    }).join('');
  };

  const decode = (text: string): string => {
    let result = text;
    // Decode named entities
    for (const [entity, char] of Object.entries(reverseEntities)) {
      result = result.split(entity).join(char);
    }
    // Decode numeric entities
    result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
    return result;
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput(mode === 'encode' ? encode(input) : decode(input));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setMode('encode'); setOutput(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          aria-label="Encode to HTML entities"
        >
          Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          aria-label="Decode HTML entities"
        >
          Decode
        </button>
      </div>

      {mode === 'encode' && (
        <div className="flex gap-2 flex-wrap">
          {(['named', 'numeric', 'all'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setEncodeMode(m); setOutput(''); }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${encodeMode === m ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label={`Encode mode: ${m}`}
            >
              {m === 'named' ? 'Named (&amp;)' : m === 'numeric' ? 'Numeric (&#38;)' : 'All Characters'}
            </button>
          ))}
        </div>
      )}

      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'encode' ? 'Enter text to encode' : 'Enter HTML entities to decode'}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'e.g. <div class="test"> © 2024' : 'e.g. &lt;div class=&quot;test&quot;&gt; &copy; 2024'}
          aria-label={`Input for ${toolName}`}
          className="input-field h-36 resize-y font-mono"
        />
      </InputArea>

      <button onClick={convert} aria-label={mode === 'encode' ? 'Encode to entities' : 'Decode entities'} className="btn-primary">
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
