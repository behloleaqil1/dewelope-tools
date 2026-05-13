'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * InsomniaCollectionGenerator - Generate Insomnia REST client collection JSON.
 * Produces a valid Insomnia v4 export format from endpoint definitions.
 */
export default function InsomniaCollectionGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [collectionName, setCollectionName] = useState('My API');
  const [baseUrl, setBaseUrl] = useState('https://api.example.com');
  const [endpoints, setEndpoints] = useState('GET /users - List all users\nPOST /users - Create a new user\nGET /users/:id - Get user by ID\nPUT /users/:id - Update user\nDELETE /users/:id - Delete user');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!endpoints.trim()) {
      setOutput('Please enter at least one endpoint definition.');
      return;
    }

    const lines = endpoints.trim().split('\n').filter(l => l.trim());
    const resources = [];
    const workspaceId = 'wrk_' + Math.random().toString(36).substring(2, 15);
    const envId = 'env_' + Math.random().toString(36).substring(2, 15);

    resources.push({
      _id: workspaceId,
      _type: 'workspace',
      name: collectionName,
      description: `Auto-generated Insomnia collection for ${collectionName}`,
      scope: 'collection',
    });

    resources.push({
      _id: envId,
      _type: 'environment',
      parentId: workspaceId,
      name: 'Base Environment',
      data: { base_url: baseUrl },
    });

    for (const line of lines) {
      const match = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s*-?\s*(.*)?$/i);
      if (!match) continue;

      const method = match[1].toUpperCase();
      const path = match[2];
      const name = match[3] || `${method} ${path}`;
      const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
      const reqId = 'req_' + Math.random().toString(36).substring(2, 15);

      const request: Record<string, unknown> = {
        _id: reqId,
        _type: 'request',
        parentId: workspaceId,
        name,
        method,
        url: `{{ _.base_url }}${path}`,
        headers: hasBody ? [{ name: 'Content-Type', value: 'application/json' }] : [],
        body: hasBody ? { mimeType: 'application/json', text: '{}' } : {},
        parameters: [],
        authentication: {},
      };

      resources.push(request);
    }

    const collection = {
      _type: 'export',
      __export_format: 4,
      __export_date: new Date().toISOString(),
      __export_source: 'dewelope-tools',
      resources,
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
          <button onClick={generate} className="btn-primary" aria-label="Generate Insomnia Collection">
            Generate Insomnia Collection
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Insomnia Collection JSON</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
