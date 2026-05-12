'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RemoveHtmlComments - Remove HTML/XML comments from code.
 */
export default function RemoveHtmlComments({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function removeComments() {
    if (!input.trim()) { setOutput(''); return; }
    // Remove <!-- ... --> comments (including multiline)
    const result = input.replace(/<!--[\s\S]*?-->/g, '');
    // Clean up extra blank lines left behind
    const cleaned = result.replace(/\n{3,}/g, '\n\n').trim();
    setOutput(cleaned);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">HTML/XML Code for {toolName}</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="<!-- This is a comment -->\n<div>Content</div>" aria-label="HTML input to remove comments from" className="input-field h-48 resize-y font-mono" />
      </InputArea>

      <button onClick={removeComments} aria-label="Remove HTML comments" className="btn-primary">Remove Comments</button>

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
