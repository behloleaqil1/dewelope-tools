'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonValidator - Validates JSON and reports errors with line/position info.
 */
export default function JsonValidator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ valid: boolean; message: string; details?: string } | null>(null);

  function validate() {
    if (!input.trim()) {
      setResult({ valid: false, message: 'Please enter JSON to validate' });
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const type = Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' ? 'Object' : typeof parsed;
      const size = Array.isArray(parsed) ? `${parsed.length} items` : typeof parsed === 'object' && parsed !== null ? `${Object.keys(parsed).length} keys` : '';
      setResult({ valid: true, message: `Valid JSON (${type}${size ? ': ' + size : ''})`, details: JSON.stringify(parsed, null, 2).slice(0, 500) });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setResult({ valid: false, message: msg });
    }
  }

  const copyText = result ? result.message : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON to validate for {toolName}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "test", "value": 123}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={validate} aria-label="Validate JSON" className="btn-primary">Validate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                <span className={`text-xl ${result.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {result.valid ? '✓' : '✗'}
                </span>
                <span className={`text-sm font-medium ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </span>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
