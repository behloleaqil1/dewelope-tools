'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HttpStatusCodes - Quick reference for HTTP status codes with search and filtering.
 */
export default function HttpStatusCodes({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const STATUS_CODES: { code: number; name: string; description: string; category: string }[] = [
    { code: 100, name: 'Continue', description: 'Server received request headers, client should proceed to send body', category: '1xx' },
    { code: 101, name: 'Switching Protocols', description: 'Server is switching protocols as requested by client', category: '1xx' },
    { code: 200, name: 'OK', description: 'Request succeeded. Standard response for successful HTTP requests', category: '2xx' },
    { code: 201, name: 'Created', description: 'Request fulfilled and new resource created', category: '2xx' },
    { code: 202, name: 'Accepted', description: 'Request accepted for processing but not yet completed', category: '2xx' },
    { code: 204, name: 'No Content', description: 'Request succeeded but no content to return', category: '2xx' },
    { code: 206, name: 'Partial Content', description: 'Server delivering only part of the resource due to range header', category: '2xx' },
    { code: 301, name: 'Moved Permanently', description: 'Resource has been permanently moved to a new URL', category: '3xx' },
    { code: 302, name: 'Found', description: 'Resource temporarily located at a different URL', category: '3xx' },
    { code: 304, name: 'Not Modified', description: 'Resource has not been modified since last request (caching)', category: '3xx' },
    { code: 307, name: 'Temporary Redirect', description: 'Request should be repeated with another URI, same method', category: '3xx' },
    { code: 308, name: 'Permanent Redirect', description: 'Resource permanently moved, same method must be used', category: '3xx' },
    { code: 400, name: 'Bad Request', description: 'Server cannot process request due to client error (malformed syntax)', category: '4xx' },
    { code: 401, name: 'Unauthorized', description: 'Authentication required. Client must authenticate itself', category: '4xx' },
    { code: 403, name: 'Forbidden', description: 'Server understood request but refuses to authorize it', category: '4xx' },
    { code: 404, name: 'Not Found', description: 'Server cannot find the requested resource', category: '4xx' },
    { code: 405, name: 'Method Not Allowed', description: 'Request method is not supported for the target resource', category: '4xx' },
    { code: 408, name: 'Request Timeout', description: 'Server timed out waiting for the request', category: '4xx' },
    { code: 409, name: 'Conflict', description: 'Request conflicts with current state of the server', category: '4xx' },
    { code: 410, name: 'Gone', description: 'Resource is no longer available and will not be available again', category: '4xx' },
    { code: 413, name: 'Payload Too Large', description: 'Request entity is larger than server is willing to process', category: '4xx' },
    { code: 415, name: 'Unsupported Media Type', description: 'Media format of requested data is not supported by server', category: '4xx' },
    { code: 422, name: 'Unprocessable Entity', description: 'Request well-formed but unable to be followed due to semantic errors', category: '4xx' },
    { code: 429, name: 'Too Many Requests', description: 'User has sent too many requests in a given time (rate limiting)', category: '4xx' },
    { code: 500, name: 'Internal Server Error', description: 'Generic server error. Server encountered an unexpected condition', category: '5xx' },
    { code: 501, name: 'Not Implemented', description: 'Server does not support the functionality required to fulfill request', category: '5xx' },
    { code: 502, name: 'Bad Gateway', description: 'Server acting as gateway received invalid response from upstream', category: '5xx' },
    { code: 503, name: 'Service Unavailable', description: 'Server is not ready to handle request (overloaded or maintenance)', category: '5xx' },
    { code: 504, name: 'Gateway Timeout', description: 'Server acting as gateway did not get response in time', category: '5xx' },
  ];

  const filtered = STATUS_CODES.filter((s) => {
    const matchesFilter = filter === 'all' || s.category === filter;
    const matchesSearch = !search || s.code.toString().includes(search) || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categoryColors: Record<string, string> = {
    '1xx': 'bg-blue-100 text-blue-800',
    '2xx': 'bg-green-100 text-green-800',
    '3xx': 'bg-yellow-100 text-yellow-800',
    '4xx': 'bg-red-100 text-red-800',
    '5xx': 'bg-purple-100 text-purple-800',
  };

  const copyText = filtered.map((s) => `${s.code} ${s.name}: ${s.description}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
          Search HTTP status codes for {toolName}
        </label>
        <input
          id={`${toolId}-search`}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code number or name..."
          aria-label="Search HTTP status codes"
          className="input-field"
        />
        <div className="flex gap-2 mt-3 flex-wrap">
          {['all', '1xx', '2xx', '3xx', '4xx', '5xx'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={`Filter by ${cat} status codes`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </InputArea>

      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((s) => (
            <div key={s.code} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className={`px-2 py-1 rounded text-xs font-bold ${categoryColors[s.category]}`}>
                {s.code}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800">{s.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No status codes match your search</p>
          )}
        </div>
        {filtered.length > 0 && (
          <div className="mt-3">
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
