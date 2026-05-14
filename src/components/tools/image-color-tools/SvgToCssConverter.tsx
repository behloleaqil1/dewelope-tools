'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SvgToCssConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const encoded = encodeURIComponent(input.trim())
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    const dataUri = `url("data:image/svg+xml,${encoded}")`;
    const css = `.element {\n  background-image: ${dataUri};\n  background-repeat: no-repeat;\n  background-size: contain;\n}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">SVG Markup</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>' aria-label={`SVG markup for ${toolName}`} className="input-field h-36 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to CSS</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
