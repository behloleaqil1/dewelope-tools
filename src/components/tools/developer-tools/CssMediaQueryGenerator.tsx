'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Breakpoint {
  name: string;
  minWidth: string;
  maxWidth: string;
}

/**
 * CssMediaQueryGenerator - Generate CSS media queries for responsive breakpoints.
 * Supports common presets and custom breakpoints with min/max width.
 */
export default function CssMediaQueryGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [preset, setPreset] = useState('tailwind');
  const [customBreakpoints, setCustomBreakpoints] = useState<Breakpoint[]>([
    { name: 'mobile', minWidth: '', maxWidth: '767' },
    { name: 'tablet', minWidth: '768', maxWidth: '1023' },
    { name: 'desktop', minWidth: '1024', maxWidth: '' },
  ]);
  const [output, setOutput] = useState('');

  const presets: Record<string, Breakpoint[]> = {
    tailwind: [
      { name: 'sm', minWidth: '640', maxWidth: '' },
      { name: 'md', minWidth: '768', maxWidth: '' },
      { name: 'lg', minWidth: '1024', maxWidth: '' },
      { name: 'xl', minWidth: '1280', maxWidth: '' },
      { name: '2xl', minWidth: '1536', maxWidth: '' },
    ],
    bootstrap: [
      { name: 'sm', minWidth: '576', maxWidth: '' },
      { name: 'md', minWidth: '768', maxWidth: '' },
      { name: 'lg', minWidth: '992', maxWidth: '' },
      { name: 'xl', minWidth: '1200', maxWidth: '' },
      { name: 'xxl', minWidth: '1400', maxWidth: '' },
    ],
    common: [
      { name: 'mobile', minWidth: '', maxWidth: '767' },
      { name: 'tablet', minWidth: '768', maxWidth: '1023' },
      { name: 'desktop', minWidth: '1024', maxWidth: '1279' },
      { name: 'large-desktop', minWidth: '1280', maxWidth: '' },
    ],
    custom: [],
  };

  const generateQuery = (bp: Breakpoint): string => {
    const conditions: string[] = [];
    if (bp.minWidth) conditions.push(`(min-width: ${bp.minWidth}px)`);
    if (bp.maxWidth) conditions.push(`(max-width: ${bp.maxWidth}px)`);
    if (conditions.length === 0) return '';
    return `/* ${bp.name} */\n@media ${conditions.join(' and ')} {\n  /* styles */\n}`;
  };

  const generate = () => {
    const breakpoints = preset === 'custom' ? customBreakpoints : presets[preset];
    const queries = breakpoints
      .map(generateQuery)
      .filter(Boolean)
      .join('\n\n');
    setOutput(queries);
  };

  const addCustomBreakpoint = () => {
    setCustomBreakpoints([...customBreakpoints, { name: '', minWidth: '', maxWidth: '' }]);
  };

  const updateCustomBreakpoint = (index: number, field: keyof Breakpoint, value: string) => {
    const updated = [...customBreakpoints];
    updated[index] = { ...updated[index], [field]: value };
    setCustomBreakpoints(updated);
  };

  const removeCustomBreakpoint = (index: number) => {
    setCustomBreakpoints(customBreakpoints.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-preset`} className="block text-sm font-medium text-gray-700 mb-1">
          Breakpoint Preset
        </label>
        <select
          id={`${toolId}-preset`}
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
          aria-label={`Breakpoint preset for ${toolName}`}
          className="input-field"
        >
          <option value="tailwind">Tailwind CSS</option>
          <option value="bootstrap">Bootstrap 5</option>
          <option value="common">Common (Mobile-first)</option>
          <option value="custom">Custom</option>
        </select>
      </InputArea>

      {preset === 'custom' && (
        <div className="space-y-2">
          {customBreakpoints.map((bp, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={bp.name}
                onChange={(e) => updateCustomBreakpoint(idx, 'name', e.target.value)}
                placeholder="Name"
                className="input-field flex-1"
                aria-label={`Breakpoint ${idx + 1} name`}
              />
              <input
                type="text"
                inputMode="numeric"
                value={bp.minWidth}
                onChange={(e) => updateCustomBreakpoint(idx, 'minWidth', e.target.value)}
                placeholder="Min (px)"
                className="input-field w-24"
                aria-label={`Breakpoint ${idx + 1} min width`}
              />
              <input
                type="text"
                inputMode="numeric"
                value={bp.maxWidth}
                onChange={(e) => updateCustomBreakpoint(idx, 'maxWidth', e.target.value)}
                placeholder="Max (px)"
                className="input-field w-24"
                aria-label={`Breakpoint ${idx + 1} max width`}
              />
              <button
                onClick={() => removeCustomBreakpoint(idx)}
                className="text-red-500 hover:text-red-700 text-sm px-2"
                aria-label={`Remove breakpoint ${idx + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addCustomBreakpoint} className="text-sm text-blue-600 hover:text-blue-800">
            + Add Breakpoint
          </button>
        </div>
      )}

      <button onClick={generate} aria-label="Generate media queries" className="btn-primary">
        Generate Media Queries
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS Media Queries</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
