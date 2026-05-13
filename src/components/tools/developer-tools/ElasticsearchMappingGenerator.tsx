'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ElasticsearchMappingGenerator - Generate Elasticsearch index mapping JSON.
 * Supports common field types, analyzers, and mapping options.
 */
export default function ElasticsearchMappingGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [indexName, setIndexName] = useState('my-index');
  const [fields, setFields] = useState([
    { name: 'title', type: 'text', analyzer: 'standard', index: true },
    { name: 'created_at', type: 'date', analyzer: '', index: true },
    { name: 'status', type: 'keyword', analyzer: '', index: true },
  ]);
  const [shards, setShards] = useState('1');
  const [replicas, setReplicas] = useState('1');
  const [dynamicMapping, setDynamicMapping] = useState<'true' | 'false' | 'strict'>('true');
  const [output, setOutput] = useState('');

  const fieldTypes = ['text', 'keyword', 'long', 'integer', 'short', 'byte', 'double', 'float', 'boolean', 'date', 'ip', 'geo_point', 'nested', 'object'];
  const analyzers = ['standard', 'simple', 'whitespace', 'stop', 'keyword', 'pattern', 'english', 'custom'];

  const addField = () => {
    setFields([...fields, { name: '', type: 'text', analyzer: 'standard', index: true }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: string, value: string | boolean) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const generate = () => {
    const properties: Record<string, Record<string, unknown>> = {};
    fields.forEach((field) => {
      if (!field.name) return;
      const prop: Record<string, unknown> = { type: field.type };
      if (field.type === 'text' && field.analyzer) {
        prop.analyzer = field.analyzer;
      }
      if (!field.index) {
        prop.index = false;
      }
      properties[field.name] = prop;
    });

    const mapping = {
      settings: {
        number_of_shards: parseInt(shards) || 1,
        number_of_replicas: parseInt(replicas) || 1,
      },
      mappings: {
        dynamic: dynamicMapping,
        properties,
      },
    };

    setOutput(JSON.stringify(mapping, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-index`} className="block text-sm font-medium text-gray-700 mb-1">Index Name</label>
            <input id={`${toolId}-index`} type="text" value={indexName} onChange={(e) => setIndexName(e.target.value)} className="input-field" aria-label={`Index name for ${toolName}`} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor={`${toolId}-shards`} className="block text-sm font-medium text-gray-700 mb-1">Shards</label>
              <input id={`${toolId}-shards`} type="number" value={shards} onChange={(e) => setShards(e.target.value)} className="input-field" aria-label="Number of shards" />
            </div>
            <div>
              <label htmlFor={`${toolId}-replicas`} className="block text-sm font-medium text-gray-700 mb-1">Replicas</label>
              <input id={`${toolId}-replicas`} type="number" value={replicas} onChange={(e) => setReplicas(e.target.value)} className="input-field" aria-label="Number of replicas" />
            </div>
            <div>
              <label htmlFor={`${toolId}-dynamic`} className="block text-sm font-medium text-gray-700 mb-1">Dynamic</label>
              <select id={`${toolId}-dynamic`} value={dynamicMapping} onChange={(e) => setDynamicMapping(e.target.value as 'true' | 'false' | 'strict')} className="input-field" aria-label="Dynamic mapping">
                <option value="true">true</option>
                <option value="false">false</option>
                <option value="strict">strict</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fields</label>
            {fields.map((field, i) => (
              <div key={i} className="grid grid-cols-12 gap-1 items-center">
                <input className="input-field col-span-3 text-xs" placeholder="Field name" value={field.name} onChange={(e) => updateField(i, 'name', e.target.value)} aria-label={`Field ${i + 1} name`} />
                <select className="input-field col-span-3 text-xs" value={field.type} onChange={(e) => updateField(i, 'type', e.target.value)} aria-label={`Field ${i + 1} type`}>
                  {fieldTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className="input-field col-span-3 text-xs" value={field.analyzer} onChange={(e) => updateField(i, 'analyzer', e.target.value)} disabled={field.type !== 'text'} aria-label={`Field ${i + 1} analyzer`}>
                  <option value="">none</option>
                  {analyzers.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                <label className="col-span-2 flex items-center gap-1 text-xs">
                  <input type="checkbox" checked={field.index} onChange={(e) => updateField(i, 'index', e.target.checked)} aria-label={`Field ${i + 1} indexed`} />
                  Index
                </label>
                <button onClick={() => removeField(i)} className="text-red-500 text-xs col-span-1" aria-label={`Remove field ${i + 1}`}>✕</button>
              </div>
            ))}
            <button onClick={addField} className="text-sm text-blue-600 hover:text-blue-800">+ Add Field</button>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Mapping</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Elasticsearch Mapping for &quot;{indexName}&quot;</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
