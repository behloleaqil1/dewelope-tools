'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PigLatinTranslator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const toPigLatin = (word: string): string => {
    if (!word) return '';
    const vowels = 'aeiouAEIOU';
    const isUpper = word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase();
    const lower = word.toLowerCase();

    let result: string;
    if (vowels.includes(lower[0])) {
      result = lower + 'way';
    } else {
      let consonantCluster = '';
      let i = 0;
      while (i < lower.length && !vowels.includes(lower[i])) {
        consonantCluster += lower[i];
        i++;
      }
      result = lower.slice(i) + consonantCluster + 'ay';
    }

    if (isUpper) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
  };

  const translate = () => {
    if (!input.trim()) { setOutput(''); return; }
    const result = input.replace(/\b([a-zA-Z]+)\b/g, (match) => toPigLatin(match));
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">English Text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Hello World, this is a test!" aria-label={`English text input for ${toolName}`} className="input-field h-28 resize-y font-mono" />
      </InputArea>
      <button onClick={translate} className="btn-primary">Translate to Pig Latin</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
