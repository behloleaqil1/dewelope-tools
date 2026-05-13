'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * VarnishVclGenerator - Generate Varnish VCL cache configuration files.
 * Produces VCL 4.x configuration with backend, ACL, and caching rules.
 */
export default function VarnishVclGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [backend, setBackend] = useState('127.0.0.1');
  const [port, setPort] = useState('8080');
  const [ttl, setTtl] = useState('3600');
  const [graceTtl, setGraceTtl] = useState('86400');
  const [stripCookies, setStripCookies] = useState(true);
  const [stripQueryParams, setStripQueryParams] = useState(false);
  const [healthCheck, setHealthCheck] = useState(true);
  const [staticExtensions, setStaticExtensions] = useState('js,css,png,jpg,jpeg,gif,svg,ico,woff,woff2');
  const [output, setOutput] = useState('');

  const generate = () => {
    const exts = staticExtensions.split(',').map(e => e.trim()).filter(Boolean);
    const extRegex = exts.join('|');

    let vcl = `vcl 4.1;\n\n`;
    vcl += `# Backend definition\nbackend default {\n  .host = "${backend}";\n  .port = "${port}";\n`;
    if (healthCheck) {
      vcl += `  .probe = {\n    .url = "/health";\n    .timeout = 2s;\n    .interval = 5s;\n    .window = 5;\n    .threshold = 3;\n  }\n`;
    }
    vcl += `}\n\n`;

    vcl += `# ACL for purge requests\nacl purge {\n  "localhost";\n  "127.0.0.1"/32;\n  "::1"/128;\n}\n\n`;

    vcl += `sub vcl_recv {\n`;
    vcl += `  # Allow purge from ACL\n  if (req.method == "PURGE") {\n    if (!client.ip ~ purge) {\n      return (synth(405, "Not allowed."));\n    }\n    return (purge);\n  }\n\n`;

    if (stripQueryParams) {
      vcl += `  # Strip query parameters for static files\n  if (req.url ~ "\\.(${extRegex})(\\?.*)?$") {\n    set req.url = regsub(req.url, "\\?.*$", "");\n  }\n\n`;
    }

    if (stripCookies) {
      vcl += `  # Remove cookies for static files\n  if (req.url ~ "\\.(${extRegex})$") {\n    unset req.http.Cookie;\n    return (hash);\n  }\n\n`;
    }

    vcl += `  # Pass non-GET/HEAD requests\n  if (req.method != "GET" && req.method != "HEAD") {\n    return (pass);\n  }\n\n`;
    vcl += `  # Skip cache for authenticated requests\n  if (req.http.Authorization) {\n    return (pass);\n  }\n\n`;
    vcl += `  return (hash);\n}\n\n`;

    vcl += `sub vcl_backend_response {\n`;
    vcl += `  # Set default TTL\n  set beresp.ttl = ${ttl}s;\n`;
    vcl += `  set beresp.grace = ${graceTtl}s;\n\n`;
    vcl += `  # Cache static files longer\n  if (bereq.url ~ "\\.(${extRegex})$") {\n    set beresp.ttl = ${parseInt(ttl) * 7}s;\n    unset beresp.http.Set-Cookie;\n  }\n\n`;
    vcl += `  # Do not cache 5xx errors\n  if (beresp.status >= 500) {\n    set beresp.uncacheable = true;\n    set beresp.ttl = 30s;\n  }\n\n`;
    vcl += `  return (deliver);\n}\n\n`;

    vcl += `sub vcl_deliver {\n`;
    vcl += `  # Add debug headers\n  if (obj.hits > 0) {\n    set resp.http.X-Cache = "HIT";\n    set resp.http.X-Cache-Hits = obj.hits;\n  } else {\n    set resp.http.X-Cache = "MISS";\n  }\n\n`;
    vcl += `  # Remove internal headers\n  unset resp.http.X-Varnish;\n  unset resp.http.Via;\n\n`;
    vcl += `  return (deliver);\n}\n`;

    setOutput(vcl);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-backend`} className="block text-sm font-medium text-gray-700 mb-1">Backend Host</label>
            <input id={`${toolId}-backend`} type="text" value={backend} onChange={(e) => setBackend(e.target.value)} className="input-field" aria-label={`Backend host for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Backend Port</label>
            <input id={`${toolId}-port`} type="text" value={port} onChange={(e) => setPort(e.target.value)} className="input-field" aria-label="Backend port" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ttl`} className="block text-sm font-medium text-gray-700 mb-1">Default TTL (seconds)</label>
            <input id={`${toolId}-ttl`} type="number" value={ttl} onChange={(e) => setTtl(e.target.value)} className="input-field" aria-label="Default TTL in seconds" />
          </div>
          <div>
            <label htmlFor={`${toolId}-grace`} className="block text-sm font-medium text-gray-700 mb-1">Grace TTL (seconds)</label>
            <input id={`${toolId}-grace`} type="number" value={graceTtl} onChange={(e) => setGraceTtl(e.target.value)} className="input-field" aria-label="Grace TTL in seconds" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-exts`} className="block text-sm font-medium text-gray-700 mb-1">Static File Extensions</label>
            <input id={`${toolId}-exts`} type="text" value={staticExtensions} onChange={(e) => setStaticExtensions(e.target.value)} className="input-field" aria-label="Static file extensions" />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={stripCookies} onChange={(e) => setStripCookies(e.target.checked)} />
              Strip cookies for static files
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={stripQueryParams} onChange={(e) => setStripQueryParams(e.target.checked)} />
              Strip query params for static files
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={healthCheck} onChange={(e) => setHealthCheck(e.target.checked)} />
              Enable health check probe
            </label>
          </div>
        </div>
        <button onClick={generate} className="mt-4 btn-primary">Generate VCL Configuration</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated VCL</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-96">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
