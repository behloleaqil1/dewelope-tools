'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * XmlToJsonConverter - Convert XML data to JSON format.
 */
export default function XmlToJsonConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const parseXmlNode = (xml: string): unknown => {
    const obj: Record<string, unknown> = {};
    // Match tags
    const tagRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
    const selfClosingRegex = /<(\w+)([^>]*)\/>/g;
    let match;
    let hasChildren = false;

    // Self-closing tags
    while ((match = selfClosingRegex.exec(xml)) !== null) {
      hasChildren = true;
      const tagName = match[1];
      const attrs = parseAttributes(match[2]);
      obj[tagName] = Object.keys(attrs).length > 0 ? attrs : null;
    }

    // Regular tags
    while ((match = tagRegex.exec(xml)) !== null) {
      hasChildren = true;
      const tagName = match[1];
      const attrs = parseAttributes(match[2]);
      const content = match[3].trim();

      if (content.includes('<')) {
        const childObj = parseXmlNode(content);
        if (Object.keys(attrs).length > 0) {
          obj[tagName] = { ...attrs, ...(childObj as Record<string, unknown>) };
        } else {
          obj[tagName] = childObj;
        }
      } else {
        if (Object.keys(attrs).length > 0) {
          obj[tagName] = { ...attrs, '#text': content || '' };
        } else {
          obj[tagName] = content;
        }
      }
    }

    if (!hasChildren) return xml.trim();
    return obj;
  };

  const parseAttributes = (attrStr: string): Record<string, string> => {
    const attrs: Record<string, string> = {};
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let match;
    while ((match = attrRegex.exec(attrStr)) !== null) {
      attrs[`@${match[1]}`] = match[2];
    }
    return attrs;
  };

  const convert = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter XML.'); return; }

    try {
      const cleaned = input.replace(/<\?xml[^>]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();
      const parsed = parseXmlNode(cleaned);
      setResult(JSON.stringify(parsed, null, 2));
    } catch {
      setError('Failed to parse XML. Please check the input.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">XML Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={'<root>\n  <item id="1">\n    <name>Test</name>\n  </item>\n</root>'} rows={8} aria-label={`XML input for ${toolName}`} className="input-field font-mono" />
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert XML to JSON">Convert</button>

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
