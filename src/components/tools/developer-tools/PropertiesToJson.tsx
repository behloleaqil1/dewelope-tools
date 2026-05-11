'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PropertiesToJson - Converts Java .properties files to JSON format.
 * Handles key=value pairs, comments (#, !), and nested keys with dot notation.
 */
export default function PropertiesToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [nested, setNested] = useState(true);

  const convert = () => {
    if (!input.trim()) {
      setError('Please enter .properties content');
      setOutput('');
      return;
    }

    setError('');

    try {
      const lines = input.split('\n');
      const flat: Record<string, string> = {};

      let continuedLine = '';

      for (const rawLine of lines) {
        const line = continuedLine + rawLine.trimStart();
        continuedLine = '';

        // Handle line continuation with backslash
        if (line.endsWith('\\')) {
          continuedLine = line.slice(0, -1);
          continue;
        }

        // Skip empty lines and comments
        if (!line.trim() || line.startsWith('#') || line.startsWith('!')) continue;

        // Find separator (= or :)
        const sepMatch = line.match(/(?<!\\)[=:]/);
        if (!sepMatch || sepMatch.index === undefined) continue;

        const key = line.slice(0, sepMatch.index).trim();
        const value = line.slice(sepMatch.index + 1).trim();

        if (key) {
          flat[key] = value;
        }
      }

      let result: Record<string, unknown>;

      if (nested) {
        result = {};
        for (const [key, value] of Object.entries(flat)) {
          const parts = key.split('.');
          let current: Record<string, unknown> = result;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!(parts[i] in current) || typeof current[parts[i]] !== 'object') {
              current[parts[i]] = {};
            }
            current = current[parts[i]] as Record<string, unknown>;
          }
          current[parts[parts.length - 1]] = value;
        }
      } else {
        result = flat;
      }

      setOutput(JSON.stringify(result, null, 2));
    } catch {
      setError('Failed to parse properties content');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Paste .properties content
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          placeholder={"# Database config\ndb.host=localhost\ndb.port=5432\ndb.name=myapp\napp.name=My Application"}
          aria-label={`Properties input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <div className="flex items-center gap-2">
        <input
          id={`${toolId}-nested`}
          type="checkbox"
          checked={nested}
          onChange={(e) => setNested(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor={`${toolId}-nested`} className="text-sm text-gray-700">
          Nest dot-separated keys into objects
        </label>
      </div>

      <button onClick={convert} aria-label="Convert to JSON" className="btn-primary">
        Convert to JSON
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">JSON Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
