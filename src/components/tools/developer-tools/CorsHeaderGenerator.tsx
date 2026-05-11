'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CorsHeaderGenerator - Generates CORS response headers from user configuration options.
 */
export default function CorsHeaderGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [allowOrigin, setAllowOrigin] = useState('*');
  const [allowMethods, setAllowMethods] = useState(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
  const [allowHeaders, setAllowHeaders] = useState('Content-Type, Authorization');
  const [exposeHeaders, setExposeHeaders] = useState('');
  const [maxAge, setMaxAge] = useState('86400');
  const [allowCredentials, setAllowCredentials] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

  const toggleMethod = (method: string) => {
    setAllowMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const generate = () => {
    const headers: string[] = [];
    headers.push(`Access-Control-Allow-Origin: ${allowOrigin}`);
    if (allowMethods.length > 0) {
      headers.push(`Access-Control-Allow-Methods: ${allowMethods.join(', ')}`);
    }
    if (allowHeaders.trim()) {
      headers.push(`Access-Control-Allow-Headers: ${allowHeaders.trim()}`);
    }
    if (exposeHeaders.trim()) {
      headers.push(`Access-Control-Expose-Headers: ${exposeHeaders.trim()}`);
    }
    if (maxAge.trim()) {
      headers.push(`Access-Control-Max-Age: ${maxAge.trim()}`);
    }
    if (allowCredentials) {
      headers.push('Access-Control-Allow-Credentials: true');
    }
    setOutput(headers.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-3">Configure CORS headers for {toolName}</label>

        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-origin`} className="block text-xs text-gray-500 mb-1">Allow Origin</label>
            <input
              id={`${toolId}-origin`}
              type="text"
              value={allowOrigin}
              onChange={(e) => setAllowOrigin(e.target.value)}
              placeholder="* or https://example.com"
              aria-label="Allowed origin"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Allow Methods</label>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((method) => (
                <button
                  key={method}
                  onClick={() => toggleMethod(method)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    allowMethods.includes(method)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                  aria-label={`Toggle ${method} method`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor={`${toolId}-headers`} className="block text-xs text-gray-500 mb-1">Allow Headers (comma-separated)</label>
            <input
              id={`${toolId}-headers`}
              type="text"
              value={allowHeaders}
              onChange={(e) => setAllowHeaders(e.target.value)}
              placeholder="Content-Type, Authorization"
              aria-label="Allowed headers"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label htmlFor={`${toolId}-expose`} className="block text-xs text-gray-500 mb-1">Expose Headers (comma-separated, optional)</label>
            <input
              id={`${toolId}-expose`}
              type="text"
              value={exposeHeaders}
              onChange={(e) => setExposeHeaders(e.target.value)}
              placeholder="X-Custom-Header"
              aria-label="Exposed headers"
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-maxage`} className="block text-xs text-gray-500 mb-1">Max Age (seconds)</label>
              <input
                id={`${toolId}-maxage`}
                type="text"
                inputMode="numeric"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                placeholder="86400"
                aria-label="Max age in seconds"
                className="input-field text-sm"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCredentials}
                  onChange={(e) => setAllowCredentials(e.target.checked)}
                  aria-label="Allow credentials"
                  className="rounded border-gray-300"
                />
                <span className="text-xs text-gray-600">Allow Credentials</span>
              </label>
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate CORS headers" className="btn-primary">
        Generate Headers
      </button>

      <OutputArea hasContent={output !== null}>
        {output && (
          <div className="space-y-3">
            <pre className="text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap break-all">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
