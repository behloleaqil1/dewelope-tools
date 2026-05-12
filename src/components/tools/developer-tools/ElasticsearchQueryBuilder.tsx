'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type QueryType = 'match' | 'term' | 'range' | 'bool' | 'wildcard' | 'multi_match' | 'exists';

/**
 * ElasticsearchQueryBuilder - Build Elasticsearch JSON queries from form inputs.
 * Supports match, term, range, bool, wildcard, multi_match, and exists queries.
 */
export default function ElasticsearchQueryBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [queryType, setQueryType] = useState<QueryType>('match');
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  const [rangeGte, setRangeGte] = useState('');
  const [rangeLte, setRangeLte] = useState('');
  const [boolMust, setBoolMust] = useState('');
  const [boolShould, setBoolShould] = useState('');
  const [boolMustNot, setBoolMustNot] = useState('');
  const [fields, setFields] = useState('');
  const [size, setSize] = useState('10');
  const [output, setOutput] = useState('');

  function handleBuild() {
    if (!field.trim() && queryType !== 'bool') {
      setOutput('Error: Field name is required');
      return;
    }

    let query: Record<string, unknown> = {};

    switch (queryType) {
      case 'match':
        if (!value.trim()) { setOutput('Error: Value is required'); return; }
        query = { query: { match: { [field.trim()]: value.trim() } } };
        break;
      case 'term':
        if (!value.trim()) { setOutput('Error: Value is required'); return; }
        query = { query: { term: { [field.trim()]: { value: value.trim() } } } };
        break;
      case 'range': {
        const rangeObj: Record<string, string> = {};
        if (rangeGte.trim()) rangeObj.gte = rangeGte.trim();
        if (rangeLte.trim()) rangeObj.lte = rangeLte.trim();
        if (Object.keys(rangeObj).length === 0) { setOutput('Error: At least one range bound is required'); return; }
        query = { query: { range: { [field.trim()]: rangeObj } } };
        break;
      }
      case 'bool': {
        const boolObj: Record<string, unknown[]> = {};
        if (boolMust.trim()) boolObj.must = boolMust.split(',').map((f) => ({ match: { [f.trim().split(':')[0]]: f.trim().split(':')[1] || '' } }));
        if (boolShould.trim()) boolObj.should = boolShould.split(',').map((f) => ({ match: { [f.trim().split(':')[0]]: f.trim().split(':')[1] || '' } }));
        if (boolMustNot.trim()) boolObj.must_not = boolMustNot.split(',').map((f) => ({ match: { [f.trim().split(':')[0]]: f.trim().split(':')[1] || '' } }));
        if (Object.keys(boolObj).length === 0) { setOutput('Error: At least one bool clause is required'); return; }
        query = { query: { bool: boolObj } };
        break;
      }
      case 'wildcard':
        if (!value.trim()) { setOutput('Error: Pattern is required'); return; }
        query = { query: { wildcard: { [field.trim()]: { value: value.trim() } } } };
        break;
      case 'multi_match':
        if (!value.trim() || !fields.trim()) { setOutput('Error: Query and fields are required'); return; }
        query = { query: { multi_match: { query: value.trim(), fields: fields.split(',').map((f) => f.trim()) } } };
        break;
      case 'exists':
        query = { query: { exists: { field: field.trim() } } };
        break;
    }

    const sizeNum = parseInt(size) || 10;
    const finalQuery = { ...query, size: sizeNum };
    setOutput(JSON.stringify(finalQuery, null, 2));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Query Type
        </label>
        <select
          id={`${toolId}-type`}
          value={queryType}
          onChange={(e) => setQueryType(e.target.value as QueryType)}
          aria-label={`Query type for ${toolName}`}
          className="input-field"
        >
          <option value="match">Match</option>
          <option value="term">Term (exact)</option>
          <option value="range">Range</option>
          <option value="bool">Bool (compound)</option>
          <option value="wildcard">Wildcard</option>
          <option value="multi_match">Multi Match</option>
          <option value="exists">Exists</option>
        </select>
      </InputArea>

      {queryType !== 'bool' && (
        <InputArea>
          <label htmlFor={`${toolId}-field`} className="block text-sm font-medium text-gray-700 mb-1">
            Field Name
          </label>
          <input
            id={`${toolId}-field`}
            type="text"
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="e.g. title, status, age"
            aria-label={`Field name for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      )}

      {(queryType === 'match' || queryType === 'term' || queryType === 'wildcard' || queryType === 'multi_match') && (
        <InputArea>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
            {queryType === 'wildcard' ? 'Pattern (use * and ?)' : 'Value'}
          </label>
          <input
            id={`${toolId}-value`}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={queryType === 'wildcard' ? 'e.g. test*' : 'e.g. search term'}
            aria-label={`Value for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      )}

      {queryType === 'multi_match' && (
        <InputArea>
          <label htmlFor={`${toolId}-fields`} className="block text-sm font-medium text-gray-700 mb-1">
            Fields (comma-separated)
          </label>
          <input
            id={`${toolId}-fields`}
            type="text"
            value={fields}
            onChange={(e) => setFields(e.target.value)}
            placeholder="e.g. title, description, content"
            aria-label={`Fields for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      )}

      {queryType === 'range' && (
        <div className="grid grid-cols-2 gap-3">
          <InputArea>
            <label htmlFor={`${toolId}-gte`} className="block text-sm font-medium text-gray-700 mb-1">
              Greater than or equal (gte)
            </label>
            <input
              id={`${toolId}-gte`}
              type="text"
              value={rangeGte}
              onChange={(e) => setRangeGte(e.target.value)}
              placeholder="e.g. 10"
              aria-label={`Range gte for ${toolName}`}
              className="input-field"
            />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-lte`} className="block text-sm font-medium text-gray-700 mb-1">
              Less than or equal (lte)
            </label>
            <input
              id={`${toolId}-lte`}
              type="text"
              value={rangeLte}
              onChange={(e) => setRangeLte(e.target.value)}
              placeholder="e.g. 100"
              aria-label={`Range lte for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        </div>
      )}

      {queryType === 'bool' && (
        <div className="space-y-3">
          <InputArea>
            <label htmlFor={`${toolId}-must`} className="block text-sm font-medium text-gray-700 mb-1">
              Must (field:value, comma-separated)
            </label>
            <input
              id={`${toolId}-must`}
              type="text"
              value={boolMust}
              onChange={(e) => setBoolMust(e.target.value)}
              placeholder="e.g. status:active, type:post"
              aria-label={`Bool must for ${toolName}`}
              className="input-field"
            />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-should`} className="block text-sm font-medium text-gray-700 mb-1">
              Should (field:value, comma-separated)
            </label>
            <input
              id={`${toolId}-should`}
              type="text"
              value={boolShould}
              onChange={(e) => setBoolShould(e.target.value)}
              placeholder="e.g. tag:featured, tag:popular"
              aria-label={`Bool should for ${toolName}`}
              className="input-field"
            />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-mustnot`} className="block text-sm font-medium text-gray-700 mb-1">
              Must Not (field:value, comma-separated)
            </label>
            <input
              id={`${toolId}-mustnot`}
              type="text"
              value={boolMustNot}
              onChange={(e) => setBoolMustNot(e.target.value)}
              placeholder="e.g. status:deleted"
              aria-label={`Bool must not for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        </div>
      )}

      <InputArea>
        <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
          Result Size
        </label>
        <input
          id={`${toolId}-size`}
          type="number"
          min="1"
          max="10000"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          aria-label={`Result size for ${toolName}`}
          className="input-field w-32"
        />
      </InputArea>

      <button onClick={handleBuild} aria-label="Build Elasticsearch query" className="btn-primary">
        Build Query
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Query</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
