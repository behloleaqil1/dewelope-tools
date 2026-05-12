'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssSpecificityCalculator - Calculate CSS selector specificity score.
 * Breaks down selectors into inline, IDs, classes/attributes/pseudo-classes, and elements/pseudo-elements.
 */
export default function CssSpecificityCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    if (!input.trim()) { setOutput(''); return; }

    const lines = input.split('\n').filter((l) => l.trim());
    const results = lines.map((selector) => {
      const s = selector.trim();
      let a = 0; // IDs
      let b = 0; // classes, attributes, pseudo-classes
      let c = 0; // elements, pseudo-elements

      // Remove :not() wrapper but count its contents
      let cleaned = s.replace(/:not\(([^)]*)\)/g, (_, inner) => {
        return inner;
      });

      // Count IDs
      const ids = cleaned.match(/#[a-zA-Z_][\w-]*/g);
      if (ids) a = ids.length;

      // Remove IDs for further counting
      cleaned = cleaned.replace(/#[a-zA-Z_][\w-]*/g, '');

      // Count pseudo-elements (::before, ::after, etc.)
      const pseudoElements = cleaned.match(/::[a-zA-Z-]+/g);
      if (pseudoElements) c += pseudoElements.length;
      cleaned = cleaned.replace(/::[a-zA-Z-]+/g, '');

      // Count attribute selectors
      const attrs = cleaned.match(/\[[^\]]*\]/g);
      if (attrs) b += attrs.length;
      cleaned = cleaned.replace(/\[[^\]]*\]/g, '');

      // Count pseudo-classes (:hover, :focus, etc.)
      const pseudoClasses = cleaned.match(/:[a-zA-Z-]+(\([^)]*\))?/g);
      if (pseudoClasses) b += pseudoClasses.length;
      cleaned = cleaned.replace(/:[a-zA-Z-]+(\([^)]*\))?/g, '');

      // Count classes
      const classes = cleaned.match(/\.[a-zA-Z_][\w-]*/g);
      if (classes) b += classes.length;
      cleaned = cleaned.replace(/\.[a-zA-Z_][\w-]*/g, '');

      // Count elements (excluding * universal selector)
      const elements = cleaned.match(/(?:^|[\s>+~])([a-zA-Z][a-zA-Z0-9]*)/g);
      if (elements) c += elements.length;

      return `${s}\n  Specificity: (${a}, ${b}, ${c})\n  Score: ${a * 100 + b * 10 + c}\n  IDs: ${a} | Classes/Attrs/Pseudo-classes: ${b} | Elements/Pseudo-elements: ${c}`;
    });

    setOutput(results.join('\n\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">CSS Selectors (one per line)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"#header .nav a\n.container > .item:hover\ndiv.class#id::before"} aria-label={`Input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Specificity</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
