'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ApacheVhostGenerator - Generate Apache virtual host configuration files.
 */
export default function ApacheVhostGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [serverName, setServerName] = useState('example.com');
  const [serverAlias, setServerAlias] = useState('www.example.com');
  const [documentRoot, setDocumentRoot] = useState('/var/www/html');
  const [port, setPort] = useState('80');
  const [enableSSL, setEnableSSL] = useState(false);
  const [sslCert, setSslCert] = useState('/etc/ssl/certs/server.crt');
  const [sslKey, setSslKey] = useState('/etc/ssl/private/server.key');
  const [enableLogs, setEnableLogs] = useState(true);
  const [enableRewrite, setEnableRewrite] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setOutput('');

    if (!serverName.trim()) {
      setError('Please enter a server name.');
      return;
    }

    if (!documentRoot.trim()) {
      setError('Please enter a document root.');
      return;
    }

    let config = '';

    if (enableSSL) {
      // HTTP to HTTPS redirect
      config += `<VirtualHost *:80>\n`;
      config += `    ServerName ${serverName.trim()}\n`;
      if (serverAlias.trim()) {
        config += `    ServerAlias ${serverAlias.trim()}\n`;
      }
      config += `    Redirect permanent / https://${serverName.trim()}/\n`;
      config += `</VirtualHost>\n\n`;

      // HTTPS vhost
      config += `<VirtualHost *:443>\n`;
      config += `    ServerName ${serverName.trim()}\n`;
      if (serverAlias.trim()) {
        config += `    ServerAlias ${serverAlias.trim()}\n`;
      }
      config += `    DocumentRoot ${documentRoot.trim()}\n\n`;
      config += `    SSLEngine on\n`;
      config += `    SSLCertificateFile ${sslCert.trim()}\n`;
      config += `    SSLCertificateKeyFile ${sslKey.trim()}\n\n`;
    } else {
      config += `<VirtualHost *:${port.trim() || '80'}>\n`;
      config += `    ServerName ${serverName.trim()}\n`;
      if (serverAlias.trim()) {
        config += `    ServerAlias ${serverAlias.trim()}\n`;
      }
      config += `    DocumentRoot ${documentRoot.trim()}\n\n`;
    }

    config += `    <Directory ${documentRoot.trim()}>\n`;
    config += `        Options -Indexes +FollowSymLinks\n`;
    config += `        AllowOverride All\n`;
    config += `        Require all granted\n`;
    config += `    </Directory>\n\n`;

    if (enableRewrite) {
      config += `    RewriteEngine On\n`;
      config += `    RewriteCond %{REQUEST_FILENAME} !-f\n`;
      config += `    RewriteCond %{REQUEST_FILENAME} !-d\n`;
      config += `    RewriteRule ^(.*)$ /index.php [L,QSA]\n\n`;
    }

    if (enableLogs) {
      const logName = serverName.trim().replace(/\./g, '_');
      config += `    ErrorLog \${APACHE_LOG_DIR}/${logName}_error.log\n`;
      config += `    CustomLog \${APACHE_LOG_DIR}/${logName}_access.log combined\n`;
    }

    config += `</VirtualHost>\n`;

    setOutput(config);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-server`} className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
              <input id={`${toolId}-server`} type="text" value={serverName} onChange={(e) => setServerName(e.target.value)} placeholder="example.com" aria-label={`Server name for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-alias`} className="block text-sm font-medium text-gray-700 mb-1">Server Alias</label>
              <input id={`${toolId}-alias`} type="text" value={serverAlias} onChange={(e) => setServerAlias(e.target.value)} placeholder="www.example.com" aria-label="Server alias" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-docroot`} className="block text-sm font-medium text-gray-700 mb-1">Document Root</label>
              <input id={`${toolId}-docroot`} type="text" value={documentRoot} onChange={(e) => setDocumentRoot(e.target.value)} placeholder="/var/www/html" aria-label="Document root" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input id={`${toolId}-port`} type="text" value={port} onChange={(e) => setPort(e.target.value)} placeholder="80" aria-label="Listen port" className="input-field" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableSSL} onChange={(e) => setEnableSSL(e.target.checked)} className="rounded" />
              Enable SSL
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableLogs} onChange={(e) => setEnableLogs(e.target.checked)} className="rounded" />
              Enable Logs
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={enableRewrite} onChange={(e) => setEnableRewrite(e.target.checked)} className="rounded" />
              Enable Rewrite (PHP)
            </label>
          </div>
          {enableSSL && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-cert`} className="block text-sm font-medium text-gray-700 mb-1">SSL Certificate Path</label>
                <input id={`${toolId}-cert`} type="text" value={sslCert} onChange={(e) => setSslCert(e.target.value)} placeholder="/etc/ssl/certs/server.crt" aria-label="SSL certificate path" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-key`} className="block text-sm font-medium text-gray-700 mb-1">SSL Key Path</label>
                <input id={`${toolId}-key`} type="text" value={sslKey} onChange={(e) => setSslKey(e.target.value)} placeholder="/etc/ssl/private/server.key" aria-label="SSL key path" className="input-field" />
              </div>
            </div>
          )}
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate Apache vhost config">Generate VHost Config</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Apache Virtual Host Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
