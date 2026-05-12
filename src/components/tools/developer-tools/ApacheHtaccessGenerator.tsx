'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ApacheHtaccessGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [options, setOptions] = useState({ https: true, www: false, gzip: true, caching: true });
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    if (options.https) lines.push('RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
    if (options.www) lines.push('\nRewriteCond %{HTTP_HOST} !^www\\.\nRewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
    if (options.gzip) lines.push('\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json\n</IfModule>');
    if (options.caching) lines.push('\n<IfModule mod_expires.c>\n  ExpiresActive On\n  ExpiresByType image/jpeg "access plus 1 year"\n  ExpiresByType text/css "access plus 1 month"\n  ExpiresByType application/javascript "access plus 1 month"\n</IfModule>');
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <fieldset><legend className="block text-sm font-medium text-gray-700 mb-2">Options</legend>
          <div className="space-y-2">
            {Object.entries(options).map(([key, val]) => (
              <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={val} onChange={() => setOptions(p => ({ ...p, [key]: !p[key as keyof typeof p] }))} aria-label={`${key} for ${toolName}`} />{key === 'https' ? 'Force HTTPS' : key === 'www' ? 'Force www' : key === 'gzip' ? 'Enable Gzip' : 'Browser Caching'}</label>
            ))}
          </div>
        </fieldset>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate .htaccess</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
