'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToSqlCreate - Generate SQL CREATE TABLE statements from JSON structure.
 * Infers column types from JSON values and supports customizable table name.
 */
export default function JsonToSqlCreate({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [tableName, setTableName] = useState('my_table');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inferSqlType = (value: unknown): string => {
    if (value === null || value === undefined) return 'TEXT';
    if (typeof value === 'boolean') return 'BOOLEAN';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'INTEGER' : 'DECIMAL(10,2)';
    }
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return 'TIMESTAMP';
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'DATE';
      if (value.length > 255) return 'TEXT';
      return 'VARCHAR(255)';
    }
    if (Array.isArray(value)) return 'JSON';
    if (typeof value === 'object') return 'JSON';
    return 'TEXT';
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) { setOutput(''); setError(''); return; }

    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        const obj = Array.isArray(parsed) ? parsed[0] : parsed;

        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
          setError('Please provide a JSON object or an array of objects.');
          setOutput('');
          return;
        }

        const name = tableName.trim() || 'my_table';
        const columns = Object.entries(obj).map(([key, value]) => {
          const sqlType = inferSqlType(value);
          const colName = key.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
          return `  ${colName} ${sqlType}`;
        });

        const sql = `CREATE TABLE ${name} (\n  id INTEGER PRIMARY KEY AUTO_INCREMENT,\n${columns.join(',\n')}\n);`;
        setOutput(sql);
        setError('');
      } catch {
        setError('Invalid JSON. Please check your input.');
        setOutput('');
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, tableName]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-table`} className="block text-sm font-medium text-gray-700 mb-1">
          Table Name
        </label>
        <input
          id={`${toolId}-table`}
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="my_table"
          aria-label={`Table name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "email": "john@example.com", "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SQL CREATE TABLE Statement</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
