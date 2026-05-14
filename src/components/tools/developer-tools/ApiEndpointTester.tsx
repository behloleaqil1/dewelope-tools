'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ApiEndpointTester - Simulate API endpoint testing with URL, method, and simulated responses.
 */
export default function ApiEndpointTester({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [statusCode, setStatusCode] = useState('200');
  const [result, setResult] = useState('');

  const simulateResponse = () => {
    if (!url.trim()) return;
    const code = parseInt(statusCode);
    const timestamp = new Date().toISOString();
    const responseTime = Math.floor(Math.random() * 500) + 50;

    const statusMessages: Record<number, string> = {
      200: 'OK', 201: 'Created', 204: 'No Content',
      301: 'Moved Permanently', 304: 'Not Modified',
      400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
      404: 'Not Found', 405: 'Method Not Allowed', 429: 'Too Many Requests',
      500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable',
    };

    const sampleBodies: Record<string, unknown> = {
      GET: { data: [{ id: 1, name: 'Sample Item' }], total: 1 },
      POST: { id: 2, created: true, message: 'Resource created' },
      PUT: { id: 1, updated: true, message: 'Resource updated' },
      DELETE: { deleted: true, message: 'Resource deleted' },
    };

    const response = {
      request: { method, url: url.trim(), timestamp },
      response: {
        status: code,
        statusText: statusMessages[code] || 'Unknown',
        headers: {
          'content-type': 'application/json',
          'x-response-time': `${responseTime}ms`,
          'x-request-id': crypto.randomUUID?.() || Math.random().toString(36).slice(2),
        },
        body: code >= 400 ? { error: statusMessages[code], message: `${method} ${url.trim()} failed` } : sampleBodies[method] || {},
      },
      timing: { total: `${responseTime}ms` },
    };

    setResult(JSON.stringify(response, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-url`} className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
        <input id={`${toolId}-url`} type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/users" aria-label={`URL for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">Method</label>
          <select id={`${toolId}-method`} value={method} onChange={(e) => setMethod(e.target.value)} aria-label={`Method for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-status`} className="block text-sm font-medium text-gray-700 mb-1">Simulate Status</label>
          <select id={`${toolId}-status`} value={statusCode} onChange={(e) => setStatusCode(e.target.value)} aria-label={`Status code for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['200', '201', '204', '301', '400', '401', '403', '404', '500', '502', '503'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <button onClick={simulateResponse} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" aria-label="Send request">Send Request</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg max-h-96 overflow-y-auto">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
