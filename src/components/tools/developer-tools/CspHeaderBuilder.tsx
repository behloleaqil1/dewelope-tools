'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface DirectiveConfig {
  enabled: boolean;
  values: string[];
}

/**
 * CspHeaderBuilder - Build Content Security Policy headers with an interactive interface.
 * Configure directives for scripts, styles, images, fonts, and more.
 */
export default function CspHeaderBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [directives, setDirectives] = useState<Record<string, DirectiveConfig>>({
    'default-src': { enabled: true, values: ["'self'"] },
    'script-src': { enabled: true, values: ["'self'"] },
    'style-src': { enabled: true, values: ["'self'", "'unsafe-inline'"] },
    'img-src': { enabled: true, values: ["'self'", 'data:'] },
    'font-src': { enabled: true, values: ["'self'"] },
    'connect-src': { enabled: true, values: ["'self'"] },
    'media-src': { enabled: false, values: [] },
    'frame-src': { enabled: true, values: ["'none'"] },
    'object-src': { enabled: true, values: ["'none'"] },
    'base-uri': { enabled: true, values: ["'self'"] },
    'form-action': { enabled: true, values: ["'self'"] },
    'frame-ancestors': { enabled: false, values: [] },
    'worker-src': { enabled: false, values: [] },
    'child-src': { enabled: false, values: [] },
  });
  const [customValue, setCustomValue] = useState('');
  const [selectedDirective, setSelectedDirective] = useState('default-src');

  const toggleDirective = (key: string) => {
    setDirectives(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const addValue = (key: string, value: string) => {
    if (!value.trim()) return;
    setDirectives(prev => ({
      ...prev,
      [key]: { ...prev[key], values: [...prev[key].values.filter(v => v !== value), value] },
    }));
  };

  const removeValue = (key: string, value: string) => {
    setDirectives(prev => ({
      ...prev,
      [key]: { ...prev[key], values: prev[key].values.filter(v => v !== value) },
    }));
  };

  const QUICK_VALUES = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", 'https:', 'data:', 'blob:', '*'];

  const generateHeader = (): string => {
    const parts: string[] = [];
    Object.entries(directives).forEach(([key, config]) => {
      if (config.enabled && config.values.length > 0) {
        parts.push(`${key} ${config.values.join(' ')}`);
      }
    });
    return parts.join('; ');
  };

  const header = generateHeader();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-3">{toolName} - Toggle Directives</label>
        <div className="space-y-2">
          {Object.entries(directives).map(([key, config]) => (
            <div key={key} className="border border-gray-200 rounded p-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={() => toggleDirective(key)}
                  aria-label={`Enable ${key} directive`}
                  className="text-blue-600"
                />
                <span className="text-xs font-mono font-medium text-gray-700">{key}</span>
              </div>
              {config.enabled && (
                <div className="mt-1 ml-6">
                  <div className="flex flex-wrap gap-1">
                    {config.values.map(v => (
                      <span key={v} className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
                        {v}
                        <button onClick={() => removeValue(key, v)} className="text-blue-500 hover:text-red-500" aria-label={`Remove ${v} from ${key}`}>&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {QUICK_VALUES.filter(v => !config.values.includes(v)).map(v => (
                      <button key={v} onClick={() => addValue(key, v)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono" aria-label={`Add ${v} to ${key}`}>+{v}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <select
            value={selectedDirective}
            onChange={(e) => setSelectedDirective(e.target.value)}
            aria-label="Select directive for custom value"
            className="input-field text-sm flex-shrink-0"
          >
            {Object.keys(directives).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Custom source (e.g. https://cdn.example.com)"
            aria-label="Custom source value"
            className="input-field text-sm flex-1"
          />
          <button
            onClick={() => { addValue(selectedDirective, customValue); setCustomValue(''); }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!header}>
        {header && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generated CSP Header</label>
              <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">Content-Security-Policy: {header}</pre>
            </div>
            <CopyToClipboard text={`Content-Security-Policy: ${header}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
