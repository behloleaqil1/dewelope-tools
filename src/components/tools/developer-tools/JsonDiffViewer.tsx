'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface DiffEntry {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: string;
  newValue?: string;
}

/**
 * JsonDiffViewer - Compares two JSON objects and shows their differences.
 */
export default function JsonDiffViewer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [leftJson, setLeftJson] = useState('');
  const [rightJson, setRightJson] = useState('');
  const [diffs, setDiffs] = useState<DiffEntry[]>([]);
  const [error, setError] = useState('');

  const findDiffs = (obj1: unknown, obj2: unknown, path: string = ''): DiffEntry[] => {
    const results: DiffEntry[] = [];

    if (typeof obj1 !== typeof obj2 || Array.isArray(obj1) !== Array.isArray(obj2)) {
      results.push({ path: path || '(root)', type: 'changed', oldValue: JSON.stringify(obj1), newValue: JSON.stringify(obj2) });
      return results;
    }

    if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        results.push({ path: path || '(root)', type: 'changed', oldValue: JSON.stringify(obj1), newValue: JSON.stringify(obj2) });
      }
      return results;
    }

    const o1 = obj1 as Record<string, unknown>;
    const o2 = obj2 as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(o1), ...Object.keys(o2)]);

    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in o1)) {
        results.push({ path: currentPath, type: 'added', newValue: JSON.stringify(o2[key]) });
      } else if (!(key in o2)) {
        results.push({ path: currentPath, type: 'removed', oldValue: JSON.stringify(o1[key]) });
      } else {
        results.push(...findDiffs(o1[key], o2[key], currentPath));
      }
    }

    return results;
  };

  const compare = () => {
    setError('');
    setDiffs([]);

    try {
      const left = JSON.parse(leftJson);
      const right = JSON.parse(rightJson);
      const differences = findDiffs(left, right);
      setDiffs(differences);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const copyText = diffs.length > 0
    ? diffs.map((d) => {
        if (d.type === 'added') return `+ ${d.path}: ${d.newValue}`;
        if (d.type === 'removed') return `- ${d.path}: ${d.oldValue}`;
        return `~ ${d.path}: ${d.oldValue} → ${d.newValue}`;
      }).join('\n')
    : 'No differences found';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-left`} className="block text-sm font-medium text-gray-700 mb-1">Original JSON</label>
          <textarea id={`${toolId}-left`} value={leftJson} onChange={(e) => setLeftJson(e.target.value)} placeholder='{"key": "value"}' aria-label={`Original JSON for ${toolName}`} className="input-field h-48 resize-y font-mono" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-right`} className="block text-sm font-medium text-gray-700 mb-1">Modified JSON</label>
          <textarea id={`${toolId}-right`} value={rightJson} onChange={(e) => setRightJson(e.target.value)} placeholder='{"key": "new value"}' aria-label={`Modified JSON for ${toolName}`} className="input-field h-48 resize-y font-mono" />
        </InputArea>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button onClick={compare} aria-label="Compare JSON objects" className="btn-primary">
        Compare
      </button>

      <OutputArea hasContent={diffs.length > 0 || (leftJson !== '' && rightJson !== '' && !error)}>
        {diffs.length === 0 && leftJson && rightJson && !error ? (
          <p className="text-green-600 font-medium">No differences found — the JSON objects are identical.</p>
        ) : diffs.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">{diffs.length} difference{diffs.length !== 1 ? 's' : ''} found:</p>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {diffs.map((d, i) => (
                <div key={i} className={`text-sm p-2 rounded border ${d.type === 'added' ? 'bg-green-50 border-green-200' : d.type === 'removed' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <span className="font-mono font-bold">{d.type === 'added' ? '+' : d.type === 'removed' ? '-' : '~'}</span>{' '}
                  <span className="font-mono text-gray-700">{d.path}</span>
                  {d.type === 'changed' && <span className="text-gray-500">: {d.oldValue} → {d.newValue}</span>}
                  {d.type === 'added' && <span className="text-green-700">: {d.newValue}</span>}
                  {d.type === 'removed' && <span className="text-red-700">: {d.oldValue}</span>}
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        ) : null}
      </OutputArea>
    </div>
  );
}
