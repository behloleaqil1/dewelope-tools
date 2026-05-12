'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function AdaRecordGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [recordName, setRecordName] = useState('My_Record');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const toAdaType = (value: unknown): string => {
    if (value === null) return 'access String';
    if (typeof value === 'boolean') return 'Boolean';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'Integer' : 'Float';
    }
    if (typeof value === 'string') return 'Unbounded_String';
    if (Array.isArray(value)) return 'access JSON_Array';
    if (typeof value === 'object') return 'access JSON_Object';
    return 'Unbounded_String';
  };

  const toAdaFieldName = (key: string): string => {
    return key
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('_');
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
      lines.push(`with Ada.Strings.Unbounded; use Ada.Strings.Unbounded;`);
      lines.push('');
      lines.push(`type ${recordName} is record`);
      for (const [key, value] of Object.entries(parsed)) {
        const fieldName = toAdaFieldName(key);
        const adaType = toAdaType(value);
        lines.push(`   ${fieldName} : ${adaType};`);
      }
      lines.push(`end record;`);
      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON input');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Record Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={recordName}
          onChange={(e) => setRecordName(e.target.value)}
          className="input-field mb-3"
          aria-label="Ada record name"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <button onClick={generate} className="btn-primary mt-2">Generate Ada Record</button>
      </InputArea>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Ada Record Type</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
