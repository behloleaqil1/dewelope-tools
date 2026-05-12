'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PhpArrayToJson - Convert PHP array syntax to JSON format.
 */
export default function PhpArrayToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function convert() {
    setError(undefined);
    setOutput('');
    if (!input.trim()) { setError('Please enter PHP array syntax'); return; }

    try {
      let json = input.trim();
      // Remove PHP array wrapper
      json = json.replace(/^<\?php\s*/i, '').replace(/\?>$/, '').replace(/^\$\w+\s*=\s*/, '').replace(/;$/, '');
      // Convert array() to []
      json = json.replace(/array\s*\(/g, '[').replace(/\)/g, ']');
      // Convert => to :
      json = json.replace(/=>/g, ':');
      // Convert single quotes to double quotes for keys/values
      json = json.replace(/'([^']*?)'/g, '"$1"');
      // Try parsing
      const parsed = JSON.parse(json);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setError('Could not parse PHP array. Ensure valid PHP array syntax.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">PHP Array for {toolName}</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="['key' => 'value', 'name' => 'test']" aria-label="PHP array input" className="input-field h-40 resize-y font-mono" />
      </InputArea>

      <button onClick={convert} aria-label="Convert PHP array to JSON" className="btn-primary">Convert to JSON</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
