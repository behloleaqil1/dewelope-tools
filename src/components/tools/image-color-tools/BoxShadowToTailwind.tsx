'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BoxShadowToTailwind({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('0 4px 6px -1px rgba(0, 0, 0, 0.1)');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) return;
    const shadows: Record<string, string> = {
      '0 1px 2px 0 rgb(0 0 0 / 0.05)': 'shadow-sm',
      '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)': 'shadow',
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)': 'shadow-md',
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)': 'shadow-lg',
      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)': 'shadow-xl',
      '0 25px 50px -12px rgb(0 0 0 / 0.25)': 'shadow-2xl',
    };
    const normalized = input.trim().replace(/rgba?\(([^)]+)\)/g, (_, args) => {
      const parts = args.split(',').map((s: string) => s.trim());
      if (parts.length === 4) return `rgb(${parts[0]} ${parts[1]} ${parts[2]} / ${parts[3]})`;
      return `rgb(${parts.join(' ')})`;
    });
    const match = Object.entries(shadows).find(([key]) => normalized.includes(key));
    const tailwindClass = match ? match[1] : `shadow-[${input.trim()}]`;
    setOutput(`Tailwind class: ${tailwindClass}\n\nUsage: <div className="${tailwindClass}">...</div>\n\nOriginal CSS: box-shadow: ${input.trim()};`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">CSS box-shadow value</label>
        <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)" aria-label={`Box shadow for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert to Tailwind">Convert</button>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
