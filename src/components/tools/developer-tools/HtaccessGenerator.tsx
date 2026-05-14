'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HtaccessGenerator - Generate .htaccess content from rule selections.
 */
export default function HtaccessGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [forceHttps, setForceHttps] = useState(true);
  const [removeWww, setRemoveWww] = useState(false);
  const [addWww, setAddWww] = useState(false);
  const [gzip, setGzip] = useState(true);
  const [caching, setCaching] = useState(true);
  const [blockHotlinking, setBlockHotlinking] = useState(false);
  const [customErrorPages, setCustomErrorPages] = useState(false);

  const generate = (): string => {
    const lines: string[] = [];
    if (forceHttps) {
      lines.push('# Force HTTPS');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTPS} off');
      lines.push('RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
      lines.push('');
    }
    if (removeWww) {
      lines.push('# Remove www');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]');
      lines.push('RewriteRule ^(.*)$ https://%1/$1 [R=301,L]');
      lines.push('');
    }
    if (addWww) {
      lines.push('# Add www');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTP_HOST} !^www\\. [NC]');
      lines.push('RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]');
      lines.push('');
    }
    if (gzip) {
      lines.push('# Enable Gzip Compression');
      lines.push('<IfModule mod_deflate.c>');
      lines.push('  AddOutputFilterByType DEFLATE text/html text/plain text/css');
      lines.push('  AddOutputFilterByType DEFLATE text/javascript application/javascript');
      lines.push('  AddOutputFilterByType DEFLATE application/json application/xml');
      lines.push('</IfModule>');
      lines.push('');
    }
    if (caching) {
      lines.push('# Browser Caching');
      lines.push('<IfModule mod_expires.c>');
      lines.push('  ExpiresActive On');
      lines.push('  ExpiresByType image/jpeg "access plus 1 year"');
      lines.push('  ExpiresByType image/png "access plus 1 year"');
      lines.push('  ExpiresByType text/css "access plus 1 month"');
      lines.push('  ExpiresByType application/javascript "access plus 1 month"');
      lines.push('</IfModule>');
      lines.push('');
    }
    if (blockHotlinking) {
      lines.push('# Block Hotlinking');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTP_REFERER} !^$');
      lines.push('RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?yourdomain\\.com [NC]');
      lines.push('RewriteRule \\.(jpg|jpeg|png|gif|svg)$ - [F,NC,L]');
      lines.push('');
    }
    if (customErrorPages) {
      lines.push('# Custom Error Pages');
      lines.push('ErrorDocument 404 /404.html');
      lines.push('ErrorDocument 500 /500.html');
      lines.push('ErrorDocument 403 /403.html');
      lines.push('');
    }
    return lines.join('\n') || '# Select options above to generate .htaccess rules';
  };

  const result = generate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 mb-2">Select rules to include:</p>
        {[
          { id: 'https', label: 'Force HTTPS', checked: forceHttps, set: setForceHttps },
          { id: 'rmwww', label: 'Remove www', checked: removeWww, set: setRemoveWww },
          { id: 'addwww', label: 'Add www', checked: addWww, set: setAddWww },
          { id: 'gzip', label: 'Enable Gzip', checked: gzip, set: setGzip },
          { id: 'cache', label: 'Browser Caching', checked: caching, set: setCaching },
          { id: 'hotlink', label: 'Block Hotlinking', checked: blockHotlinking, set: setBlockHotlinking },
          { id: 'errors', label: 'Custom Error Pages', checked: customErrorPages, set: setCustomErrorPages },
        ].map(opt => (
          <div key={opt.id} className="flex items-center gap-2">
            <input id={`${toolId}-${opt.id}`} type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} aria-label={`${opt.label} for ${toolName}`} className="w-4 h-4" />
            <label htmlFor={`${toolId}-${opt.id}`} className="text-sm text-gray-700">{opt.label}</label>
          </div>
        ))}
      </div>
      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
          <CopyToClipboard text={result} />
        </div>
      </OutputArea>
    </div>
  );
}
