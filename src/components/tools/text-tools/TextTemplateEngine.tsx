'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextTemplateEngine - Replace {{variable}} placeholders using key-value pairs.
 */
export default function TextTemplateEngine({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [template, setTemplate] = useState('');
  const [variables, setVariables] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const process = () => {
    setError('');
    setResult('');
    if (!template.trim()) { setError('Please enter a template.'); return; }

    const vars: Record<string, string> = {};
    variables.split('\n').filter((l) => l.trim()).forEach((line) => {
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim();
        const value = line.slice(eqIdx + 1).trim();
        vars[key] = value;
      }
    });

    let output = template;
    output = output.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return vars[key] !== undefined ? vars[key] : match;
    });

    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div>
          <label htmlFor={`${toolId}-template`} className="block text-sm font-medium text-gray-700 mb-1">Template</label>
          <textarea id={`${toolId}-template`} value={template} onChange={(e) => setTemplate(e.target.value)} placeholder={"Hello {{name}}, welcome to {{company}}!"} rows={5} aria-label={`Template for ${toolName}`} className="input-field font-mono" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-vars`} className="block text-sm font-medium text-gray-700 mb-1">Variables (key=value per line)</label>
          <textarea id={`${toolId}-vars`} value={variables} onChange={(e) => setVariables(e.target.value)} placeholder={"name=John\ncompany=Acme Corp"} rows={4} aria-label={`Variables for ${toolName}`} className="input-field font-mono" />
        </div>
      </InputArea>

      <button onClick={process} className="btn-primary" aria-label="Apply template variables">Apply</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
