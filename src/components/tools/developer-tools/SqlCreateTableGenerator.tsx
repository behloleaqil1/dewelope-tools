'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SqlCreateTableGenerator - Generate CREATE TABLE SQL from column definitions.
 */
export default function SqlCreateTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: 'VARCHAR(255)', nullable: true }]);
  const [output, setOutput] = useState('');

  const TYPES = ['INT', 'BIGINT', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'DECIMAL(10,2)', 'FLOAT', 'UUID'];

  function addColumn() { setColumns([...columns, { name: '', type: 'VARCHAR(255)', nullable: true }]); }

  function updateCol(i: number, field: string, val: string | boolean) {
    const updated = [...columns];
    (updated[i] as Record<string, string | boolean>)[field] = val;
    setColumns(updated);
  }

  function generate() {
    if (!tableName.trim()) return;
    const cols = columns.filter((c) => c.name.trim()).map((c) =>
      `  ${c.name} ${c.type}${c.nullable ? '' : ' NOT NULL'}`
    );
    setOutput(`CREATE TABLE ${tableName} (\n${cols.join(',\n')}\n);`);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-table`} className="block text-sm font-medium text-gray-700 mb-1">Table Name for {toolName}</label>
        <input id={`${toolId}-table`} type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="users" aria-label="Table name" className="input-field mb-3" />
        {columns.map((col, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input type="text" value={col.name} onChange={(e) => updateCol(i, 'name', e.target.value)} placeholder="column_name" aria-label={`Column name ${i + 1}`} className="input-field flex-1" />
            <select value={col.type} onChange={(e) => updateCol(i, 'type', e.target.value)} aria-label={`Column type ${i + 1}`} className="input-field w-40">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <label className="text-xs whitespace-nowrap"><input type="checkbox" checked={!col.nullable} onChange={(e) => updateCol(i, 'nullable', !e.target.checked)} className="mr-1" />NOT NULL</label>
          </div>
        ))}
        <button onClick={addColumn} className="text-sm text-blue-600 hover:underline" aria-label="Add column">+ Add Column</button>
      </InputArea>

      <button onClick={generate} aria-label="Generate SQL" className="btn-primary">Generate SQL</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
