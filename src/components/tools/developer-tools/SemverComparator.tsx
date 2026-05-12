'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SemverComparator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [output, setOutput] = useState('');

  const parse = (v: string) => {
    const match = v.trim().replace(/^v/i, '').match(/^(\d+)\.(\d+)\.(\d+)(.*)$/);
    if (!match) return null;
    return { major: parseInt(match[1]), minor: parseInt(match[2]), patch: parseInt(match[3]), pre: match[4] };
  };

  const compare = () => {
    const a = parse(v1), b = parse(v2);
    if (!a || !b) { setOutput('Error: Enter valid semver (e.g., 1.2.3)'); return; }
    let result: number;
    if (a.major !== b.major) result = a.major - b.major;
    else if (a.minor !== b.minor) result = a.minor - b.minor;
    else result = a.patch - b.patch;
    const symbol = result > 0 ? '>' : result < 0 ? '<' : '=';
    const desc = result > 0 ? 'is newer than' : result < 0 ? 'is older than' : 'is equal to';
    setOutput(`${v1.trim()} ${symbol} ${v2.trim()}\n\n${v1.trim()} ${desc} ${v2.trim()}\n\nv1: major=${a.major} minor=${a.minor} patch=${a.patch}\nv2: major=${b.major} minor=${b.minor} patch=${b.patch}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-v1`} className="block text-sm font-medium text-gray-700 mb-1">Version 1</label>
        <input id={`${toolId}-v1`} value={v1} onChange={(e) => setV1(e.target.value)} placeholder="1.2.3" className="input-field" aria-label={`Version 1 for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-v2`} className="block text-sm font-medium text-gray-700 mb-1">Version 2</label>
        <input id={`${toolId}-v2`} value={v2} onChange={(e) => setV2(e.target.value)} placeholder="2.0.0" className="input-field" aria-label={`Version 2 for ${toolName}`} />
      </InputArea>
      <button onClick={compare} className="btn-primary">Compare Versions</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
