'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CaddyConfigGenerator - Generate Caddyfile configuration for reverse proxy, static sites, and more.
 */
export default function CaddyConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [domain, setDomain] = useState('example.com');
  const [mode, setMode] = useState<'reverse-proxy' | 'static' | 'redirect' | 'php'>('reverse-proxy');
  const [upstream, setUpstream] = useState('localhost:3000');
  const [root, setRoot] = useState('/var/www/html');
  const [redirectTarget, setRedirectTarget] = useState('https://www.example.com');
  const [enableTls, setEnableTls] = useState(true);
  const [enableGzip, setEnableGzip] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    let config = '';

    if (mode === 'reverse-proxy') {
      config += `${domain} {\n`;
      if (enableGzip) config += `  encode gzip\n`;
      if (enableTls) config += `  tls internal\n`;
      config += `  reverse_proxy ${upstream}\n`;
      config += `\n  header {\n    X-Content-Type-Options nosniff\n    X-Frame-Options DENY\n    Referrer-Policy strict-origin-when-cross-origin\n  }\n`;
      config += `\n  log {\n    output file /var/log/caddy/${domain}.log\n  }\n`;
      config += `}\n`;
    } else if (mode === 'static') {
      config += `${domain} {\n`;
      config += `  root * ${root}\n`;
      if (enableGzip) config += `  encode gzip\n`;
      if (enableTls) config += `  tls internal\n`;
      config += `  file_server\n`;
      config += `\n  header {\n    X-Content-Type-Options nosniff\n    X-Frame-Options DENY\n  }\n`;
      config += `\n  handle_errors {\n    rewrite * /404.html\n    file_server\n  }\n`;
      config += `}\n`;
    } else if (mode === 'redirect') {
      config += `${domain} {\n`;
      config += `  redir ${redirectTarget} permanent\n`;
      config += `}\n`;
    } else if (mode === 'php') {
      config += `${domain} {\n`;
      config += `  root * ${root}\n`;
      if (enableGzip) config += `  encode gzip\n`;
      if (enableTls) config += `  tls internal\n`;
      config += `  php_fastcgi unix//run/php/php-fpm.sock\n`;
      config += `  file_server\n`;
      config += `\n  @blocked {\n    path /vendor/* /node_modules/* /.env\n  }\n  respond @blocked 403\n`;
      config += `}\n`;
    }

    setOutput(config);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-domain`} className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <input id={`${toolId}-domain`} type="text" value={domain} onChange={(e) => setDomain(e.target.value)} aria-label={`Domain for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Site Type</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} aria-label="Site type" className="input-field">
              <option value="reverse-proxy">Reverse Proxy</option>
              <option value="static">Static Site</option>
              <option value="redirect">Redirect</option>
              <option value="php">PHP (FastCGI)</option>
            </select>
          </div>
          {mode === 'reverse-proxy' && (
            <div>
              <label htmlFor={`${toolId}-upstream`} className="block text-sm font-medium text-gray-700 mb-1">Upstream Address</label>
              <input id={`${toolId}-upstream`} type="text" value={upstream} onChange={(e) => setUpstream(e.target.value)} aria-label="Upstream address" className="input-field" />
            </div>
          )}
          {(mode === 'static' || mode === 'php') && (
            <div>
              <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">Root Directory</label>
              <input id={`${toolId}-root`} type="text" value={root} onChange={(e) => setRoot(e.target.value)} aria-label="Root directory" className="input-field" />
            </div>
          )}
          {mode === 'redirect' && (
            <div>
              <label htmlFor={`${toolId}-redirect`} className="block text-sm font-medium text-gray-700 mb-1">Redirect Target</label>
              <input id={`${toolId}-redirect`} type="text" value={redirectTarget} onChange={(e) => setRedirectTarget(e.target.value)} aria-label="Redirect target" className="input-field" />
            </div>
          )}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableTls} onChange={(e) => setEnableTls(e.target.checked)} className="rounded" />
              TLS (internal)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableGzip} onChange={(e) => setEnableGzip(e.target.checked)} className="rounded" />
              Gzip Compression
            </label>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate Caddyfile">Generate Caddyfile</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Caddyfile</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
