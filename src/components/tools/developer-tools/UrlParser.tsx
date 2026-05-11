'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ParsedUrl {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  queryParams: { key: string; value: string }[];
}

/**
 * UrlParser - Parses URLs into protocol, host, port, path, query params, and fragment.
 */
export default function UrlParser({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ParsedUrl | null>(null);
  const [error, setError] = useState<string | undefined>();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setResult(null);
      setError(undefined);
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        const url = new URL(input.trim());
        const queryParams: { key: string; value: string }[] = [];
        url.searchParams.forEach((value, key) => {
          queryParams.push({ key, value });
        });

        setResult({
          protocol: url.protocol,
          host: url.host,
          hostname: url.hostname,
          port: url.port || '(default)',
          pathname: url.pathname,
          search: url.search,
          hash: url.hash,
          origin: url.origin,
          queryParams,
        });
        setError(undefined);
      } catch {
        setResult(null);
        setError('Invalid URL. Please enter a valid URL (e.g., https://example.com/path?key=value#section)');
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  const copyText = result
    ? `Protocol: ${result.protocol}\nHost: ${result.host}\nHostname: ${result.hostname}\nPort: ${result.port}\nPath: ${result.pathname}\nQuery: ${result.search}\nHash: ${result.hash}\nOrigin: ${result.origin}${result.queryParams.length > 0 ? '\n\nQuery Parameters:\n' + result.queryParams.map(p => `  ${p.key} = ${p.value}`).join('\n') : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter URL to parse
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com:8080/path/page?key=value&foo=bar#section"
          aria-label={`URL input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Protocol', value: result.protocol },
                { label: 'Host', value: result.host },
                { label: 'Hostname', value: result.hostname },
                { label: 'Port', value: result.port },
                { label: 'Path', value: result.pathname },
                { label: 'Query String', value: result.search || '(none)' },
                { label: 'Fragment', value: result.hash || '(none)' },
                { label: 'Origin', value: result.origin },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-sm font-mono text-gray-800 break-all">{item.value}</div>
                </div>
              ))}
            </div>

            {result.queryParams.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Query Parameters ({result.queryParams.length})</div>
                <div className="space-y-1">
                  {result.queryParams.map((param, idx) => (
                    <div key={idx} className="flex gap-2 text-sm font-mono">
                      <span className="text-blue-600 font-medium">{param.key}</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-gray-800 break-all">{param.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
