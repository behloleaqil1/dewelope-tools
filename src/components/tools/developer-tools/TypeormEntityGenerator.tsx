'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Column {
  name: string;
  type: string;
  primary: boolean;
  nullable: boolean;
  unique: boolean;
  generated: boolean;
}

const TYPEORM_TYPES = ['varchar', 'int', 'bigint', 'float', 'double', 'decimal', 'boolean', 'text', 'date', 'timestamp', 'json', 'uuid', 'enum'];

/**
 * TypeormEntityGenerator - Generate TypeORM entity class from table schema.
 * Supports common column types, decorators, and constraints.
 */
export default function TypeormEntityGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [entityName, setEntityName] = useState('');
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([{ name: 'id', type: 'int', primary: true, nullable: false, unique: false, generated: true }]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'varchar', primary: false, nullable: true, unique: false, generated: false }]);
  };

  const removeColumn = (idx: number) => {
    setColumns(columns.filter((_, i) => i !== idx));
  };

  const updateColumn = (idx: number, field: keyof Column, value: string | boolean) => {
    const updated = [...columns];
    updated[idx] = { ...updated[idx], [field]: value };
    setColumns(updated);
  };

  const mapType = (t: string): string => {
    const map: Record<string, string> = {
      varchar: 'string', int: 'number', bigint: 'number', float: 'number',
      double: 'number', decimal: 'number', boolean: 'boolean', text: 'string',
      date: 'Date', timestamp: 'Date', json: 'object', uuid: 'string', enum: 'string',
    };
    return map[t] || 'string';
  };

  const generate = () => {
    setError('');
    if (!entityName.trim()) { setError('Entity name is required'); return; }
    if (columns.length === 0) { setError('Add at least one column'); return; }
    if (columns.some(c => !c.name.trim())) { setError('All columns must have a name'); return; }

    const name = entityName.trim();
    const table = tableName.trim() || name.toLowerCase() + 's';
    let code = `import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from 'typeorm';\n\n`;
    code += `@Entity('${table}')\n`;
    code += `export class ${name} {\n`;

    for (const col of columns) {
      const decoratorParts: string[] = [];
      if (col.primary && col.generated) {
        code += `  @PrimaryGeneratedColumn()\n`;
      } else if (col.primary) {
        code += `  @PrimaryColumn()\n`;
      } else {
        if (col.type !== 'varchar') decoratorParts.push(`type: '${col.type}'`);
        if (col.nullable) decoratorParts.push('nullable: true');
        if (col.unique) decoratorParts.push('unique: true');
        const opts = decoratorParts.length > 0 ? `{ ${decoratorParts.join(', ')} }` : '';
        code += `  @Column(${opts})\n`;
      }
      const tsType = mapType(col.type);
      const nullable = col.nullable && !col.primary ? ' | null' : '';
      code += `  ${col.name}: ${tsType}${nullable};\n\n`;
    }

    code += '}\n';
    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-entity`} className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
              <input id={`${toolId}-entity`} type="text" value={entityName} onChange={(e) => setEntityName(e.target.value)} placeholder="e.g. User" aria-label={`Entity name for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-table`} className="block text-sm font-medium text-gray-700 mb-1">Table Name (optional)</label>
              <input id={`${toolId}-table`} type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="e.g. users" aria-label={`Table name for ${toolName}`} className="input-field" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Columns</label>
            {columns.map((col, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                <input type="text" value={col.name} onChange={(e) => updateColumn(idx, 'name', e.target.value)} placeholder="Column name" className="input-field w-32 text-sm" aria-label={`Column ${idx + 1} name`} />
                <select value={col.type} onChange={(e) => updateColumn(idx, 'type', e.target.value)} className="input-field w-28 text-sm" aria-label={`Column ${idx + 1} type`}>
                  {TYPEORM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={col.primary} onChange={(e) => updateColumn(idx, 'primary', e.target.checked)} /> PK</label>
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={col.nullable} onChange={(e) => updateColumn(idx, 'nullable', e.target.checked)} /> Null</label>
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={col.unique} onChange={(e) => updateColumn(idx, 'unique', e.target.checked)} /> Unique</label>
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={col.generated} onChange={(e) => updateColumn(idx, 'generated', e.target.checked)} /> Auto</label>
                <button onClick={() => removeColumn(idx)} className="text-red-500 text-xs hover:text-red-700" aria-label={`Remove column ${idx + 1}`}>✕</button>
              </div>
            ))}
            <button onClick={addColumn} className="text-sm text-blue-600 hover:text-blue-800">+ Add Column</button>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate TypeORM entity" className="btn-primary">Generate Entity</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
