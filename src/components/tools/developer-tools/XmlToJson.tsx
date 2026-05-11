'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function XmlToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const xmlNodeToJson = (node: Element): unknown => {
    const children = Array.from(node.children);
    if (children.length === 0) return node.textContent || '';
    const obj: Record<string, unknown> = {};
    children.forEach(child => {
      const key = child.tagName;
      const val = xmlNodeToJson(child);
      if (obj[key]) { obj[key] = Array.isArray(obj[key]) ? [...(obj[key] as unknown[]), val] : [obj[key], val]; }
      else { obj[key] = val; }
    });
    return obj;
  };

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      const error = doc.querySelector('parsererror');
      if (error) { setOutput('Error: Invalid XML input.'); return; }
      const result = xmlNodeToJson(doc.documentElement);
      setOutput(JSON.stringify({ [doc.documentElement.tagName]: result }, null, 2));
    } catch { setOutput('Error: Could not parse XML.'); }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">XML Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="<root><name>test</name></root>" aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to JSON</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
