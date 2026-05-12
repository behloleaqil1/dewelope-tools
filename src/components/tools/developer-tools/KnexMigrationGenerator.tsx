'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  unique: boolean;
  defaultValue: string;
}

const COLUMN_TYPES = [
  'increments', 'bigIncrements', 'string', 'text', 'integer', 'bigInteger',
  'float', 'decimal', 'boolean', 'date', 'datetime', 'timestamp',
  'json', 'jsonb', 'uuid', 'binary', 'enum',
];

/**
 * KnexMigrationGenerator - Generate Knex.js migration files from table schema definition.
 * Supports common column types, nullable, unique, and default values.
 */
export default function KnexMigrationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    { name: 'id', type: 'increments', nullable: false, unique: false, defaultValue: '' },
  ]);
  const [timestamps, setTimestamps] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function addColumn() {
    setColumns([...columns, { name: '', type: 'string', nullable: false, unique: false, defaultValue: '' }]);
  }

  function removeColumn(idx: number) {
    setColumns(columns.filter((_, i) => i !== idx));
  }

  function updateColumn(idx: number, field: keyof Column, value: string | boolean) {
    const updated = [...columns];
    updated[idx] = { ...updated[idx], [field]: value };
    setColumns(updated);
  }

  function generate() {
    setError('');
    if (!tableName.trim()) {
      setError('Please enter a table name');
      return;
    }
    if (columns.length === 0) {
      setError('Add at least one column');
      return;
    }
    for (const col of columns) {
      if (!col.name.trim()) {
        setError('All columns must have a name');
        return;
      }
    }

    const lines: string[] = [];
    lines.push(`exports.up = function(knex) {`);
    lines.push(`  return knex.schema.createTable('${tableName.trim()}', function(table) {`);

    for (const col of columns) {
      let line = `    table.${col.type}('${col.name.trim()}')`;
      if (col.nullable) line += '.nullable()';
      if (col.unique) line += '.unique()';
      if (col.defaultValue.trim()) {
        const dv = col.defaultValue.trim();
        if (dv === 'true' || dv === 'false' || !isNaN(Number(dv))) {
          line += `.defaultTo(${dv})`;
        } else {
          line += `.defaultTo('${dv}')`;
        }
      }
      line += ';';
      lines.push(line);
    }

    if (timestamps) {
      lines.push('    table.timestamps(true, true);');
    }

    lines.push('  });');
    lines.push('};');
    lines.push('');
    lines.push(`exports.down = function(knex) {`);
    lines.push(`  return knex.schema.dropTable('${tableName.trim()}');`);
    lines.push('};');

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
          placeholder="e.g. users"
          aria-label={`Table name for ${toolName}`}
          className="input-field"
        />

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Columns</span>
            <button onClick={addColumn} className="text-sm text-blue-600 hover:text-blue-800">+ Add Column</button>
          </div>
          {columns.map((col, idx) => (
            <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end bg-gray-50 p-2 rounded border border-gray-200">
              <input type="text" value={col.name} onChange={(e) => updateColumn(idx, 'name', e.target.value)} placeholder="Column name" aria-label={`Column ${idx + 1} name`} className="input-field text-sm" />
              <select value={col.type} onChange={(e) => updateColumn(idx, 'type', e.target.value)} aria-label={`Column ${idx + 1} type`} className="input-field text-sm">
                {COLUMN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="text" value={col.defaultValue} onChange={(e) => updateColumn(idx, 'defaultValue', e.target.value)} placeholder="Default" aria-label={`Column ${idx + 1} default`} className="input-field text-sm" />
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1"><input type="checkbox" checked={col.nullable} onChange={(e) => updateColumn(idx, 'nullable', e.target.checked)} /> Null</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={col.unique} onChange={(e) => updateColumn(idx, 'unique', e.target.checked)} /> Unique</label>
              </div>
              <button onClick={() => removeColumn(idx)} className="text-red-500 text-xs hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm mt-3">
          <input type="checkbox" checked={timestamps} onChange={(e) => setTimestamps(e.target.checked)} />
          Include timestamps (created_at, updated_at)
        </label>
      </InputArea>

      <button onClick={generate} aria-label="Generate Knex migration" className="btn-primary">
        Generate Migration
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Knex.js Migration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
