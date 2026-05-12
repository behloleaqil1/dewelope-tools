'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextCharacterFrequency - Show frequency of each character in text.
 */
export default function TextCharacterFrequency({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function analyze() {
    if (!input) { setOutput(''); return; }
    const freq: Record<string, number> = {};
    for (const ch of input) {
      freq[ch] = (freq[ch] || 0) + 1;
    }
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const total = input.length;
    const lines = sorted.map(([ch, count]) => {
      const display = ch === ' ' ? '(space)' : ch === '\n' ? '(newline)' : ch === '\t' ? '(tab)' : `"${ch}"`;
      return `${display}: ${count} (${((count / total) * 100).toFixed(1)}%)`;
    });
    setOutput(`Total characters: ${total}\n\n${lines.join('\n')}`);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text for {toolName}</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to analyze character frequency..." aria-label="Text input for character frequency analysis" className="input-field h-40 resize-y font-mono" />
      </InputArea>

      <button onClick={analyze} aria-label="Analyze character frequency" className="btn-primary">Analyze</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
