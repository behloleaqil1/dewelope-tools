'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * XpathTester - Tests XPath expressions against XML/HTML input and displays matching nodes.
 */
export default function XpathTester({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [xml, setXml] = useState('');
  const [xpath, setXpath] = useState('');
  const [results, setResults] = useState<string[] | null>(null);
  const [error, setError] = useState<string | undefined>();

  const evaluate = () => {
    setError(undefined);
    setResults(null);

    if (!xml.trim()) {
      setError('Please enter XML/HTML content');
      return;
    }
    if (!xpath.trim()) {
      setError('Please enter an XPath expression');
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');

      // Check for parse errors
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        setError('XML parse error: ' + parseError.textContent?.slice(0, 100));
        return;
      }

      const result = doc.evaluate(xpath, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const matches: string[] = [];

      for (let i = 0; i < result.snapshotLength; i++) {
        const node = result.snapshotItem(i);
        if (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            matches.push((node as Element).outerHTML);
          } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
            matches.push(`${(node as Attr).name}="${(node as Attr).value}"`);
          } else {
            matches.push(node.textContent || '');
          }
        }
      }

      setResults(matches);
    } catch (e) {
      setError('XPath evaluation error: ' + (e instanceof Error ? e.message : 'Invalid expression'));
    }
  };

  const copyText = results ? results.join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-xml`} className="block text-sm font-medium text-gray-700 mb-1">
          XML/HTML Input
        </label>
        <textarea
          id={`${toolId}-xml`}
          value={xml}
          onChange={(e) => setXml(e.target.value)}
          placeholder={'<bookstore>\n  <book category="fiction">\n    <title>The Great Gatsby</title>\n  </book>\n</bookstore>'}
          aria-label={`XML input for ${toolName}`}
          className="input-field h-40 resize-y font-mono text-sm"
        />
        <label htmlFor={`${toolId}-xpath`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          XPath Expression
        </label>
        <input
          id={`${toolId}-xpath`}
          type="text"
          value={xpath}
          onChange={(e) => setXpath(e.target.value)}
          placeholder="e.g. //book[@category='fiction']/title"
          aria-label="XPath expression"
          className="input-field font-mono text-sm"
        />
      </InputArea>

      <button onClick={evaluate} aria-label="Evaluate XPath" className="btn-primary">
        Evaluate XPath
      </button>

      <OutputArea hasContent={results !== null}>
        {results && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {results.length} match{results.length !== 1 ? 'es' : ''} found
              </div>
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((match, i) => (
                    <pre key={i} className="text-sm font-mono text-gray-800 bg-white p-2 rounded border border-gray-100 whitespace-pre-wrap break-all">
                      {match}
                    </pre>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No nodes matched the XPath expression.</div>
              )}
            </div>
            {results.length > 0 && <CopyToClipboard text={copyText} />}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
