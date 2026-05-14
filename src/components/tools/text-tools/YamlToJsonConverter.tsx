'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * YamlToJsonConverter - Convert YAML to JSON with type inference.
 */
export default function YamlToJsonConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const parseYamlValue = (val: string): unknown => {
    const trimmed = val.trim();
    if (trimmed === 'true' || trimmed === 'True' || trimmed === 'TRUE') return true;
    if (trimmed === 'false' || trimmed === 'False' || trimmed === 'FALSE') return false;
    if (trimmed === 'null' || trimmed === 'Null' || trimmed === 'NULL' || trimmed === '~') return null;
    if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed);
    if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  };

  const convert = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter YAML text.'); return; }

    try {
      const lines = input.split('\n');
      const obj: Record<string, unknown> = {};
      let currentKey = '';
      let inArray = false;
      const arrayItems: unknown[] = [];

      for (const line of lines) {
        if (line.trim() === '' || line.trim().startsWith('#')) continue;

        const trimmed = line.trim();

        if (trimmed.startsWith('- ')) {
          inArray = true;
          arrayItems.push(parseYamlValue(trimmed.slice(2)));
          continue;
        }

        if (inArray && currentKey) {
          obj[currentKey] = [...arrayItems];
          arrayItems.length = 0;
          inArray = false;
        }

        const colonIdx = trimmed.indexOf(':');
        if (colonIdx > 0) {
          const key = trimmed.slice(0, colonIdx).trim();
          const value = trimmed.slice(colonIdx + 1).trim();
          currentKey = key;
          if (value) {
            obj[key] = parseYamlValue(value);
          }
        }
      }

      if (inArray && currentKey) {
        obj[currentKey] = [...arrayItems];
      }

      setResult(JSON.stringify(obj, null, 2));
    } catch {
      setError('Failed to parse YAML. Please check the input format.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">YAML Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"name: John\nage: 30\nactive: true\ntags:\n  - developer\n  - designer"} rows={8} aria-label={`YAML input for ${toolName}`} className="input-field font-mono" />
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert YAML to JSON">Convert</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono max-h-96">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
