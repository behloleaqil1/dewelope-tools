'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssVariableGenerator - Generate CSS custom properties (variables) from a design token list.
 * Accepts key:value pairs (one per line) and outputs :root { --key: value; } block.
 */
export default function CssVariableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [prefix, setPrefix] = useState('');
  const [selector, setSelector] = useState(':root');

  function handleGenerate() {
    if (!input.trim()) return;

    const lines = input.split('\n').filter((l) => l.trim().length > 0);
    const variables: string[] = [];

    for (const line of lines) {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) continue;

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (!key || !value) continue;

      // Convert key to CSS variable name format
      const varName = key
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const fullName = prefix ? `--${prefix}-${varName}` : `--${varName}`;
      variables.push(`  ${fullName}: ${value};`);
    }

    if (variables.length === 0) {
      setOutput('/* No valid key:value pairs found. Use format: key: value */');
      return;
    }

    const result = `${selector} {\n${variables.join('\n')}\n}`;
    setOutput(result);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Design Tokens (one per line, key: value format)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"primary-color: #3b82f6\nsecondary-color: #10b981\nfont-size-base: 16px\nspacing-sm: 8px\nspacing-md: 16px"}
          aria-label={`Design token input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="flex-1 min-w-[140px]">
            <label htmlFor={`${toolId}-prefix`} className="block text-xs text-gray-500 mb-1">Variable Prefix (optional)</label>
            <input
              id={`${toolId}-prefix`}
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g. app"
              aria-label="CSS variable prefix"
              className="input-field text-sm"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label htmlFor={`${toolId}-selector`} className="block text-xs text-gray-500 mb-1">Selector</label>
            <input
              id={`${toolId}-selector`}
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder=":root"
              aria-label="CSS selector"
              className="input-field text-sm"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate CSS variables" className="btn-primary">
        Generate CSS Variables
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated CSS Custom Properties</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
