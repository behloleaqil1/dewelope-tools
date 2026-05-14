'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function FontPairingTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [heading, setHeading] = useState('Georgia');
  const [body, setBody] = useState('Arial');
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog');
  const [output, setOutput] = useState('');

  const pairings = [
    { heading: 'Georgia', body: 'Verdana', style: 'Classic' },
    { heading: 'Palatino', body: 'Helvetica', style: 'Elegant' },
    { heading: 'Impact', body: 'Georgia', style: 'Bold' },
    { heading: 'Trebuchet MS', body: 'Lucida Sans', style: 'Modern' },
    { heading: 'Courier New', body: 'Georgia', style: 'Technical' },
    { heading: 'Times New Roman', body: 'Arial', style: 'Traditional' },
  ];

  const generate = () => {
    const css = `/* Font Pairing */\nh1, h2, h3 {\n  font-family: '${heading}', serif;\n}\n\nbody, p {\n  font-family: '${body}', sans-serif;\n}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-heading`} className="block text-sm font-medium text-gray-700 mb-1">Heading Font</label>
        <select id={`${toolId}-heading`} value={heading} onChange={(e) => setHeading(e.target.value)} aria-label={`Heading font for ${toolName}`} className="input-field">
          <option>Georgia</option><option>Palatino</option><option>Times New Roman</option>
          <option>Impact</option><option>Trebuchet MS</option><option>Courier New</option>
          <option>Arial</option><option>Verdana</option><option>Helvetica</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-body`} className="block text-sm font-medium text-gray-700 mb-1">Body Font</label>
        <select id={`${toolId}-body`} value={body} onChange={(e) => setBody(e.target.value)} aria-label={`Body font for ${toolName}`} className="input-field">
          <option>Arial</option><option>Verdana</option><option>Helvetica</option>
          <option>Georgia</option><option>Lucida Sans</option><option>Trebuchet MS</option>
          <option>Courier New</option><option>Times New Roman</option>
        </select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-sample`} className="block text-sm font-medium text-gray-700 mb-1">Sample Text</label>
        <input id={`${toolId}-sample`} type="text" value={sampleText} onChange={(e) => setSampleText(e.target.value)} aria-label={`Sample text for ${toolName}`} className="input-field" />
      </InputArea>
      {/* Preview */}
      <div className="border rounded-lg p-6 bg-white space-y-2">
        <h2 style={{ fontFamily: heading }} className="text-2xl font-bold">{sampleText}</h2>
        <p style={{ fontFamily: body }} className="text-base text-gray-600">{sampleText}</p>
      </div>
      {/* Suggested pairings */}
      <div className="text-sm text-gray-600">
        <p className="font-medium mb-1">Suggested Pairings:</p>
        {pairings.map((p, i) => (
          <button key={i} onClick={() => { setHeading(p.heading); setBody(p.body); }} className="mr-2 mb-1 px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200" aria-label={`Apply ${p.style} pairing`}>{p.style}: {p.heading} + {p.body}</button>
        ))}
      </div>
      <button onClick={generate} className="btn-primary">Generate CSS</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
