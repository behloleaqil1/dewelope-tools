'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IniToJson - Converts INI configuration files to JSON format.
 * Supports sections, key=value pairs, and comments.
 */
export default function IniToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setError('Please enter INI content to convert');
      setOutput('');
      return;
    }

    try {
      const result: Record<string, Record<string, string> | string> = {};
      let currentSection = '';
      const lines = input.split(/\r?\n/);

      for (const rawLine of lines) {
        const line = rawLine.trim();

        // Skip empty lines and comments
        if (!line || line.startsWith(';') || line.startsWith('#')) continue;

        // Section header
        const sectionMatch = line.match(/^\[(.+)\]$/);
        if (sectionMatch) {
          currentSection = sectionMatch[1].trim();
          if (!result[currentSection]) {
            result[currentSection] = {};
          }
          continue;
        }

        // Key=value pair
        const eqIndex = line.indexOf('=');
        if (eqIndex > 0) {
          const key = line.substring(0, eqIndex).trim();
          let value = line.substring(eqIndex + 1).trim();

          // Remove surrounding quotes
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }

          if (currentSection) {
            (result[currentSection] as Record<string, string>)[key] = value;
          } else {
            result[key] = value;
          }
        }
      }

      setOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch {
      setError('Failed to parse INI content. Please check the format.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          INI Content
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          placeholder={`[database]\nhost = localhost\nport = 3306\nname = mydb\n\n[server]\nport = 8080\ndebug = true`}
          aria-label={`INI input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert INI to JSON" className="btn-primary">
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
