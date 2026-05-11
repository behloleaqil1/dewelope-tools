'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssContainGenerator - Generate CSS contain property for performance optimization.
 * Supports layout, paint, size, style, and content containment values.
 */
export default function CssContainGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [layout, setLayout] = useState(false);
  const [paint, setPaint] = useState(false);
  const [size, setSize] = useState(false);
  const [style, setStyle] = useState(false);
  const [useStrict, setUseStrict] = useState(false);
  const [useContent, setUseContent] = useState(false);
  const [selector, setSelector] = useState('.container');
  const [output, setOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      let containValue = '';

      if (useStrict) {
        containValue = 'strict';
      } else if (useContent) {
        containValue = 'content';
      } else {
        const parts: string[] = [];
        if (layout) parts.push('layout');
        if (paint) parts.push('paint');
        if (size) parts.push('size');
        if (style) parts.push('style');
        containValue = parts.join(' ') || 'none';
      }

      const sel = selector.trim() || '.container';
      const css = `${sel} {\n  contain: ${containValue};\n}`;
      setOutput(css);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [layout, paint, size, style, useStrict, useContent, selector]);

  const descriptions: Record<string, string> = {
    layout: 'Element layout is independent of the rest of the page',
    paint: 'Element contents are not displayed outside its bounds',
    size: 'Element can be sized without examining its children',
    style: 'Counters and quotes are scoped to the element',
    strict: 'Equivalent to layout + paint + size (maximum containment)',
    content: 'Equivalent to layout + paint (no size containment)',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-selector`} className="block text-sm font-medium text-gray-700 mb-1">
          CSS Selector
        </label>
        <input
          id={`${toolId}-selector`}
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder=".container"
          aria-label={`CSS selector for ${toolName}`}
          className="input-field mb-3"
        />

        <p className="text-sm font-medium text-gray-700 mb-2">Containment Options</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={useStrict} onChange={(e) => { setUseStrict(e.target.checked); if (e.target.checked) setUseContent(false); }} className="rounded" />
            <span className="font-medium">strict</span> — {descriptions.strict}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={useContent} onChange={(e) => { setUseContent(e.target.checked); if (e.target.checked) setUseStrict(false); }} className="rounded" />
            <span className="font-medium">content</span> — {descriptions.content}
          </label>
          <hr className="my-2" />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={layout} onChange={(e) => setLayout(e.target.checked)} disabled={useStrict || useContent} className="rounded" />
            <span className="font-medium">layout</span> — {descriptions.layout}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={paint} onChange={(e) => setPaint(e.target.checked)} disabled={useStrict || useContent} className="rounded" />
            <span className="font-medium">paint</span> — {descriptions.paint}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={size} onChange={(e) => setSize(e.target.checked)} disabled={useStrict || useContent} className="rounded" />
            <span className="font-medium">size</span> — {descriptions.size}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={style} onChange={(e) => setStyle(e.target.checked)} disabled={useStrict || useContent} className="rounded" />
            <span className="font-medium">style</span> — {descriptions.style}
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
