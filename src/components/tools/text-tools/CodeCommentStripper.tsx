'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CodeCommentStripper - Remove comments from source code (JS, Python, CSS, HTML).
 */
export default function CodeCommentStripper({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'css' | 'html'>('javascript');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const strip = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter source code.'); return; }

    let output = input;

    switch (language) {
      case 'javascript':
        // Remove multi-line comments
        output = output.replace(/\/\*[\s\S]*?\*\//g, '');
        // Remove single-line comments (but not URLs)
        output = output.replace(/(?<!:)\/\/.*$/gm, '');
        break;
      case 'python':
        // Remove docstrings
        output = output.replace(/"""[\s\S]*?"""/g, '');
        output = output.replace(/'''[\s\S]*?'''/g, '');
        // Remove single-line comments
        output = output.replace(/#.*$/gm, '');
        break;
      case 'css':
        output = output.replace(/\/\*[\s\S]*?\*\//g, '');
        break;
      case 'html':
        output = output.replace(/<!--[\s\S]*?-->/g, '');
        break;
    }

    // Remove empty lines that resulted from comment removal
    output = output.replace(/^\s*\n/gm, '\n').replace(/\n{3,}/g, '\n\n').trim();
    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="mb-3">
          <label htmlFor={`${toolId}-lang`} className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select id={`${toolId}-lang`} value={language} onChange={(e) => setLanguage(e.target.value as typeof language)} aria-label={`Language for ${toolName}`} className="input-field w-40">
            <option value="javascript">JavaScript/TypeScript</option>
            <option value="python">Python</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Source Code</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your code here..." rows={8} aria-label={`Source code for ${toolName}`} className="input-field font-mono" />
      </InputArea>

      <button onClick={strip} className="btn-primary" aria-label="Strip comments">Strip Comments</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono max-h-96">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
