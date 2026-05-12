'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface FieldDef {
  name: string;
  type: string;
  allowNull: boolean;
  primaryKey: boolean;
  autoIncrement: boolean;
  unique: boolean;
  defaultValue: string;
}

const SEQUELIZE_TYPES = [
  'STRING', 'STRING(255)', 'TEXT', 'INTEGER', 'BIGINT', 'FLOAT', 'DOUBLE',
  'DECIMAL(10,2)', 'BOOLEAN', 'DATE', 'DATEONLY', 'UUID', 'UUIDV4', 'JSON', 'JSONB', 'ENUM', 'ARRAY(STRING)',
];

/**
 * SequelizeModelGenerator - Generate Sequelize model definitions from table schema.
 */
export default function SequelizeModelGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [modelName, setModelName] = useState('');
  const [tableName, setTableName] = useState('');
  const [timestamps, setTimestamps] = useState(true);
  const [paranoid, setParanoid] = useState(false);
  const [fields, setFields] = useState<FieldDef[]>([
    { name: 'id', type: 'INTEGER', allowNull: false, primaryKey: true, autoIncrement: true, unique: false, defaultValue: '' },
  ]);
  const [output, setOutput] = useState('');

  const addField = () => {
    setFields([...fields, { name: '', type: 'STRING', allowNull: true, primaryKey: false, autoIncrement: false, unique: false, defaultValue: '' }]);
  };

  const removeField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const updateField = (idx: number, key: keyof FieldDef, value: string | boolean) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], [key]: value };
    setFields(updated);
  };

  const generate = () => {
    if (!modelName.trim()) return;

    const fieldDefs = fields
      .filter((f) => f.name.trim())
      .map((f) => {
        const attrs: string[] = [`type: DataTypes.${f.type}`];
        if (f.primaryKey) attrs.push('primaryKey: true');
        if (f.autoIncrement) attrs.push('autoIncrement: true');
        if (!f.allowNull) attrs.push('allowNull: false');
        if (f.unique) attrs.push('unique: true');
        if (f.defaultValue.trim()) attrs.push(`defaultValue: ${f.defaultValue}`);
        return `    ${f.name}: {\n      ${attrs.join(',\n      ')}\n    }`;
      })
      .join(',\n');

    const options: string[] = [];
    if (tableName.trim()) options.push(`    tableName: '${tableName}'`);
    options.push(`    timestamps: ${timestamps}`);
    if (paranoid) options.push(`    paranoid: true`);

    const code = `const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ${modelName} extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  ${modelName}.init({
${fieldDefs}
  }, {
    sequelize,
    modelName: '${modelName}',
${options.join(',\n')}
  });

  return ${modelName};
};`;

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-model`} className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
          <input id={`${toolId}-model`} type="text" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="e.g. User" aria-label={`Model name for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-table`} className="block text-sm font-medium text-gray-700 mb-1">Table Name (optional)</label>
          <input id={`${toolId}-table`} type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="e.g. users" aria-label={`Table name for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={timestamps} onChange={(e) => setTimestamps(e.target.checked)} className="rounded" />
          Timestamps
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={paranoid} onChange={(e) => setParanoid(e.target.checked)} className="rounded" />
          Paranoid (soft delete)
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Fields</h3>
          <button onClick={addField} className="text-sm text-blue-600 hover:text-blue-800">+ Add Field</button>
        </div>
        {fields.map((field, idx) => (
          <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input type="text" value={field.name} onChange={(e) => updateField(idx, 'name', e.target.value)} placeholder="Field name" aria-label="Field name" className="input-field text-sm" />
            <select value={field.type} onChange={(e) => updateField(idx, 'type', e.target.value)} aria-label="Field type" className="input-field text-sm">
              {SEQUELIZE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex flex-wrap gap-2 items-center col-span-2">
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={field.primaryKey} onChange={(e) => updateField(idx, 'primaryKey', e.target.checked)} />PK</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={field.autoIncrement} onChange={(e) => updateField(idx, 'autoIncrement', e.target.checked)} />Auto</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!field.allowNull} onChange={(e) => updateField(idx, 'allowNull', !e.target.checked)} />Required</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={field.unique} onChange={(e) => updateField(idx, 'unique', e.target.checked)} />Unique</label>
              <button onClick={() => removeField(idx)} className="text-red-500 text-xs ml-auto hover:text-red-700">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={generate} aria-label="Generate Sequelize model" className="btn-primary">
        Generate Model
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
