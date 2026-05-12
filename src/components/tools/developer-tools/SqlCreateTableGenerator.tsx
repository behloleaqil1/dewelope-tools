'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue: string;
}

/**
 * SqlCreateTableGenerator - Generates SQL CREATE TABLE statements from column definitions.
 * Users define columns with name, type, constraints and get a ready-to-use SQL statement.
 */
export default function SqlCreateTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    { name: '', type: 'VARCHAR(255)', nullable: true, primaryKey: false, defaultValue: '' },
  ]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const sqlTypes = ['INT', 'BIGINT', 'SMALLINT', 'VARCHAR(255)', 'VARCHAR(100)', 'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'DECIMAL(10,2)', 'FLOAT', 'DOUBLE', 'UUID', 'SERIAL', 'JSON', 'BLOB'];

  function addColumn() {
    setColumns([...columns, { name: '', type: 'VARCHAR(255)', nullable: true, primaryKey: false, defaultValue: '' }]);
  }

  function removeColumn(index: number) {
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== index));
    }
  }

  function updateColumn(index: number, field: keyof Column, value: string | boolean) {
    const updated = [...columns];
    updated[index] = { ...updated[index], [field]: value };
    setColumns(updated);
  }

  function handleGenerate() {
    setError(undefined);
    setOutput('');

    if (!tableName.trim()) {
      setError('Please enter a table name');
      return;
    }

    const validColumns = columns.filter((col) => col.name.trim());
    if (validColumns.length === 0) {
      setError('Please define at least one column with a name');
      return;
    }

    const lines: string[] = [];
    lines.push(`CREATE TABLE ${tableName.trim()} (`);

    const colDefs = validColumns.map((col) => {
      let def = `  ${col.name.trim()} ${col.type}`;
      if (col.primaryKey) def += ' PRIMARY KEY';
      if (!col.nullable && !col.primaryKey) def += ' NOT NULL';
      if (col.defaultValue.trim()) def += ` DEFAULT ${col.defaultValue.trim()}`;
      return def;
    });

    lines.push(colDefs.join(',\n'));
    lines.push(');');

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-table`} className="block text-sm font-medium text-gray-700 mb-1">
          Table Name
        </label>
        <input
          id={`${toolId}-table`}
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="users"
          aria-label={`Table name for ${toolName}`}
          className="input-field mb-3"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
        <div className="space-y-2">
          {columns.map((col, idx) => (
            <div key={idx} className="flex flex-wrap gap-2 items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                value={col.name}
                onChange={(e) => updateColumn(idx, 'name', e.target.value)}
                placeholder="column_name"
                aria-label={`Column ${idx + 1} name`}
                className="input-field flex-1 min-w-[120px]"
              />
              <select
                value={col.type}
                onChange={(e) => updateColumn(idx, 'type', e.target.value)}
                aria-label={`Column ${idx + 1} type`}
                className="input-field w-40"
              >
                {sqlTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-xs text-gray-600">
                <input type="checkbox" checked={col.primaryKey} onChange={(e) => updateColumn(idx, 'primaryKey', e.target.checked)} />
                PK
              </label>
              <label className="flex items-center gap-1 text-xs text-gray-600">
                <input type="checkbox" checked={!col.nullable} onChange={(e) => updateColumn(idx, 'nullable', !e.target.checked)} />
                NOT NULL
              </label>
              <input
                type="text"
                value={col.defaultValue}
                onChange={(e) => updateColumn(idx, 'defaultValue', e.target.value)}
                placeholder="Default"
                aria-label={`Column ${idx + 1} default`}
                className="input-field w-24"
              />
              <button onClick={() => removeColumn(idx)} aria-label={`Remove column ${idx + 1}`} className="text-red-500 hover:text-red-700 text-sm font-bold px-2">×</button>
            </div>
          ))}
        </div>
        <button onClick={addColumn} aria-label="Add column" className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          + Add Column
        </button>
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate SQL CREATE TABLE" className="btn-primary">
        Generate SQL
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated SQL</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
