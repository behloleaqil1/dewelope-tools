'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SqlCreateTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!tableName.trim() || !fields.trim()) return;
    const lines = fields.split('\n').filter(l => l.trim());
    const columns = lines.map(line => {
      const parts = line.split(/[,\t]+/).map(p => p.trim());
      const name = parts[0] || 'column';
      const type = parts[1] || 'VARCHAR(255)';
      const constraints = parts.slice(2).join(' ');
      return `  ${name} ${type}${constraints ? ' ' + constraints : ''}`;
    });
    setOutput(`CREATE TABLE ${tableName} (\n${columns.join(',\n')}\n);`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-table`} className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
        <input id={`${toolId}-table`} type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="e.g. users" aria-label={`Table name for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-fields`} className="block text-sm font-medium text-gray-700 mb-1">Fields (name, type, constraints - one per line)</label>
        <textarea id={`${toolId}-fields`} value={fields} onChange={(e) => setFields(e.target.value)} placeholder="id, INT, PRIMARY KEY AUTO_INCREMENT&#10;name, VARCHAR(100), NOT NULL&#10;email, VARCHAR(255), UNIQUE" aria-label={`Field definitions for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={generate} className="btn-primary" aria-label="Generate SQL">Generate SQL</button>
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
