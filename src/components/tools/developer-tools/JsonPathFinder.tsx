'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import CodeEditor from '@/components/tools/CodeEditor';

/**
 * JsonPathFinder - Navigate JSON data and find paths to specific values.
 * Shows all paths in the JSON structure with their values.
 */
export default function JsonPathFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [paths, setPaths] = useState<{ path: string; value: string; type: string }[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | undefined>();

  function extractPaths(obj: unknown, currentPath: string = '$'): { path: string; value: string; type: string }[] {
    const results: { path: string; value: string; type: string }[] = [];

    if (obj === null) {
      results.push({ path: currentPath, value: 'null', type: 'null' });
    } else if (Array.isArray(obj)) {
      results.push({ path: currentPath, value: `Array[${obj.length}]`, type: 'array' });
      obj.forEach((item, index) => {
        results.push(...extractPaths(item, `${currentPath}[${index}]`));
      });
    } else if (typeof obj === 'object') {
      results.push({ path: currentPath, value: `Object{${Object.keys(obj).length}}`, type: 'object' });
      for (const [key, value] of Object.entries(obj)) {
        const safePath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? `.${key}` : `["${key}"]`;
        results.push(...extractPaths(value, `${currentPath}${safePath}`));
      }
    } else {
      results.push({ path: currentPath, value: String(obj), type: typeof obj });
    }

    return results;
  }

  function handleAnalyze() {
    setError(undefined);
    setPaths([]);

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      const allPaths = extractPaths(parsed);
      setPaths(allPaths);
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  const filtered = filter
    ? paths.filter((p) => p.path.toLowerCase().includes(filter.toLowerCase()) || p.value.toLowerCase().includes(filter.toLowerCase()))
    : paths;

  const copyText = filtered.map((p) => `${p.path} = ${p.value} (${p.type})`).join('\n');

  const typeColors: Record<string, string> = {
    string: 'text-green-600',
    number: 'text-blue-600',
    boolean: 'text-purple-600',
    null: 'text-gray-400',
    object: 'text-orange-600',
    array: 'text-cyan-600',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON data for {toolName}
        </label>
        <CodeEditor
          id={`${toolId}-input`}
          value={input}
          onChange={setInput}
          language="json"
          placeholder={'{\n  "user": {\n    "name": "John",\n    "age": 30,\n    "hobbies": ["reading", "coding"]\n  }\n}'}
          ariaLabel={`JSON input for ${toolName}`}
          height="h-40"
        />
      </InputArea>

      <button onClick={handleAnalyze} aria-label="Analyze JSON paths" className="btn-primary">
        Find Paths
      </button>

      <OutputArea hasContent={paths.length > 0}>
        {paths.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{filtered.length} paths found</span>
              <CopyToClipboard text={copyText} />
            </div>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter paths..."
              aria-label="Filter JSON paths"
              className="input-field text-sm"
            />
            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {filtered.slice(0, 200).map((p, i) => (
                <div key={i} className="px-3 py-2 hover:bg-gray-50 flex items-start gap-2">
                  <code className="text-xs font-mono text-gray-700 flex-1 break-all">{p.path}</code>
                  <span className={`text-xs font-mono ${typeColors[p.type] || 'text-gray-600'} flex-shrink-0 max-w-[200px] truncate`}>
                    {p.value}
                  </span>
                </div>
              ))}
            </div>
            {filtered.length > 200 && (
              <p className="text-xs text-gray-500 text-center">Showing first 200 of {filtered.length} paths</p>
            )}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
