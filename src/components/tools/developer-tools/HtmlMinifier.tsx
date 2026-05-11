'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HtmlMinifier - Remove comments, extra whitespace between tags, and collapse whitespace in HTML.
 * Shows size comparison between original and minified output.
 */
export default function HtmlMinifier({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<{ original: number; minified: number; saved: number; percent: string } | null>(null);

  function minifyHtml(html: string): string {
    let result = html;
    // Remove HTML comments
    result = result.replace(/<!--[\s\S]*?-->/g, '');
    // Remove whitespace between tags
    result = result.replace(/>\s+</g, '><');
    // Collapse multiple whitespace into single space
    result = result.replace(/\s{2,}/g, ' ');
    // Remove leading/trailing whitespace on each line then join
    result = result
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('');
    // Trim
    result = result.trim();
    return result;
  }

  function handleMinify() {
    if (!input.trim()) return;

    const result = minifyHtml(input);
    setOutput(result);

    const originalBytes = new Blob([input]).size;
    const minifiedBytes = new Blob([result]).size;
    const saved = originalBytes - minifiedBytes;
    const percent = originalBytes > 0 ? ((saved / originalBytes) * 100).toFixed(1) : '0';

    setStats({ original: originalBytes, minified: minifiedBytes, saved, percent });
  }

  return (
    <div className="space-y-5">
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          HTML Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your HTML code here..."
          aria-label="HTML input for minification"
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button
        onClick={handleMinify}
        aria-label="Minify HTML"
        className="btn-primary"
      >
        Minify HTML
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            {stats && (
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="px-2.5 py-1 bg-gray-100 rounded-md text-gray-600">
                  Original: <strong>{stats.original}</strong> bytes
                </span>
                <span className="px-2.5 py-1 bg-indigo-50 rounded-md text-indigo-700">
                  Minified: <strong>{stats.minified}</strong> bytes
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 rounded-md text-emerald-700">
                  Saved: <strong>{stats.saved}</strong> bytes ({stats.percent}%)
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Minified HTML</h3>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono p-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto break-all">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
