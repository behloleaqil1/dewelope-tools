'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DesignTokenGenerator - Generate design tokens JSON from color/spacing inputs.
 */
export default function DesignTokenGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [primary, setPrimary] = useState('#3b82f6');
  const [secondary, setSecondary] = useState('#10b981');
  const [baseSize, setBaseSize] = useState('16');
  const [prefix, setPrefix] = useState('dt');
  const [output, setOutput] = useState('');

  function generate() {
    const base = parseInt(baseSize) || 16;
    const tokens = {
      color: {
        primary: { value: primary },
        secondary: { value: secondary },
        background: { value: '#ffffff' },
        surface: { value: '#f9fafb' },
        text: { value: '#111827' },
        'text-muted': { value: '#6b7280' },
      },
      spacing: {
        xs: { value: `${base * 0.25}px` },
        sm: { value: `${base * 0.5}px` },
        md: { value: `${base}px` },
        lg: { value: `${base * 1.5}px` },
        xl: { value: `${base * 2}px` },
        '2xl': { value: `${base * 3}px` },
      },
      fontSize: {
        xs: { value: `${base * 0.75}px` },
        sm: { value: `${base * 0.875}px` },
        base: { value: `${base}px` },
        lg: { value: `${base * 1.125}px` },
        xl: { value: `${base * 1.25}px` },
        '2xl': { value: `${base * 1.5}px` },
      },
      borderRadius: {
        sm: { value: '4px' },
        md: { value: '8px' },
        lg: { value: '12px' },
        full: { value: '9999px' },
      },
      prefix,
    };

    setOutput(JSON.stringify(tokens, null, 2));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label htmlFor={`${toolId}-primary`} className="block text-sm font-medium text-gray-700 mb-1">Primary</label>
            <input id={`${toolId}-primary`} type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} aria-label={`Primary color for ${toolName}`} className="w-full h-10 rounded border border-gray-300 cursor-pointer" />
          </div>
          <div>
            <label htmlFor={`${toolId}-secondary`} className="block text-sm font-medium text-gray-700 mb-1">Secondary</label>
            <input id={`${toolId}-secondary`} type="color" value={secondary} onChange={(e) => setSecondary(e.target.value)} aria-label="Secondary color" className="w-full h-10 rounded border border-gray-300 cursor-pointer" />
          </div>
          <div>
            <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base Size (px)</label>
            <input id={`${toolId}-base`} type="number" value={baseSize} onChange={(e) => setBaseSize(e.target.value)} aria-label="Base size in pixels" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-prefix`} className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
            <input id={`${toolId}-prefix`} type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} aria-label="Token prefix" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate design tokens" className="btn-primary">Generate Tokens</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Design Tokens (JSON)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
