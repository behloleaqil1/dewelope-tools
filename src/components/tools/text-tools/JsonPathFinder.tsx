'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonPathFinder - Find and extract values from JSON using dot-notation paths.
 */
export default function JsonPathFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [jsonInput, setJsonInput] = useState('');
  const [path, setPath] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ paths: { path: string; value: string; type: string }[] } | null>(null);

  const getAllPaths = (obj: unknown, prefix = ''): { path: string; value: string; type: string }[] => {
    const paths: { path: string; value: string; type: string }[] = [];
    if (obj === null) {
      paths.push({ path: prefix || '$', value: 'null', type: 'null' });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => {
        paths.push(...getAllPaths(item, `${prefix}[${i}]`));
      });
    } else if (typeof obj === 'object') {
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        const newPath = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          paths.push(...getAllPaths(value, newPath));
        } else {
          paths.push({ path: newPath, value: JSON.stringify(value), type: typeof value });
        }
      });
    } else {
      paths.push({ path: prefix || '$', value: JSON.stringify(obj), type: typeof obj });
    }
    return paths;
  };

  const find = () => {
    setError('');
    setResult(null);
    if (!jsonInput.trim()) { setError('Please enter JSON.'); return; }

    try {
      const parsed = JSON.parse(jsonInput);
      const allPaths = getAllPaths(parsed);

      if (path.trim()) {
        const filtered = allPaths.filter((p) =>
          p.path.toLowerCase().includes(path.toLowerCase())
        );
        setResult({ paths: filtered.length > 0 ? filtered : [{ path: '(no matches)', value: '', type: '' }] });
      } else {
        setResult({ paths: allPaths.slice(0, 50) });
      }
    } catch {
      setError('Invalid JSON. Please check the input.');
    }
  };

  const copyText = result ? result.paths.map((p) => `${p.path}: ${p.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-json`} className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
        <textarea id={`${toolId}-json`} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder={'{\n  "user": {\n    "name": "John",\n    "age": 30\n  }\n}'} rows={6} aria-label={`JSON input for ${toolName}`} className="input-field font-mono" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">Filter Path (optional)</label>
          <input id={`${toolId}-path`} type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="e.g. user.name" aria-label={`Path filter for ${toolName}`} className="input-field font-mono" />
        </div>
      </InputArea>

      <button onClick={find} className="btn-primary" aria-label="Find JSON paths">Find Paths</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">{result.paths.length} path(s) found</div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {result.paths.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-sm font-mono text-blue-600">{p.path}</span>
                  <span className="text-sm font-mono text-gray-700">{p.value}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
