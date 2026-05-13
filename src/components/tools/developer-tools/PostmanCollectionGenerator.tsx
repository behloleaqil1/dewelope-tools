'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PostmanCollectionGenerator - Generate Postman collection JSON from API endpoints.
 * Produces a valid Postman Collection v2.1 format JSON.
 */
export default function PostmanCollectionGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [collectionName, setCollectionName] = useState('My API Collection');
  const [baseUrl, setBaseUrl] = useState('https://api.example.com');
  const [endpoints, setEndpoints] = useState('GET /users - List all users\nPOST /users - Create a new user\nGET /users/:id - Get user by ID\nPUT /users/:id - Update user\nDELETE /users/:id - Delete user');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!endpoints.trim()) {
      setOutput('Please enter at least one endpoint definition.');
      return;
    }

    const lines = endpoints.trim().split('\n').filter(l => l.trim());
    const items = [];

    for (const line of lines) {
      const match = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s*-?\s*(.*)?$/i);
      if (!match) continue;

      const method = match[1].toUpperCase();
      const path = match[2];
      const name = match[3] || `${method} ${path}`;

      const pathSegments = path.split('/').filter(s => s);
      const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

      const item: Record<string, unknown> = {
        name,
        request: {
          method,
          header: hasBody ? [{ key: 'Content-Type', value: 'application/json' }] : [],
          url: {
            raw: `${baseUrl}${path}`,
            protocol: baseUrl.startsWith('https') ? 'https' : 'http',
            host: [baseUrl.replace(/^https?:\/\//, '')],
            path: pathSegments,
          },
          ...(hasBody && {
            body: {
              mode: 'raw',
              raw: JSON.stringify({}, null, 2),
              options: { raw: { language: 'json' } },
            },
          }),
        },
        response: [],
      };

      items.push(item);
    }

    const collection = {
      info: {
        name: collectionName,
        description: `Auto-generated Postman collection for ${collectionName}`,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: items,
      variable: [
        { key: 'baseUrl', value: baseUrl, type: 'string' },
      ],
    };

    setOutput(JSON.stringify(collection, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
              <input id={`${toolId}-name`} type="text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} className="input-field" aria-label={`Collection name for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
              <input id={`${toolId}-base`} type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className="input-field" aria-label="Base URL" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-endpoints`} className="block text-sm font-medium text-gray-700 mb-1">
              Endpoint Definitions (METHOD /path - description)
            </label>
            <textarea
              id={`${toolId}-endpoints`}
              value={endpoints}
              onChange={(e) => setEndpoints(e.target.value)}
              placeholder="GET /users - List all users&#10;POST /users - Create user&#10;GET /users/:id - Get user by ID"
              aria-label="Endpoint definitions"
              className="input-field h-40 resize-y font-mono"
            />
          </div>
          <button onClick={generate} className="btn-primary" aria-label="Generate Postman Collection">
            Generate Postman Collection
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Postman Collection JSON</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
