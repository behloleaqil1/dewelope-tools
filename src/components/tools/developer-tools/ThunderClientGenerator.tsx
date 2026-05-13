'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThunderClientGenerator - Generate Thunder Client collection JSON for VS Code.
 */
export default function ThunderClientGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [collectionName, setCollectionName] = useState('My API Collection');
  const [baseUrl, setBaseUrl] = useState('https://api.example.com');
  const [endpoints, setEndpoints] = useState('GET /users - List all users\nPOST /users - Create a user\nGET /users/:id - Get user by ID\nPUT /users/:id - Update user\nDELETE /users/:id - Delete user');
  const [output, setOutput] = useState('');

  const generateId = () => {
    return 'tc_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generate = () => {
    const lines = endpoints.split('\n').filter(l => l.trim());
    const colId = generateId();
    const requests = lines.map((line) => {
      const match = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s*-?\s*(.*)?$/i);
      if (!match) return null;
      const [, method, path, name] = match;
      return {
        _id: generateId(),
        colId,
        containerId: '',
        name: name?.trim() || `${method.toUpperCase()} ${path}`,
        url: `{{baseUrl}}${path}`,
        method: method.toUpperCase(),
        sortNum: 10000,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        headers: [{ name: 'Content-Type', value: 'application/json' }],
        params: [],
        body: { type: 'json', raw: method.toUpperCase() === 'GET' ? '' : '{}' },
        auth: { type: 'none' },
        tests: [],
      };
    }).filter(Boolean);

    const collection = {
      _id: colId,
      colName: collectionName,
      created: new Date().toISOString(),
      sortNum: 10000,
    };

    const env = {
      _id: generateId(),
      name: 'Default Environment',
      default: true,
      data: [{ name: 'baseUrl', value: baseUrl }],
    };

    const result = {
      clientName: 'Thunder Client',
      collectionName: collectionName,
      collection,
      requests,
      environment: env,
    };

    setOutput(JSON.stringify(result, null, 2));
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
          Generate Thunder Client Collection
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Thunder Client Collection JSON</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
