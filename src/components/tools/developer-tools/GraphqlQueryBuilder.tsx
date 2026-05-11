'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GraphqlQueryBuilder - Build GraphQL queries from field selections with variables support.
 */
export default function GraphqlQueryBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [operationType, setOperationType] = useState<'query' | 'mutation' | 'subscription'>('query');
  const [operationName, setOperationName] = useState('');
  const [fields, setFields] = useState('');
  const [variables, setVariables] = useState<{ name: string; type: string; required: boolean }[]>([
    { name: '', type: 'String', required: false },
  ]);
  const [result, setResult] = useState('');

  const GRAPHQL_TYPES = ['String', 'Int', 'Float', 'Boolean', 'ID', '[String]', '[Int]', '[Float]', '[Boolean]', '[ID]'];

  const addVariable = () => {
    setVariables([...variables, { name: '', type: 'String', required: false }]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: string, value: string | boolean) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const buildQuery = () => {
    const validVars = variables.filter(v => v.name.trim());
    const fieldLines = fields
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    if (fieldLines.length === 0) {
      setResult('// Please add at least one field');
      return;
    }

    let query = '';

    // Build variable definitions
    const varDefs = validVars.map(v => {
      const typeName = v.required ? `${v.type}!` : v.type;
      return `$${v.name}: ${typeName}`;
    });

    // Operation line
    const opName = operationName.trim() || 'MyOperation';
    if (varDefs.length > 0) {
      query += `${operationType} ${opName}(${varDefs.join(', ')}) {\n`;
    } else {
      query += `${operationType} ${opName} {\n`;
    }

    // Build fields with indentation
    const indent = '  ';
    fieldLines.forEach(field => {
      // Support nested fields with dot notation
      if (field.includes('.')) {
        const parts = field.split('.');
        let currentIndent = indent;
        parts.forEach((part, i) => {
          if (i < parts.length - 1) {
            query += `${currentIndent}${part} {\n`;
            currentIndent += indent;
          } else {
            query += `${currentIndent}${part}\n`;
          }
        });
        // Close nested braces
        for (let i = parts.length - 2; i >= 0; i--) {
          const closeIndent = indent + indent.repeat(i);
          query += `${closeIndent}}\n`;
        }
      } else {
        query += `${indent}${field}\n`;
      }
    });

    query += '}';

    // Add variables JSON if any
    if (validVars.length > 0) {
      const varsObj: Record<string, string> = {};
      validVars.forEach(v => {
        switch (v.type) {
          case 'Int':
          case 'Float': varsObj[v.name] = '0'; break;
          case 'Boolean': varsObj[v.name] = 'false'; break;
          default: varsObj[v.name] = '""'; break;
        }
      });
      query += '\n\n// Variables:\n' + JSON.stringify(varsObj, null, 2).replace(/"(\d+)"/g, '$1').replace(/"(false|true)"/g, '$1');
    }

    setResult(query);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Operation Type</label>
        <div className="flex gap-3 mb-4">
          {(['query', 'mutation', 'subscription'] as const).map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`${toolId}-type`}
                value={type}
                checked={operationType === type}
                onChange={() => setOperationType(type)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>

        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Operation Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={operationName}
          onChange={(e) => setOperationName(e.target.value)}
          placeholder="e.g. GetUsers, CreatePost"
          aria-label={`Operation name for ${toolName}`}
          className="input-field mb-4"
        />

        <label htmlFor={`${toolId}-fields`} className="block text-sm font-medium text-gray-700 mb-1">
          Fields (one per line, use dot notation for nested: user.name)
        </label>
        <textarea
          id={`${toolId}-fields`}
          value={fields}
          onChange={(e) => setFields(e.target.value)}
          placeholder={'id\nname\nemail\nposts.title\nposts.createdAt'}
          aria-label="GraphQL fields"
          className="input-field h-32 resize-y font-mono text-sm"
        />

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Variables</label>
            <button onClick={addVariable} className="text-xs text-blue-600 hover:text-blue-800">+ Add Variable</button>
          </div>
          {variables.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={v.name}
                onChange={(e) => updateVariable(i, 'name', e.target.value)}
                placeholder="varName"
                aria-label={`Variable ${i + 1} name`}
                className="input-field text-sm flex-1 font-mono"
              />
              <select
                value={v.type}
                onChange={(e) => updateVariable(i, 'type', e.target.value)}
                aria-label={`Variable ${i + 1} type`}
                className="input-field text-sm w-28"
              >
                {GRAPHQL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={v.required}
                  onChange={(e) => updateVariable(i, 'required', e.target.checked)}
                />
                Required
              </label>
              {variables.length > 1 && (
                <button onClick={() => removeVariable(i)} className="text-red-500 text-sm hover:text-red-700" aria-label="Remove variable">✕</button>
              )}
            </div>
          ))}
        </div>
      </InputArea>

      <button onClick={buildQuery} aria-label="Build GraphQL query" className="btn-primary">
        Build Query
      </button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Query</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
