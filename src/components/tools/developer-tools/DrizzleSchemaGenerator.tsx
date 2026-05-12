'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ColumnDef {
  name: string;
  type: string;
  primaryKey: boolean;
  notNull: boolean;
  unique: boolean;
  defaultValue: string;
}

const DRIZZLE_TYPES: Record<string, string[]> = {
  pg: ['serial', 'integer', 'bigint', 'smallint', 'boolean', 'text', 'varchar(255)', 'char(1)', 'numeric(10,2)', 'real', 'doublePrecision', 'timestamp', 'date', 'time', 'uuid', 'json', 'jsonb'],
  mysql: ['serial', 'int', 'bigint', 'smallint', 'boolean', 'text', 'varchar(255)', 'char(1)', 'decimal(10,2)', 'float', 'double', 'timestamp', 'date', 'time', 'json'],
  sqlite: ['integer', 'real', 'text', 'blob'],
};

/**
 * DrizzleSchemaGenerator - Generate Drizzle ORM schema from table definition.
 */
export default function DrizzleSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tableName, setTableName] = useState('');
  const [dialect, setDialect] = useState<'pg' | 'mysql' | 'sqlite'>('pg');
  const [columns, setColumns] = useState<ColumnDef[]>([
    { name: 'id', type: 'serial', primaryKey: true, notNull: true, unique: false, defaultValue: '' },
  ]);
  const [output, setOutput] = useState('');

  const addColumn = () => {
    const defaultType = DRIZZLE_TYPES[dialect][0];
    setColumns([...columns, { name: '', type: defaultType, primaryKey: false, notNull: false, unique: false, defaultValue: '' }]);
  };

  const removeColumn = (idx: number) => {
    setColumns(columns.filter((_, i) => i !== idx));
  };

  const updateColumn = (idx: number, key: keyof ColumnDef, value: string | boolean) => {
    const updated = [...columns];
    updated[idx] = { ...updated[idx], [key]: value };
    setColumns(updated);
  };

  const generate = () => {
    if (!tableName.trim()) return;

    const dialectModule = dialect === 'pg' ? 'drizzle-orm/pg-core' : dialect === 'mysql' ? 'drizzle-orm/mysql-core' : 'drizzle-orm/sqlite-core';

    const usedTypes = new Set<string>();
    columns.forEach((col) => {
      const baseType = col.type.replace(/\(.*\)/, '');
      usedTypes.add(baseType);
    });

    const tableFunc = dialect === 'pg' ? 'pgTable' : dialect === 'mysql' ? 'mysqlTable' : 'sqliteTable';
    usedTypes.add(tableFunc);

    const colDefs = columns
      .filter((c) => c.name.trim())
      .map((col) => {
        const baseType = col.type.replace(/\(.*\)/, '');
        const hasParams = col.type.includes('(');
        const params = hasParams ? col.type.match(/\((.+)\)/)?.[1] : null;

        let chain = `  ${col.name}: ${baseType}('${col.name}'${params ? `, { length: ${params} }` : ''})`;
        if (col.primaryKey) chain += '.primaryKey()';
        if (col.notNull && !col.primaryKey) chain += '.notNull()';
        if (col.unique) chain += '.unique()';
        if (col.defaultValue.trim()) chain += `.default(${col.defaultValue})`;
        return chain;
      })
      .join(',\n');

    const imports = Array.from(usedTypes).join(', ');

    const code = `import { ${imports} } from '${dialectModule}';

export const ${tableName} = ${tableFunc}('${tableName}', {
${colDefs}
});

// Type inference
export type ${capitalize(tableName)} = typeof ${tableName}.$inferSelect;
export type New${capitalize(tableName)} = typeof ${tableName}.$inferInsert;`;

    setOutput(code);
  };

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-table`} className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
          <input id={`${toolId}-table`} type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="e.g. users" aria-label={`Table name for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-dialect`} className="block text-sm font-medium text-gray-700 mb-1">Database Dialect</label>
          <select id={`${toolId}-dialect`} value={dialect} onChange={(e) => setDialect(e.target.value as 'pg' | 'mysql' | 'sqlite')} aria-label={`Dialect for ${toolName}`} className="input-field">
            <option value="pg">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
          </select>
        </InputArea>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Columns</h3>
          <button onClick={addColumn} className="text-sm text-blue-600 hover:text-blue-800">+ Add Column</button>
        </div>
        {columns.map((col, idx) => (
          <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input type="text" value={col.name} onChange={(e) => updateColumn(idx, 'name', e.target.value)} placeholder="Column name" aria-label="Column name" className="input-field text-sm" />
            <select value={col.type} onChange={(e) => updateColumn(idx, 'type', e.target.value)} aria-label="Column type" className="input-field text-sm">
              {DRIZZLE_TYPES[dialect].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex flex-wrap gap-2 items-center col-span-2">
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={col.primaryKey} onChange={(e) => updateColumn(idx, 'primaryKey', e.target.checked)} />PK</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={col.notNull} onChange={(e) => updateColumn(idx, 'notNull', e.target.checked)} />Not Null</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={col.unique} onChange={(e) => updateColumn(idx, 'unique', e.target.checked)} />Unique</label>
              <button onClick={() => removeColumn(idx)} className="text-red-500 text-xs ml-auto hover:text-red-700">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={generate} aria-label="Generate Drizzle schema" className="btn-primary">
        Generate Schema
      </button>

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
