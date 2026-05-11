'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SqlInsertGenerator - Generate SQL INSERT statements from tabular data (CSV/TSV).
 * Parses header row as column names and subsequent rows as values.
 */
export default function SqlInsertGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [tableName, setTableName] = useState('my_table');
  const [delimiter, setDelimiter] = useState<'comma' | 'tab' | 'pipe'>('comma');
  const [output, setOutput] = useState('');

  function getDelimiterChar() {
    switch (delimiter) {
      case 'comma': return ',';
      case 'tab': return '\t';
      case 'pipe': return '|';
    }
  }

  function escapeValue(val: string): string {
    const trimmed = val.trim();
    if (trimmed === '' || trimmed.toLowerCase() === 'null') return 'NULL';
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed;
    if (trimmed.toLowerCase() === 'true') return 'TRUE';
    if (trimmed.toLowerCase() === 'false') return 'FALSE';
    return `'${trimmed.replace(/'/g, "''")}'`;
  }

  function handleGenerate() {
    if (!input.trim() || !tableName.trim()) return;

    const delim = getDelimiterChar();
    const lines = input.split('\n').filter((l) => l.trim().length > 0);

    if (lines.length < 2) {
      setOutput('-- Need at least a header row and one data row');
      return;
    }

    const columns = lines[0].split(delim).map((c) => c.trim());
    const statements: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delim).map((v) => escapeValue(v));
      statements.push(
        `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`
      );
    }

    setOutput(statements.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Tabular Data (first row = column headers)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"id,name,email,age\n1,John Doe,john@example.com,30\n2,Jane Smith,jane@example.com,25"}
          aria-label={`Tabular data input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="flex-1 min-w-[140px]">
            <label htmlFor={`${toolId}-table`} className="block text-xs text-gray-500 mb-1">Table Name</label>
            <input
              id={`${toolId}-table`}
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="my_table"
              aria-label="SQL table name"
              className="input-field text-sm"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label htmlFor={`${toolId}-delim`} className="block text-xs text-gray-500 mb-1">Delimiter</label>
            <select
              id={`${toolId}-delim`}
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as typeof delimiter)}
              aria-label="Column delimiter"
              className="input-field text-sm"
            >
              <option value="comma">Comma (,)</option>
              <option value="tab">Tab</option>
              <option value="pipe">Pipe (|)</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate SQL INSERT statements" className="btn-primary">
        Generate INSERT Statements
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">SQL INSERT Statements</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
