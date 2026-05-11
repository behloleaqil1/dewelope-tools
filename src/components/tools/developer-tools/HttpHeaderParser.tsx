'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HttpHeaderParser - Parse and explain HTTP response headers.
 * Provides descriptions for common HTTP headers and their values.
 */

const HEADER_DESCRIPTIONS: Record<string, string> = {
  'content-type': 'Indicates the media type of the resource (e.g., text/html, application/json).',
  'content-length': 'The size of the response body in bytes.',
  'content-encoding': 'The encoding used to compress the response (e.g., gzip, br, deflate).',
  'cache-control': 'Directives for caching mechanisms in both requests and responses.',
  'expires': 'The date/time after which the response is considered stale.',
  'etag': 'A unique identifier for a specific version of a resource for cache validation.',
  'last-modified': 'The date and time the resource was last modified.',
  'set-cookie': 'Sends a cookie from the server to the user agent.',
  'strict-transport-security': 'Tells browsers to only access the site using HTTPS (HSTS).',
  'x-content-type-options': 'Prevents MIME type sniffing. Usually set to "nosniff".',
  'x-frame-options': 'Controls whether the page can be displayed in a frame/iframe.',
  'x-xss-protection': 'Enables cross-site scripting (XSS) filter in older browsers.',
  'content-security-policy': 'Controls resources the browser is allowed to load for the page.',
  'access-control-allow-origin': 'Specifies which origins can access the resource (CORS).',
  'access-control-allow-methods': 'Specifies allowed HTTP methods for CORS requests.',
  'access-control-allow-headers': 'Specifies allowed headers for CORS requests.',
  'server': 'Information about the software used by the origin server.',
  'date': 'The date and time the response was generated.',
  'connection': 'Controls whether the network connection stays open after the transaction.',
  'transfer-encoding': 'The form of encoding used to transfer the body (e.g., chunked).',
  'vary': 'Determines how to match future request headers to decide if a cached response can be used.',
  'location': 'Used in redirects to indicate the URL to redirect to.',
  'www-authenticate': 'Defines the authentication method that should be used to access a resource.',
  'authorization': 'Contains credentials for authenticating the client with the server.',
  'accept': 'Media types the client is willing to receive.',
  'accept-encoding': 'Encoding algorithms the client can understand (e.g., gzip, deflate).',
  'accept-language': 'Natural languages the client prefers.',
  'host': 'The domain name of the server and optionally the port number.',
  'user-agent': 'A string identifying the client software making the request.',
  'referer': 'The URL of the page that linked to the resource being requested.',
  'x-powered-by': 'Indicates the technology supporting the web application (often removed for security).',
  'x-request-id': 'A unique identifier for the request, used for tracing and debugging.',
  'retry-after': 'How long the client should wait before making a follow-up request.',
  'age': 'The time in seconds the object has been in a proxy cache.',
  'pragma': 'Implementation-specific header (legacy, use Cache-Control instead).',
};

export default function HttpHeaderParser({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<{ name: string; value: string; description: string }[]>([]);

  const parseHeaders = () => {
    if (!input.trim()) {
      setParsed([]);
      return;
    }

    const lines = input.split('\n').filter((l) => l.trim());
    const results: { name: string; value: string; description: string }[] = [];

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      const name = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      const description = HEADER_DESCRIPTIONS[name.toLowerCase()] || 'No description available for this header.';
      results.push({ name, value, description });
    }

    setParsed(results);
  };

  const copyText = parsed.map((h) => `${h.name}: ${h.value}\n  → ${h.description}`).join('\n\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Paste HTTP headers (one per line, Name: Value format)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Content-Type: application/json\nCache-Control: max-age=3600\nX-Frame-Options: DENY'}
          aria-label={`HTTP headers input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={parseHeaders} aria-label="Parse HTTP headers" className="btn-primary">
        Parse Headers
      </button>

      <OutputArea hasContent={parsed.length > 0}>
        {parsed.length > 0 && (
          <div className="space-y-3">
            {parsed.map((header, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-mono text-sm font-bold text-blue-700">{header.name}</div>
                <div className="font-mono text-sm text-gray-800 mt-1">{header.value}</div>
                <div className="text-xs text-gray-500 mt-1">{header.description}</div>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
