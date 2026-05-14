'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NginxServerBlockGenerator - Generate nginx server block configuration.
 */
export default function NginxServerBlockGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [domain, setDomain] = useState('');
  const [port, setPort] = useState('80');
  const [root, setRoot] = useState('/var/www/html');
  const [ssl, setSsl] = useState(false);
  const [proxyPass, setProxyPass] = useState('');

  const generate = (): string => {
    if (!domain.trim()) return '';
    let config = `server {\n`;
    config += `    listen ${ssl ? '443 ssl' : port};\n`;
    config += `    server_name ${domain.trim()};\n\n`;
    if (ssl) {
      config += `    ssl_certificate /etc/letsencrypt/live/${domain.trim()}/fullchain.pem;\n`;
      config += `    ssl_certificate_key /etc/letsencrypt/live/${domain.trim()}/privkey.pem;\n\n`;
    }
    config += `    root ${root};\n`;
    config += `    index index.html index.htm;\n\n`;
    if (proxyPass.trim()) {
      config += `    location / {\n`;
      config += `        proxy_pass ${proxyPass.trim()};\n`;
      config += `        proxy_set_header Host $host;\n`;
      config += `        proxy_set_header X-Real-IP $remote_addr;\n`;
      config += `        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n`;
      config += `    }\n`;
    } else {
      config += `    location / {\n`;
      config += `        try_files $uri $uri/ =404;\n`;
      config += `    }\n`;
    }
    config += `}\n`;
    if (ssl) {
      config += `\nserver {\n    listen 80;\n    server_name ${domain.trim()};\n    return 301 https://$server_name$request_uri;\n}\n`;
    }
    return config;
  };

  const result = generate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-domain`} className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
        <input id={`${toolId}-domain`} type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" aria-label={`Domain for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Listen Port</label>
        <input id={`${toolId}-port`} type="text" value={port} onChange={(e) => setPort(e.target.value)} placeholder="80" aria-label={`Port for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">Document Root</label>
        <input id={`${toolId}-root`} type="text" value={root} onChange={(e) => setRoot(e.target.value)} placeholder="/var/www/html" aria-label={`Document root for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-proxy`} className="block text-sm font-medium text-gray-700 mb-1">Proxy Pass (optional)</label>
        <input id={`${toolId}-proxy`} type="text" value={proxyPass} onChange={(e) => setProxyPass(e.target.value)} placeholder="http://localhost:3000" aria-label={`Proxy pass for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex items-center gap-2">
        <input id={`${toolId}-ssl`} type="checkbox" checked={ssl} onChange={(e) => setSsl(e.target.checked)} aria-label={`Enable SSL for ${toolName}`} className="w-4 h-4" />
        <label htmlFor={`${toolId}-ssl`} className="text-sm text-gray-700">Enable SSL (Let&apos;s Encrypt)</label>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
