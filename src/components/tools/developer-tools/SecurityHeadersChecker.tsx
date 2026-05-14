'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SecurityHeadersChecker - Check/generate security headers configuration.
 */
export default function SecurityHeadersChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [csp, setCsp] = useState(true);
  const [hsts, setHsts] = useState(true);
  const [xFrame, setXFrame] = useState(true);
  const [xContent, setXContent] = useState(true);
  const [referrer, setReferrer] = useState(true);
  const [permissions, setPermissions] = useState(false);
  const [output, setOutput] = useState('');

  function generateHeaders() {
    const headers: string[] = [];

    if (hsts) {
      headers.push('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
    if (csp) {
      headers.push("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'");
    }
    if (xFrame) {
      headers.push('X-Frame-Options: DENY');
    }
    if (xContent) {
      headers.push('X-Content-Type-Options: nosniff');
    }
    if (referrer) {
      headers.push('Referrer-Policy: strict-origin-when-cross-origin');
    }
    if (permissions) {
      headers.push('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    }

    headers.push('X-XSS-Protection: 0');

    setOutput(headers.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Security Headers</label>
        <div className="space-y-2">
          {[
            { id: 'hsts', label: 'Strict-Transport-Security (HSTS)', checked: hsts, set: setHsts },
            { id: 'csp', label: 'Content-Security-Policy (CSP)', checked: csp, set: setCsp },
            { id: 'xframe', label: 'X-Frame-Options', checked: xFrame, set: setXFrame },
            { id: 'xcontent', label: 'X-Content-Type-Options', checked: xContent, set: setXContent },
            { id: 'referrer', label: 'Referrer-Policy', checked: referrer, set: setReferrer },
            { id: 'permissions', label: 'Permissions-Policy', checked: permissions, set: setPermissions },
          ].map((h) => (
            <label key={h.id} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={h.checked}
                onChange={(e) => h.set(e.target.checked)}
                aria-label={`${h.label} for ${toolName}`}
                className="rounded border-gray-300"
              />
              {h.label}
            </label>
          ))}
        </div>
      </InputArea>

      <button onClick={generateHeaders} aria-label="Generate security headers" className="btn-primary">
        Generate Headers
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Security Headers</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
