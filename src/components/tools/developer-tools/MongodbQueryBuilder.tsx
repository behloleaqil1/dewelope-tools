'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface QueryFilter {
  field: string;
  operator: string;
  value: string;
}

const OPERATORS = [
  { value: '$eq', label: 'Equals ($eq)' },
  { value: '$ne', label: 'Not Equals ($ne)' },
  { value: '$gt', label: 'Greater Than ($gt)' },
  { value: '$gte', label: 'Greater or Equal ($gte)' },
  { value: '$lt', label: 'Less Than ($lt)' },
  { value: '$lte', label: 'Less or Equal ($lte)' },
  { value: '$in', label: 'In Array ($in)' },
  { value: '$nin', label: 'Not In Array ($nin)' },
  { value: '$regex', label: 'Regex ($regex)' },
  { value: '$exists', label: 'Exists ($exists)' },
];

/**
 * MongodbQueryBuilder - Build MongoDB find/aggregate queries from form inputs.
 */
export default function MongodbQueryBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [collection, setCollection] = useState('');
  const [queryType, setQueryType] = useState<'find' | 'aggregate'>('find');
  const [filters, setFilters] = useState<QueryFilter[]>([{ field: '', operator: '$eq', value: '' }]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState<'1' | '-1'>('1');
  const [limit, setLimit] = useState('');
  const [output, setOutput] = useState('');

  function addFilter() {
    setFilters([...filters, { field: '', operator: '$eq', value: '' }]);
  }

  function removeFilter(idx: number) {
    setFilters(filters.filter((_, i) => i !== idx));
  }

  function updateFilter(idx: number, key: keyof QueryFilter, val: string) {
    const updated = [...filters];
    updated[idx] = { ...updated[idx], [key]: val };
    setFilters(updated);
  }

  function parseValue(val: string, operator: string): unknown {
    if (operator === '$exists') return val.toLowerCase() === 'true';
    if (operator === '$in' || operator === '$nin') {
      return val.split(',').map((v) => {
        const trimmed = v.trim();
        const num = Number(trimmed);
        return isNaN(num) ? trimmed : num;
      });
    }
    const num = Number(val);
    if (!isNaN(num) && val.trim() !== '') return num;
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }

  function buildQuery() {
    const validFilters = filters.filter((f) => f.field.trim() && f.value.trim());

    if (queryType === 'find') {
      const query: Record<string, unknown> = {};
      validFilters.forEach((f) => {
        if (f.operator === '$eq') {
          query[f.field] = parseValue(f.value, f.operator);
        } else {
          query[f.field] = { [f.operator]: parseValue(f.value, f.operator) };
        }
      });

      let result = `db.${collection || 'collection'}.find(\n  ${JSON.stringify(query, null, 2).split('\n').join('\n  ')}`;

      const options: string[] = [];
      if (sortField.trim()) {
        options.push(`.sort({ ${JSON.stringify(sortField)}: ${sortOrder} })`);
      }
      if (limit.trim() && parseInt(limit) > 0) {
        options.push(`.limit(${parseInt(limit)})`);
      }

      result += '\n)' + options.join('');
      setOutput(result);
    } else {
      const pipeline: Record<string, unknown>[] = [];

      if (validFilters.length > 0) {
        const matchStage: Record<string, unknown> = {};
        validFilters.forEach((f) => {
          if (f.operator === '$eq') {
            matchStage[f.field] = parseValue(f.value, f.operator);
          } else {
            matchStage[f.field] = { [f.operator]: parseValue(f.value, f.operator) };
          }
        });
        pipeline.push({ $match: matchStage });
      }

      if (sortField.trim()) {
        pipeline.push({ $sort: { [sortField]: parseInt(sortOrder) } });
      }

      if (limit.trim() && parseInt(limit) > 0) {
        pipeline.push({ $limit: parseInt(limit) });
      }

      const result = `db.${collection || 'collection'}.aggregate(\n  ${JSON.stringify(pipeline, null, 2).split('\n').join('\n  ')}\n)`;
      setOutput(result);
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-collection`} className="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
          <input id={`${toolId}-collection`} type="text" value={collection} onChange={(e) => setCollection(e.target.value)} placeholder="e.g. users" aria-label={`Collection name for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Query Type</label>
          <select id={`${toolId}-type`} value={queryType} onChange={(e) => setQueryType(e.target.value as 'find' | 'aggregate')} aria-label={`Query type for ${toolName}`} className="input-field">
            <option value="find">find()</option>
            <option value="aggregate">aggregate()</option>
          </select>
        </InputArea>
      </div>

      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Filters</label>
        <div className="space-y-2">
          {filters.map((f, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input type="text" value={f.field} onChange={(e) => updateFilter(idx, 'field', e.target.value)} placeholder="Field" aria-label={`Filter field ${idx + 1}`} className="input-field flex-1" />
              <select value={f.operator} onChange={(e) => updateFilter(idx, 'operator', e.target.value)} aria-label={`Filter operator ${idx + 1}`} className="input-field w-40">
                {OPERATORS.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
              </select>
              <input type="text" value={f.value} onChange={(e) => updateFilter(idx, 'value', e.target.value)} placeholder="Value" aria-label={`Filter value ${idx + 1}`} className="input-field flex-1" />
              {filters.length > 1 && (
                <button onClick={() => removeFilter(idx)} className="text-red-500 hover:text-red-700 text-sm" aria-label={`Remove filter ${idx + 1}`}>✕</button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addFilter} className="mt-2 text-sm text-blue-600 hover:text-blue-800" aria-label="Add filter">+ Add Filter</button>
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-sort`} className="block text-sm font-medium text-gray-700 mb-1">Sort Field</label>
          <input id={`${toolId}-sort`} type="text" value={sortField} onChange={(e) => setSortField(e.target.value)} placeholder="e.g. createdAt" aria-label={`Sort field for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-order`} className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <select id={`${toolId}-order`} value={sortOrder} onChange={(e) => setSortOrder(e.target.value as '1' | '-1')} aria-label={`Sort order for ${toolName}`} className="input-field">
            <option value="1">Ascending (1)</option>
            <option value="-1">Descending (-1)</option>
          </select>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-limit`} className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
          <input id={`${toolId}-limit`} type="text" inputMode="numeric" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="e.g. 10" aria-label={`Limit for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={buildQuery} aria-label="Build MongoDB query" className="btn-primary">
        Build Query
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Query</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
