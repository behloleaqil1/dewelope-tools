'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToXmlConverter - Convert JSON data to well-formed XML.
 */
export default function JsonToXmlConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [rootName, setRootName] = useState('root');
  const [indent, setIndent] = useState('2');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const jsonToXml = (obj: unknown, tagName: string, level: number, indentStr: string): string => {
    const pad = indentStr.repeat(level);

    if (obj === null || obj === undefined) {
      return `${pad}<${tagName}/>\n`;
    }
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return `${pad}<${tagName}>${String(obj)}</${tagName}>\n`;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => jsonToXml(item, tagName, level, indentStr)).join('');
    }
    if (typeof obj === 'object') {
      const entries = Object.entries(obj as Record<string, unknown>);
      const children = entries.map(([key, value]) => {
        const safeName = key.replace(/[^a-zA-Z0-9_-]/g, '_');
        return jsonToXml(value, safeName, level + 1, indentStr);
      }).join('');
      return `${pad}<${tagName}>\n${children}${pad}</${tagName}>\n`;
    }
    return `${pad}<${tagName}>${String(obj)}</${tagName}>\n`;
  };

  const convert = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter JSON.'); return; }

    try {
      const parsed = JSON.parse(input);
      const indentStr = ' '.repeat(parseInt(indent) || 2);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(parsed, rootName.trim() || 'root', 0, indentStr)}`;
      setResult(xml.trim());
    } catch {
      setError('Invalid JSON. Please check the input.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={'{\n  "name": "John",\n  "age": 30,\n  "items": [1, 2, 3]\n}'} rows={8} aria-label={`JSON input for ${toolName}`} className="input-field font-mono" />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">Root Element</label>
            <input id={`${toolId}-root`} type="text" value={rootName} onChange={(e) => setRootName(e.target.value)} placeholder="root" aria-label={`Root element for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-indent`} className="block text-sm font-medium text-gray-700 mb-1">Indent</label>
            <select id={`${toolId}-indent`} value={indent} onChange={(e) => setIndent(e.target.value)} aria-label="Indent size" className="input-field">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert JSON to XML">Convert</button>

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
