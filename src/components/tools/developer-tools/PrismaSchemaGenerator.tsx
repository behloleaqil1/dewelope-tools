'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ModelField {
  name: string;
  type: string;
  isOptional: boolean;
  isUnique: boolean;
  isId: boolean;
  defaultValue: string;
}

interface PrismaModel {
  name: string;
  fields: ModelField[];
}

const FIELD_TYPES = [
  'String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json', 'BigInt', 'Decimal', 'Bytes',
];

/**
 * PrismaSchemaGenerator - Generate Prisma schema from model definitions.
 */
export default function PrismaSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [models, setModels] = useState<PrismaModel[]>([
    { name: 'User', fields: [{ name: 'id', type: 'Int', isOptional: false, isUnique: false, isId: true, defaultValue: 'autoincrement()' }] },
  ]);
  const [dbProvider, setDbProvider] = useState('postgresql');
  const [output, setOutput] = useState('');

  function addModel() {
    setModels([...models, { name: '', fields: [{ name: 'id', type: 'Int', isOptional: false, isUnique: false, isId: true, defaultValue: 'autoincrement()' }] }]);
  }

  function removeModel(idx: number) {
    setModels(models.filter((_, i) => i !== idx));
  }

  function updateModelName(idx: number, name: string) {
    const updated = [...models];
    updated[idx] = { ...updated[idx], name };
    setModels(updated);
  }

  function addField(modelIdx: number) {
    const updated = [...models];
    updated[modelIdx].fields.push({ name: '', type: 'String', isOptional: false, isUnique: false, isId: false, defaultValue: '' });
    setModels(updated);
  }

  function removeField(modelIdx: number, fieldIdx: number) {
    const updated = [...models];
    updated[modelIdx].fields = updated[modelIdx].fields.filter((_, i) => i !== fieldIdx);
    setModels(updated);
  }

  function updateField(modelIdx: number, fieldIdx: number, key: keyof ModelField, value: string | boolean) {
    const updated = [...models];
    updated[modelIdx].fields[fieldIdx] = { ...updated[modelIdx].fields[fieldIdx], [key]: value };
    setModels(updated);
  }

  function generate() {
    let schema = `// Generated Prisma Schema\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "${dbProvider}"\n  url      = env("DATABASE_URL")\n}\n`;

    models.forEach((model) => {
      if (!model.name.trim()) return;
      schema += `\nmodel ${model.name} {\n`;
      model.fields.forEach((field) => {
        if (!field.name.trim()) return;
        let line = `  ${field.name}  ${field.type}`;
        if (field.isOptional) line += '?';
        if (field.isId) line += '  @id';
        if (field.isUnique && !field.isId) line += '  @unique';
        if (field.defaultValue) line += `  @default(${field.defaultValue})`;
        schema += line + '\n';
      });
      schema += `  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n`;
    });

    setOutput(schema);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-provider`} className="block text-sm font-medium text-gray-700 mb-1">Database Provider</label>
        <select id={`${toolId}-provider`} value={dbProvider} onChange={(e) => setDbProvider(e.target.value)} aria-label={`Database provider for ${toolName}`} className="input-field w-48">
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="sqlite">SQLite</option>
          <option value="sqlserver">SQL Server</option>
          <option value="mongodb">MongoDB</option>
        </select>
      </InputArea>

      {models.map((model, mIdx) => (
        <InputArea key={mIdx}>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Model Name</label>
            <input type="text" value={model.name} onChange={(e) => updateModelName(mIdx, e.target.value)} placeholder="e.g. User" aria-label={`Model name ${mIdx + 1}`} className="input-field flex-1" />
            {models.length > 1 && (
              <button onClick={() => removeModel(mIdx)} className="text-red-500 hover:text-red-700 text-sm" aria-label={`Remove model ${mIdx + 1}`}>✕ Remove</button>
            )}
          </div>
          <div className="space-y-1 ml-2">
            {model.fields.map((field, fIdx) => (
              <div key={fIdx} className="flex gap-2 items-center flex-wrap">
                <input type="text" value={field.name} onChange={(e) => updateField(mIdx, fIdx, 'name', e.target.value)} placeholder="Field name" aria-label={`Field name ${fIdx + 1}`} className="input-field w-28" />
                <select value={field.type} onChange={(e) => updateField(mIdx, fIdx, 'type', e.target.value)} aria-label={`Field type ${fIdx + 1}`} className="input-field w-28">
                  {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input type="checkbox" checked={field.isId} onChange={(e) => updateField(mIdx, fIdx, 'isId', e.target.checked)} /> @id
                </label>
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input type="checkbox" checked={field.isUnique} onChange={(e) => updateField(mIdx, fIdx, 'isUnique', e.target.checked)} /> @unique
                </label>
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input type="checkbox" checked={field.isOptional} onChange={(e) => updateField(mIdx, fIdx, 'isOptional', e.target.checked)} /> Optional
                </label>
                <input type="text" value={field.defaultValue} onChange={(e) => updateField(mIdx, fIdx, 'defaultValue', e.target.value)} placeholder="@default(...)" aria-label={`Default value ${fIdx + 1}`} className="input-field w-32" />
                {model.fields.length > 1 && (
                  <button onClick={() => removeField(mIdx, fIdx)} className="text-red-500 hover:text-red-700 text-xs" aria-label={`Remove field ${fIdx + 1}`}>✕</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => addField(mIdx)} className="mt-2 text-sm text-blue-600 hover:text-blue-800" aria-label="Add field">+ Add Field</button>
        </InputArea>
      ))}

      <button onClick={addModel} className="text-sm text-green-600 hover:text-green-800" aria-label="Add model">+ Add Model</button>

      <button onClick={generate} aria-label="Generate Prisma schema" className="btn-primary">
        Generate Schema
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Prisma Schema</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
