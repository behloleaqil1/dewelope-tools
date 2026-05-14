'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const STATUS_CODES: { code: number; phrase: string; description: string; category: string }[] = [
  { code: 100, phrase: 'Continue', description: 'Server received request headers, client should proceed', category: '1xx Informational' },
  { code: 101, phrase: 'Switching Protocols', description: 'Server is switching protocols as requested', category: '1xx Informational' },
  { code: 200, phrase: 'OK', description: 'Request succeeded', category: '2xx Success' },
  { code: 201, phrase: 'Created', description: 'Request fulfilled, new resource created', category: '2xx Success' },
  { code: 204, phrase: 'No Content', description: 'Request succeeded, no content to return', category: '2xx Success' },
  { code: 206, phrase: 'Partial Content', description: 'Partial resource returned (range request)', category: '2xx Success' },
  { code: 301, phrase: 'Moved Permanently', description: 'Resource permanently moved to new URL', category: '3xx Redirection' },
  { code: 302, phrase: 'Found', description: 'Resource temporarily at different URL', category: '3xx Redirection' },
  { code: 304, phrase: 'Not Modified', description: 'Resource not modified since last request', category: '3xx Redirection' },
  { code: 307, phrase: 'Temporary Redirect', description: 'Temporary redirect preserving method', category: '3xx Redirection' },
  { code: 308, phrase: 'Permanent Redirect', description: 'Permanent redirect preserving method', category: '3xx Redirection' },
  { code: 400, phrase: 'Bad Request', description: 'Server cannot process due to client error', category: '4xx Client Error' },
  { code: 401, phrase: 'Unauthorized', description: 'Authentication required', category: '4xx Client Error' },
  { code: 403, phrase: 'Forbidden', description: 'Server refuses to authorize the request', category: '4xx Client Error' },
  { code: 404, phrase: 'Not Found', description: 'Requested resource not found', category: '4xx Client Error' },
  { code: 405, phrase: 'Method Not Allowed', description: 'HTTP method not supported for this resource', category: '4xx Client Error' },
  { code: 409, phrase: 'Conflict', description: 'Request conflicts with current server state', category: '4xx Client Error' },
  { code: 413, phrase: 'Payload Too Large', description: 'Request entity exceeds server limits', category: '4xx Client Error' },
  { code: 422, phrase: 'Unprocessable Entity', description: 'Request well-formed but semantically invalid', category: '4xx Client Error' },
  { code: 429, phrase: 'Too Many Requests', description: 'Rate limit exceeded', category: '4xx Client Error' },
  { code: 500, phrase: 'Internal Server Error', description: 'Unexpected server error', category: '5xx Server Error' },
  { code: 502, phrase: 'Bad Gateway', description: 'Invalid response from upstream server', category: '5xx Server Error' },
  { code: 503, phrase: 'Service Unavailable', description: 'Server temporarily unable to handle request', category: '5xx Server Error' },
  { code: 504, phrase: 'Gateway Timeout', description: 'Upstream server did not respond in time', category: '5xx Server Error' },
];

/**
 * HttpStatusCodeReference - Searchable reference of HTTP status codes.
 */
export default function HttpStatusCodeReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');

  const filtered = STATUS_CODES.filter(s =>
    s.code.toString().includes(search) ||
    s.phrase.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const copyText = filtered.map(s => `${s.code} ${s.phrase} - ${s.description}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">Search Status Codes</label>
        <input id={`${toolId}-search`} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code, name, or description..." aria-label={`Search HTTP status codes for ${toolName}`} className="input-field" />
      </div>
      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map(s => (
            <div key={s.code} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-3">
              <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${s.code < 200 ? 'bg-blue-100 text-blue-700' : s.code < 300 ? 'bg-green-100 text-green-700' : s.code < 400 ? 'bg-yellow-100 text-yellow-700' : s.code < 500 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{s.code}</span>
              <div>
                <div className="text-sm font-semibold text-gray-800">{s.phrase}</div>
                <div className="text-xs text-gray-600">{s.description}</div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length > 0 && <CopyToClipboard text={copyText} />}
      </OutputArea>
    </div>
  );
}
