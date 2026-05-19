'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StringEscapeTool - Escape/unescape strings for JSON, HTML, URL, regex, SQL.
 */
export default function StringEscapeTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [context, setContext] = useState<'json' | 'html' | 'url' | 'regex' | 'sql'>('json');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const process = () => {
    setError('');
    setResult('');
    if (!input) { setError('Please enter text.'); return; }

    if (mode === 'escape') {
      switch (context) {
        case 'json': setResult(JSON.stringify(input).slice(1, -1)); break;
        case 'html': setResult(input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')); break;
        case 'url': setResult(encodeURIComponent(input)); break;
        case 'regex': setResult(input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); break;
        case 'sql': setResult(input.replace(/'/g, "''").replace(/\\/g, '\\\\')); break;
      }
    } else {
      switch (context) {
        case 'json': try { setResult(JSON.parse(`"${input}"`)); } catch { setResult(input.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\')); } break;
        case 'html': setResult(input.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")); break;
        case 'url': try { setResult(decodeURIComponent(input)); } catch { setError('Invalid URL encoding.'); } break;
        case 'regex': setResult(input.replace(/\\([.*+?^${}()|[\]\\])/g, '$1')); break;
        case 'sql': setResult(input.replace(/''/g, "'").replace(/\\\\/g, '\\')); break;
      }
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex flex-wrap gap-2 mb-2">
        {(['json', 'html', 'url', 'regex', 'sql'] as const).map((c) => (
          <button key={c} onClick={() => setContext(c)} className={`px-3 py-1.5 rounded text-sm font-medium uppercase ${context === c ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} aria-label={`${c} context`}>{c}</button>
        ))}
      </div>

      <InputArea error={error}>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setMode('escape')} className={`px-4 py-2 rounded text-sm font-medium ${mode === 'escape' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`} aria-label="Escape mode">Escape</button>
          <button onClick={() => setMode('unescape')} className={`px-4 py-2 rounded text-sm font-medium ${mode === 'unescape' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`} aria-label="Unescape mode">Unescape</button>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to escape or unescape..." rows={5} aria-label={`Input for ${toolName}`} className="input-field font-mono" />
      </InputArea>

      <button onClick={process} className="btn-primary" aria-label={`${mode} string`}>{mode === 'escape' ? 'Escape' : 'Unescape'}</button>

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
