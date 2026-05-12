'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextObfuscator - Obfuscate text by replacing characters with similar-looking Unicode.
 */
export default function TextObfuscator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [level, setLevel] = useState<'light' | 'medium' | 'heavy'>('medium');

  const lightMap: Record<string, string> = {
    a: 'а', e: 'е', o: 'о', p: 'р', c: 'с', x: 'х', y: 'у',
    A: 'А', E: 'Е', O: 'О', P: 'Р', C: 'С', X: 'Х',
  };

  const mediumMap: Record<string, string> = {
    ...lightMap,
    i: 'і', l: 'ⅼ', s: 'ѕ', h: 'һ', d: 'ԁ', g: 'ɡ', n: 'ո',
    I: 'Ⅰ', S: 'Ѕ', H: 'Η', B: 'В', T: 'Τ', M: 'Μ', N: 'Ν',
  };

  const heavyMap: Record<string, string> = {
    ...mediumMap,
    a: 'ɑ', b: 'Ь', f: 'ƒ', j: 'ϳ', k: 'κ', m: 'ⅿ', r: 'г', t: 'τ',
    u: 'υ', v: 'ν', w: 'ω', z: 'ᴢ',
    D: 'Ⅾ', F: 'Ϝ', K: 'Κ', L: 'Ⅼ', R: 'Ꭱ', W: 'Ꮃ', Z: 'Ζ',
  };

  const obfuscate = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const map = level === 'light' ? lightMap : level === 'medium' ? mediumMap : heavyMap;

    const result = input
      .split('')
      .map((char) => map[char] || char)
      .join('');

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
              placeholder="Enter text to obfuscate..."
              aria-label={`Text input for ${toolName}`}
              className="input-field h-32 resize-y"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-level`} className="block text-sm font-medium text-gray-700 mb-1">Obfuscation Level</label>
            <select id={`${toolId}-level`} value={level} onChange={(e) => setLevel(e.target.value as 'light' | 'medium' | 'heavy')} aria-label="Obfuscation level" className="input-field w-48">
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={obfuscate} className="btn-primary" aria-label="Obfuscate text">Obfuscate Text</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Obfuscated Text</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <p className="text-xs text-gray-500">Characters replaced with similar-looking Unicode glyphs. Looks the same but is different text.</p>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
