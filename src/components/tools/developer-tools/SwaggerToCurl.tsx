'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SwaggerToCurl - Convert Swagger/OpenAPI endpoint definitions to cURL commands.
 * Supports path parameters, query parameters, headers, and request bodies.
 */
export default function SwaggerToCurl({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseUrl, setBaseUrl] = useState('');
  const [path, setPath] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [queryParams, setQueryParams] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleGenerate() {
    setError('');
    setOutput('');

    if (!baseUrl.trim()) {
      setError('Please enter a base URL');
      return;
    }
    if (!path.trim()) {
      setError('Please enter an endpoint path');
      return;
    }

    const url = baseUrl.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
    let queryString = '';
    if (queryParams.trim()) {
      const params = queryParams.split('\n').filter(l => l.trim()).map(l => {
        const [key, ...rest] = l.split('=');
        return `${encodeURIComponent(key.trim())}=${encodeURIComponent(rest.join('=').trim())}`;
      });
      if (params.length > 0) queryString = '?' + params.join('&');
    }

    const parts: string[] = [`curl -X ${method}`];
    parts.push(`  '${url}${queryString}'`);

    if (headers.trim()) {
      const headerLines = headers.split('\n').filter(l => l.trim());
      for (const h of headerLines) {
        parts.push(`  -H '${h.trim()}'`);
      }
    }

    if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const parsed = JSON.parse(body);
        parts.push(`  -d '${JSON.stringify(parsed)}'`);
      } catch {
        parts.push(`  -d '${body.trim()}'`);
      }
    }

    setOutput(parts.join(' \\\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
            Base URL
          </label>
          <input
            id={`${toolId}-base`}
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com/v1"
            aria-label={`Base URL for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">
            HTTP Method
          </label>
          <select
            id={`${toolId}-method`}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            aria-label={`HTTP method for ${toolName}`}
            className="input-field"
          >
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </InputArea>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">
          Endpoint Path
        </label>
        <input
          id={`${toolId}-path`}
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/users/{id}/posts"
          aria-label={`Endpoint path for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-headers`} className="block text-sm font-medium text-gray-700 mb-1">
          Headers (one per line: Key: Value)
        </label>
        <textarea
          id={`${toolId}-headers`}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder={"Content-Type: application/json\nAuthorization: Bearer token"}
          aria-label={`Headers for ${toolName}`}
          className="input-field h-20 resize-y font-mono"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-query`} className="block text-sm font-medium text-gray-700 mb-1">
          Query Parameters (one per line: key=value)
        </label>
        <textarea
          id={`${toolId}-query`}
          value={queryParams}
          onChange={(e) => setQueryParams(e.target.value)}
          placeholder={"page=1\nlimit=20"}
          aria-label={`Query parameters for ${toolName}`}
          className="input-field h-20 resize-y font-mono"
        />
      </InputArea>

      {['POST', 'PUT', 'PATCH'].includes(method) && (
        <InputArea>
          <label htmlFor={`${toolId}-body`} className="block text-sm font-medium text-gray-700 mb-1">
            Request Body (JSON)
          </label>
          <textarea
            id={`${toolId}-body`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"name": "John", "email": "john@example.com"}'
            aria-label={`Request body for ${toolName}`}
            className="input-field h-28 resize-y font-mono"
          />
        </InputArea>
      )}

      <button onClick={handleGenerate} aria-label="Generate cURL command" className="btn-primary">
        Generate cURL Command
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">cURL Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
