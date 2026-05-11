'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { minifyJs } from '@/lib/developer-tools';

/**
 * JsMinifier - Basic JavaScript minification.
 */
export default function JsMinifier({ toolId }: ToolEngineProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('');

  function handleMinify() {
    if (!input.trim()) return;
    const result = minifyJs(input);
    setOutput(result);
    const saved = input.length - result.length;
    const percent = input.length > 0 ? ((saved / input.length) * 100).toFixed(1) : '0';
    setStats(`Original: ${input.length} chars → Minified: ${result.length} chars (saved ${saved} chars, ${percent}%)`);
  }

  return (
    <div className="space-y-4">
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JavaScript Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JavaScript code here..."
          aria-label="JavaScript input for minification"
          className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </InputArea>

      <button
        onClick={handleMinify}
        aria-label="Minify JavaScript"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Minify JavaScript
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            {stats && <p className="text-xs text-gray-500">{stats}</p>}
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono p-3 bg-gray-50 rounded-lg overflow-x-auto break-all">
              {output}
            </pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
