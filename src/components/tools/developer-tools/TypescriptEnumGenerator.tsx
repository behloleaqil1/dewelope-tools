'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TypescriptEnumGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [enumName, setEnumName] = useState('');
  const [values, setValues] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!enumName.trim() || !values.trim()) return;
    const lines = values.split('\n').filter(l => l.trim());
    const members = lines.map((line, _i) => {
      const parts = line.split(/[=,]/).map(p => p.trim());
      const name = parts[0].replace(/[^a-zA-Z0-9_]/g, '').replace(/^(\d)/, '_$1');
      const val = parts[1];
      return val ? `  ${name} = ${val}` : `  ${name}`;
    });
    setOutput(`enum ${enumName} {\n${members.join(',\n')}\n}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Enum Name</label>
        <input id={`${toolId}-name`} type="text" value={enumName} onChange={(e) => setEnumName(e.target.value)} placeholder="e.g. Status" aria-label={`Enum name for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-values`} className="block text-sm font-medium text-gray-700 mb-1">Values (one per line, optionally name=value)</label>
        <textarea id={`${toolId}-values`} value={values} onChange={(e) => setValues(e.target.value)} placeholder="Active&#10;Inactive&#10;Pending = 'pending'" aria-label={`Enum values for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={generate} className="btn-primary" aria-label="Generate enum">Generate Enum</button>
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
