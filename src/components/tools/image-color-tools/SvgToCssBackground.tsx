'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SvgToCssBackground - Convert SVG code to CSS background-image data URI.
 */
export default function SvgToCssBackground({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleConvert() {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter SVG code');
      return;
    }

    if (!input.trim().startsWith('<svg') && !input.trim().startsWith('<?xml')) {
      setError('Input does not appear to be valid SVG');
      setOutput('');
      return;
    }

    setError(undefined);

    // Encode SVG for use in CSS data URI
    const encoded = input
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/"/g, "'")
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/{/g, '%7B')
      .replace(/}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E');

    const cssValue = `background-image: url("data:image/svg+xml,${encoded}");`;
    setOutput(cssValue);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          SVG Code
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(undefined); }}
          placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
          aria-label={`SVG input for ${toolName}`}
          className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </InputArea>

      <button
        onClick={handleConvert}
        aria-label="Convert SVG to CSS"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Convert to CSS
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSS Background Property</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-3 bg-gray-50 rounded-lg break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
