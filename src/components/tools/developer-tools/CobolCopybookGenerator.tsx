'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CobolCopybookGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [groupName, setGroupName] = useState('WS-RECORD');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const toCobolPic = (value: unknown): string => {
    if (value === null) return 'PIC X(20)';
    if (typeof value === 'boolean') return 'PIC X(5)';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        const digits = Math.max(String(Math.abs(value)).length, 4);
        return value < 0 ? `PIC S9(${digits})` : `PIC 9(${digits})`;
      }
      const parts = String(value).split('.');
      const intLen = Math.max(parts[0].replace('-', '').length, 4);
      const decLen = parts[1] ? parts[1].length : 2;
      return `PIC 9(${intLen})V9(${decLen})`;
    }
    if (typeof value === 'string') {
      const len = Math.max(value.length, 10);
      return `PIC X(${len})`;
    }
    return 'PIC X(50)';
  };

  const toCobolField = (key: string): string => {
    return key
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toUpperCase()
      .substring(0, 30);
  };

  const generate = () => {
    setError('');
    setOutput('');
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('Input must be a JSON object');
        return;
      }
      const lines: string[] = [];
      lines.push(`       01  ${groupName}.`);
      for (const [key, value] of Object.entries(parsed)) {
        const fieldName = toCobolField(key);
        const pic = toCobolPic(value);
        lines.push(`           05  WS-${fieldName}    ${pic}.`);
      }
      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON input');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Group Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="input-field mb-3"
          aria-label="COBOL group name"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"firstName": "John", "age": 30, "salary": 55000.50}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <button onClick={generate} className="btn-primary mt-2">Generate COBOL Copybook</button>
      </InputArea>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">COBOL Copybook</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
