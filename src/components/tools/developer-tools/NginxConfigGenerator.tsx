'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NginxConfigGenerator - Generate basic nginx server block configuration.
 */
export default function NginxConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [serverName, setServerName] = useState('');
  const [port, setPort] = useState('80');
  const [root, setRoot] = useState('/var/www/html');
  const [proxyPass, setProxyPass] = useState('');
  const [enableSSL, setEnableSSL] = useState(false);
  const [enableGzip, setEnableGzip] = useState(true);
  const [output, setOutput] = useState('');

  function generate() {
    if (!serverName.trim()) {
      setOutput('');
      return;
    }

    const lines: string[] = [];
    lines.push('server {');
    lines.push(`    listen ${enableSSL ? '443 ssl' : port};`);
    if (enableSSL) {
      lines.push(`    listen [::]:443 ssl;`);
    }
    lines.push(`    server_name ${serverName.trim()};`);
    lines.push('');

    if (enableSSL) {
      lines.push(`    ssl_certificate /etc/letsencrypt/live/${serverName.trim()}/fullchain.pem;`);
      lines.push(`    ssl_certificate_key /etc/letsencrypt/live/${serverName.trim()}/privkey.pem;`);
      lines.push('    ssl_protocols TLSv1.2 TLSv1.3;');
      lines.push('    ssl_ciphers HIGH:!aNULL:!MD5;');
      lines.push('');
    }

    if (enableGzip) {
      lines.push('    gzip on;');
      lines.push('    gzip_types text/plain text/css application/json application/javascript text/xml;');
      lines.push('    gzip_min_length 256;');
      lines.push('');
    }

    if (proxyPass.trim()) {
      lines.push('    location / {');
      lines.push(`        proxy_pass ${proxyPass.trim()};`);
      lines.push('        proxy_http_version 1.1;');
      lines.push('        proxy_set_header Upgrade $http_upgrade;');
      lines.push("        proxy_set_header Connection 'upgrade';");
      lines.push('        proxy_set_header Host $host;');
      lines.push('        proxy_cache_bypass $http_upgrade;');
      lines.push('    }');
    } else {
      lines.push(`    root ${root.trim()};`);
      lines.push('    index index.html index.htm;');
      lines.push('');
      lines.push('    location / {');
      lines.push('        try_files $uri $uri/ =404;');
      lines.push('    }');
    }

    lines.push('}');

    if (enableSSL) {
      lines.push('');
      lines.push('server {');
      lines.push('    listen 80;');
      lines.push(`    server_name ${serverName.trim()};`);
      lines.push(`    return 301 https://$server_name$request_uri;`);
      lines.push('}');
    }

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-server`} className="block text-sm font-medium text-gray-700 mb-1">
          Server Name (domain)
        </label>
        <input
          id={`${toolId}-server`}
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          placeholder="example.com"
          aria-label={`Server name for ${toolName}`}
          className="input-field"
        />

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-xs text-gray-500 mb-1">Listen Port</label>
            <input
              id={`${toolId}-port`}
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="80"
              aria-label="Listen port"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-root`} className="block text-xs text-gray-500 mb-1">Document Root</label>
            <input
              id={`${toolId}-root`}
              type="text"
              value={root}
              onChange={(e) => setRoot(e.target.value)}
              placeholder="/var/www/html"
              aria-label="Document root"
              className="input-field text-sm"
            />
          </div>
        </div>

        <div className="mt-3">
          <label htmlFor={`${toolId}-proxy`} className="block text-xs text-gray-500 mb-1">Proxy Pass (optional, overrides root)</label>
          <input
            id={`${toolId}-proxy`}
            type="text"
            value={proxyPass}
            onChange={(e) => setProxyPass(e.target.value)}
            placeholder="http://localhost:3000"
            aria-label="Proxy pass URL"
            className="input-field text-sm"
          />
        </div>

        <div className="flex gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={enableSSL}
              onChange={(e) => setEnableSSL(e.target.checked)}
              aria-label="Enable SSL"
              className="rounded border-gray-300"
            />
            Enable SSL
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={enableGzip}
              onChange={(e) => setEnableGzip(e.target.checked)}
              aria-label="Enable Gzip"
              className="rounded border-gray-300"
            />
            Enable Gzip
          </label>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate nginx config" className="btn-primary">
        Generate Config
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-3 bg-gray-50 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
