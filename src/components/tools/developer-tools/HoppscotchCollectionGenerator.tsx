'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HoppscotchCollectionGenerator - Generate Hoppscotch API collection JSON from endpoint definitions.
 */
export default function HoppscotchCollectionGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [collectionName, setCollectionName] = useState('My API Collection');
  const [baseUrl, setBaseUrl] = useState('https://api.example.com');
  const [endpoints, setEndpoints] = useState('GET /users - List all users\nPOST /users - Create a user\nGET /users/:id - Get user by ID\nPUT /users/:id - Update user\nDELETE /users/:id - Delete user');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines = endpoints.split('\n').filter(l => l.trim());
    const requests = lines.map((line, idx) => {
      const match = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s*-?\s*(.*)?$/i);
      if (!match) return null;
      const [, method, path, name] = match;
      return {
        v: '3',
        id: `req_${idx + 1}`,
        name: name?.trim() || `${method.toUpperCase()} ${path}`,
        method: method.toUpperCase(),
        endpoint: `<<baseUrl>>${path}`,
        params: [],
        headers: [{ key: 'Content-Type', value: 'application/json', active: true }],
        body: { contentType: 'application/json', body: method.toUpperCase() === 'GET' ? null : '{}' },
        auth: { authType: 'none', authActive: false },
        preRequestScript: '',
        testScript: '',
      };
    }).filter(Boolean);

    const collection = {
      v: 2,
      name: collectionName,
      folders: [],
      requests,
      auth: { authType: 'none', authActive: false },
      headers: [],
    };

    const env = {
      v: 1,
      name: 'Default',
      variables: [{ key: 'baseUrl', value: baseUrl, secret: false }],
    };

    setOutput(JSON.stringify({ collection, environment: env }, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Collection Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          className="input-field mb-3"
          aria-label={`Collection name for ${toolName}`}
        />
        <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
          Base URL
        </label>
        <input
          id={`${toolId}-base`}
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="input-field mb-3"
          aria-label="Base URL"
        />
        <label htmlFor={`${toolId}-endpoints`} className="block text-sm font-medium text-gray-700 mb-1">
          Endpoints (METHOD /path - description)
        </label>
        <textarea
          id={`${toolId}-endpoints`}
          value={endpoints}
          onChange={(e) => setEndpoints(e.target.value)}
          className="input-field h-40 resize-y font-mono"
          placeholder="GET /users - List users"
          aria-label="API endpoint definitions"
        />
        <button onClick={generate} className="btn-primary mt-3">
          Generate Hoppscotch Collection
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hoppscotch Collection JSON</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
