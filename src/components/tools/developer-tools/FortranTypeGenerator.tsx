'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function FortranTypeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [typeName, setTypeName] = useState('my_type');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const toFortranType = (value: unknown): string => {
    if (value === null) return 'character(len=:), allocatable';
    if (typeof value === 'boolean') return 'logical';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'real(8)';
    }
    if (typeof value === 'string') return 'character(len=256)';
    if (Array.isArray(value)) return 'integer, dimension(:), allocatable';
    return 'character(len=256)';
  };

  const toFortranField = (key: string): string => {
    return key
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
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
      lines.push(`type :: ${typeName}`);
      for (const [key, value] of Object.entries(parsed)) {
        const fieldName = toFortranField(key);
        const fType = toFortranType(value);
        lines.push(`  ${fType} :: ${fieldName}`);
      }
      lines.push(`end type ${typeName}`);
      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON input');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Type Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          className="input-field mb-3"
          aria-label="Fortran type name"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "score": 95.5}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <button onClick={generate} className="btn-primary mt-2">Generate Fortran Type</button>
      </InputArea>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fortran Derived Type</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
