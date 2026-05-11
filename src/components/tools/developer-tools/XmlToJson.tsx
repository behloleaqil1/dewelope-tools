'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * XmlToJson - Converts XML data to JSON format.
 * Parses XML using DOMParser and recursively builds a JSON object.
 */
export default function XmlToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function xmlNodeToJson(node: Element): unknown {
    const obj: Record<string, unknown> = {};

    // Attributes
    if (node.attributes && node.attributes.length > 0) {
      const attrs: Record<string, string> = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        attrs[`@${attr.name}`] = attr.value;
      }
      Object.assign(obj, attrs);
    }

    // Child nodes
    const children = node.childNodes;
    if (children.length === 1 && children[0].nodeType === 3) {
      // Single text node
      const text = children[0].textContent?.trim() || '';
      if (Object.keys(obj).length > 0) {
        obj['#text'] = text;
        return obj;
      }
      return text;
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === 1) {
        const element = child as Element;
        const tagName = element.tagName;
        const childValue = xmlNodeToJson(element);

        if (obj[tagName] !== undefined) {
          if (!Array.isArray(obj[tagName])) {
            obj[tagName] = [obj[tagName]];
          }
          (obj[tagName] as unknown[]).push(childValue);
        } else {
          obj[tagName] = childValue;
        }
      } else if (child.nodeType === 3) {
        const text = child.textContent?.trim();
        if (text) {
          obj['#text'] = text;
        }
      }
    }

    return obj;
  }

  const convert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter XML to convert');
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input.trim(), 'application/xml');
      const parseError = doc.querySelector('parsererror');

      if (parseError) {
        setError('Invalid XML: ' + (parseError.textContent?.split('\n')[0] || 'Parse error'));
        return;
      }

      const root = doc.documentElement;
      const result = { [root.tagName]: xmlNodeToJson(root) };
      setOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      setError('Failed to parse XML: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          XML Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (error) setError(''); }}
          placeholder={'<root>\n  <item id="1">Hello</item>\n  <item id="2">World</item>\n</root>'}
          aria-label={`XML input for ${toolName}`}
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert XML to JSON" className="btn-primary">
        Convert to JSON
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">JSON Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
