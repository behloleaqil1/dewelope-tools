'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EnvFileGenerator - Generate .env file content from key-value pairs with optional comments.
 */
export default function EnvFileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [entries, setEntries] = useState<{ key: string; value: string; comment: string }[]>([
    { key: '', value: '', comment: '' },
  ]);
  const [appName, setAppName] = useState('');
  const [output, setOutput] = useState('');

  const addEntry = () => {
    setEntries([...entries, { key: '', value: '', comment: '' }]);
  };

  const removeEntry = (index: number) => {
    if (entries.length === 1) return;
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: 'key' | 'value' | 'comment', val: string) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: val };
    setEntries(updated);
  };

  const generate = () => {
    const lines: string[] = [];

    if (appName.trim()) {
      lines.push(`# ${appName} Environment Variables`);
      lines.push(`# Generated on ${new Date().toISOString().split('T')[0]}`);
      lines.push('');
    }

    for (const entry of entries) {
      if (!entry.key.trim()) continue;
      if (entry.comment.trim()) {
        lines.push(`# ${entry.comment}`);
      }
      const key = entry.key.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
      const value = entry.value.includes(' ') || entry.value.includes('"') || entry.value.includes('#')
        ? `"${entry.value.replace(/"/g, '\\"')}"`
        : entry.value;
      lines.push(`${key}=${value}`);
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          App/Project Name (optional)
        </label>
        <input
          type="text"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          placeholder="My App"
          aria-label={`App name for ${toolName}`}
          className="input-field mb-4"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Environment Variables
        </label>
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start">
              <input
                type="text"
                value={entry.key}
                onChange={(e) => updateEntry(i, 'key', e.target.value)}
                placeholder="KEY_NAME"
                aria-label={`Variable key ${i + 1}`}
                className="input-field text-sm font-mono col-span-3"
              />
              <input
                type="text"
                value={entry.value}
                onChange={(e) => updateEntry(i, 'value', e.target.value)}
                placeholder="value"
                aria-label={`Variable value ${i + 1}`}
                className="input-field text-sm font-mono col-span-4"
              />
              <input
                type="text"
                value={entry.comment}
                onChange={(e) => updateEntry(i, 'comment', e.target.value)}
                placeholder="Comment (optional)"
                aria-label={`Variable comment ${i + 1}`}
                className="input-field text-sm col-span-4"
              />
              <button
                onClick={() => removeEntry(i)}
                aria-label={`Remove entry ${i + 1}`}
                className="col-span-1 px-2 py-2 text-red-500 hover:text-red-700 text-sm"
                disabled={entries.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button onClick={addEntry} className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded hover:bg-blue-50">
          + Add Variable
        </button>
      </InputArea>

      <button onClick={generate} aria-label="Generate .env file" className="btn-primary">
        Generate .env
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">.env File Content</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
