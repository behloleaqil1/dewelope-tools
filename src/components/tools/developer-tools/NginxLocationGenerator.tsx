'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NginxLocationGenerator - Generate nginx location blocks with proxy/static/redirect configurations.
 */
export default function NginxLocationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [locationType, setLocationType] = useState<'proxy' | 'static' | 'redirect'>('proxy');
  const [path, setPath] = useState('/api');
  const [proxyPass, setProxyPass] = useState('http://localhost:3000');
  const [staticRoot, setStaticRoot] = useState('/var/www/html');
  const [redirectUrl, setRedirectUrl] = useState('https://example.com');
  const [redirectCode, setRedirectCode] = useState('301');
  const [enableWebsocket, setEnableWebsocket] = useState(false);
  const [enableCors, setEnableCors] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setOutput('');

    if (!path.trim()) {
      setError('Please enter a location path.');
      return;
    }

    let config = `location ${path.trim()} {\n`;

    if (locationType === 'proxy') {
      if (!proxyPass.trim()) {
        setError('Please enter a proxy pass URL.');
        return;
      }
      config += `    proxy_pass ${proxyPass.trim()};\n`;
      config += `    proxy_set_header Host $host;\n`;
      config += `    proxy_set_header X-Real-IP $remote_addr;\n`;
      config += `    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n`;
      config += `    proxy_set_header X-Forwarded-Proto $scheme;\n`;

      if (enableWebsocket) {
        config += `\n    # WebSocket support\n`;
        config += `    proxy_http_version 1.1;\n`;
        config += `    proxy_set_header Upgrade $http_upgrade;\n`;
        config += `    proxy_set_header Connection "upgrade";\n`;
      }
    } else if (locationType === 'static') {
      if (!staticRoot.trim()) {
        setError('Please enter a root directory.');
        return;
      }
      config += `    root ${staticRoot.trim()};\n`;
      config += `    index index.html index.htm;\n`;
      config += `    try_files $uri $uri/ =404;\n`;
      config += `\n    # Cache static assets\n`;
      config += `    expires 30d;\n`;
      config += `    add_header Cache-Control "public, immutable";\n`;
    } else if (locationType === 'redirect') {
      if (!redirectUrl.trim()) {
        setError('Please enter a redirect URL.');
        return;
      }
      config += `    return ${redirectCode} ${redirectUrl.trim()};\n`;
    }

    if (enableCors) {
      config += `\n    # CORS headers\n`;
      config += `    add_header Access-Control-Allow-Origin *;\n`;
      config += `    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";\n`;
      config += `    add_header Access-Control-Allow-Headers "Authorization, Content-Type";\n`;
    }

    config += `}\n`;
    setOutput(config);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">Location Path</label>
              <input id={`${toolId}-path`} type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/api" aria-label={`Location path for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select id={`${toolId}-type`} value={locationType} onChange={(e) => setLocationType(e.target.value as 'proxy' | 'static' | 'redirect')} aria-label="Location type" className="input-field">
                <option value="proxy">Reverse Proxy</option>
                <option value="static">Static Files</option>
                <option value="redirect">Redirect</option>
              </select>
            </div>
          </div>

          {locationType === 'proxy' && (
            <div>
              <label htmlFor={`${toolId}-proxy`} className="block text-sm font-medium text-gray-700 mb-1">Proxy Pass URL</label>
              <input id={`${toolId}-proxy`} type="text" value={proxyPass} onChange={(e) => setProxyPass(e.target.value)} placeholder="http://localhost:3000" aria-label="Proxy pass URL" className="input-field" />
            </div>
          )}

          {locationType === 'static' && (
            <div>
              <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">Root Directory</label>
              <input id={`${toolId}-root`} type="text" value={staticRoot} onChange={(e) => setStaticRoot(e.target.value)} placeholder="/var/www/html" aria-label="Static root directory" className="input-field" />
            </div>
          )}

          {locationType === 'redirect' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-redirect-url`} className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
                <input id={`${toolId}-redirect-url`} type="text" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} placeholder="https://example.com" aria-label="Redirect URL" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-redirect-code`} className="block text-sm font-medium text-gray-700 mb-1">Status Code</label>
                <select id={`${toolId}-redirect-code`} value={redirectCode} onChange={(e) => setRedirectCode(e.target.value)} aria-label="Redirect status code" className="input-field">
                  <option value="301">301 (Permanent)</option>
                  <option value="302">302 (Temporary)</option>
                  <option value="307">307 (Temporary, preserve method)</option>
                  <option value="308">308 (Permanent, preserve method)</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {locationType === 'proxy' && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={enableWebsocket} onChange={(e) => setEnableWebsocket(e.target.checked)} className="rounded" />
                WebSocket support
              </label>
            )}
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableCors} onChange={(e) => setEnableCors(e.target.checked)} className="rounded" />
              CORS headers
            </label>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate nginx location block">Generate Location Block</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nginx Location Block</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
