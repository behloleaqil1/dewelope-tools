'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CspHeaderGenerator - Generate Content-Security-Policy headers from directives.
 */
export default function CspHeaderGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [directives, setDirectives] = useState<Record<string, string>>({
    'default-src': "'self'",
    'script-src': "'self'",
    'style-src': "'self'",
    'img-src': "'self'",
    'font-src': "'self'",
    'connect-src': "'self'",
    'frame-src': "'none'",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
  });
  const [reportUri, setReportUri] = useState('');
  const [upgradeInsecure, setUpgradeInsecure] = useState(false);
  const [blockMixed, setBlockMixed] = useState(false);

  const DIRECTIVE_KEYS = [
    'default-src', 'script-src', 'style-src', 'img-src', 'font-src',
    'connect-src', 'media-src', 'frame-src', 'child-src', 'worker-src',
    'object-src', 'base-uri', 'form-action', 'frame-ancestors',
  ];

  const COMMON_VALUES = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", '*.googleapis.com', '*.gstatic.com', '*.cloudflare.com', 'data:', 'blob:', 'https:'];

  const updateDirective = (key: string, value: string) => {
    setDirectives(prev => ({ ...prev, [key]: value }));
  };

  const generateHeader = (): string => {
    const parts: string[] = [];

    Object.entries(directives).forEach(([key, value]) => {
      if (value.trim()) {
        parts.push(`${key} ${value.trim()}`);
      }
    });

    if (upgradeInsecure) parts.push('upgrade-insecure-requests');
    if (blockMixed) parts.push('block-all-mixed-content');
    if (reportUri.trim()) parts.push(`report-uri ${reportUri.trim()}`);

    return parts.join('; ');
  };

  const header = generateHeader();
  const metaTag = `<meta http-equiv="Content-Security-Policy" content="${header}">`;
  const httpHeader = `Content-Security-Policy: ${header}`;

  const copyText = `HTTP Header:\n${httpHeader}\n\nMeta Tag:\n${metaTag}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-3">CSP Directives for {toolName}</label>
        <div className="space-y-3">
          {DIRECTIVE_KEYS.map(key => (
            <div key={key} className="flex gap-2 items-center">
              <label className="text-xs font-mono text-gray-600 w-32 flex-shrink-0">{key}</label>
              <input
                type="text"
                value={directives[key] || ''}
                onChange={(e) => updateDirective(key, e.target.value)}
                placeholder={`e.g. 'self' https://example.com`}
                aria-label={`${key} directive`}
                className="input-field text-sm font-mono flex-1"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={upgradeInsecure} onChange={(e) => setUpgradeInsecure(e.target.checked)} className="text-blue-600" />
            <span className="text-sm text-gray-700">upgrade-insecure-requests</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={blockMixed} onChange={(e) => setBlockMixed(e.target.checked)} className="text-blue-600" />
            <span className="text-sm text-gray-700">block-all-mixed-content</span>
          </label>
        </div>

        <div className="mt-3">
          <label htmlFor={`${toolId}-report`} className="block text-xs text-gray-500 mb-1">Report URI (optional)</label>
          <input
            id={`${toolId}-report`}
            type="text"
            value={reportUri}
            onChange={(e) => setReportUri(e.target.value)}
            placeholder="https://example.com/csp-report"
            aria-label="Report URI"
            className="input-field text-sm"
          />
        </div>

        <div className="mt-3 bg-blue-50 p-2 rounded border border-blue-200">
          <div className="text-xs font-medium text-blue-700 mb-1">Common values:</div>
          <div className="flex flex-wrap gap-1">
            {COMMON_VALUES.map(v => (
              <span key={v} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">{v}</span>
            ))}
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!header}>
        {header && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HTTP Header</label>
              <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">{httpHeader}</pre>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HTML Meta Tag</label>
              <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">{metaTag}</pre>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
