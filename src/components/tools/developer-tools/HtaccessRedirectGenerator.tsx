'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HtaccessRedirectGenerator - Generates Apache .htaccess redirect rules.
 */
export default function HtaccessRedirectGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [redirectType, setRedirectType] = useState('301');
  const [ruleType, setRuleType] = useState('single');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [forceHttps, setForceHttps] = useState(false);
  const [forceWww, setForceWww] = useState(false);
  const [removeWww, setRemoveWww] = useState(false);

  const generateRules = (): string => {
    const lines: string[] = [];

    if (forceHttps) {
      lines.push('# Force HTTPS');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTPS} off');
      lines.push('RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
      lines.push('');
    }

    if (forceWww) {
      lines.push('# Force www');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTP_HOST} !^www\\. [NC]');
      lines.push('RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]');
      lines.push('');
    }

    if (removeWww) {
      lines.push('# Remove www');
      lines.push('RewriteEngine On');
      lines.push('RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]');
      lines.push('RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]');
      lines.push('');
    }

    if (source.trim() && destination.trim()) {
      if (ruleType === 'single') {
        lines.push(`# Redirect single page`);
        lines.push(`Redirect ${redirectType} ${source.trim()} ${destination.trim()}`);
      } else if (ruleType === 'directory') {
        lines.push(`# Redirect entire directory`);
        lines.push('RewriteEngine On');
        lines.push(`RewriteRule ^${source.trim().replace(/^\//, '')}(.*)$ ${destination.trim()}$1 [L,R=${redirectType}]`);
      } else if (ruleType === 'domain') {
        lines.push(`# Redirect entire domain`);
        lines.push('RewriteEngine On');
        lines.push(`RewriteCond %{HTTP_HOST} ^${source.trim().replace(/\./g, '\\.')}$ [NC]`);
        lines.push(`RewriteRule ^(.*)$ ${destination.trim()}/$1 [L,R=${redirectType}]`);
      }
    }

    return lines.join('\n');
  };

  const output = generateRules();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputArea>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Redirect Type
            </label>
            <select
              id={`${toolId}-type`}
              value={redirectType}
              onChange={(e) => setRedirectType(e.target.value)}
              aria-label={`Redirect type for ${toolName}`}
              className="input-field"
            >
              <option value="301">301 (Permanent)</option>
              <option value="302">302 (Temporary)</option>
              <option value="307">307 (Temporary, preserve method)</option>
            </select>
          </InputArea>

          <InputArea>
            <label htmlFor={`${toolId}-rule`} className="block text-sm font-medium text-gray-700 mb-1">
              Rule Type
            </label>
            <select
              id={`${toolId}-rule`}
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value)}
              aria-label={`Rule type for ${toolName}`}
              className="input-field"
            >
              <option value="single">Single Page</option>
              <option value="directory">Directory</option>
              <option value="domain">Domain</option>
            </select>
          </InputArea>
        </div>

        <InputArea>
          <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">
            Source {ruleType === 'domain' ? '(domain)' : '(path)'}
          </label>
          <input
            id={`${toolId}-source`}
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder={ruleType === 'domain' ? 'e.g. old-domain.com' : 'e.g. /old-page'}
            aria-label={`Source path for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-dest`} className="block text-sm font-medium text-gray-700 mb-1">
            Destination URL
          </label>
          <input
            id={`${toolId}-dest`}
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. https://example.com/new-page"
            aria-label={`Destination URL for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={forceHttps} onChange={(e) => setForceHttps(e.target.checked)} className="rounded" />
            Force HTTPS
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={forceWww} onChange={(e) => { setForceWww(e.target.checked); if (e.target.checked) setRemoveWww(false); }} className="rounded" />
            Force www
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={removeWww} onChange={(e) => { setRemoveWww(e.target.checked); if (e.target.checked) setForceWww(false); }} className="rounded" />
            Remove www
          </label>
        </div>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated .htaccess Rules</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
