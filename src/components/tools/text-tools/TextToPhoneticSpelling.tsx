'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToPhoneticSpelling - Spell out text phonetically (how it sounds).
 */
export default function TextToPhoneticSpelling({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const phoneticMap: Record<string, string> = {
    a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'eff', g: 'jee',
    h: 'aych', i: 'eye', j: 'jay', k: 'kay', l: 'ell', m: 'em', n: 'en',
    o: 'oh', p: 'pee', q: 'kyoo', r: 'arr', s: 'ess', t: 'tee', u: 'yoo',
    v: 'vee', w: 'double-yoo', x: 'eks', y: 'why', z: 'zee',
    '0': 'zero', '1': 'wun', '2': 'too', '3': 'tree', '4': 'fow-er',
    '5': 'fife', '6': 'six', '7': 'sev-en', '8': 'ait', '9': 'nin-er',
  };

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const result = input
      .toLowerCase()
      .split('')
      .map((char) => {
        if (char === ' ') return '(space)';
        if (char === '\n') return '\n';
        if (phoneticMap[char]) return phoneticMap[char];
        return char;
      })
      .join(' ');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter Text</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to spell phonetically..."
          aria-label={`Text input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert to phonetic spelling">Spell Phonetically</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phonetic Spelling</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
