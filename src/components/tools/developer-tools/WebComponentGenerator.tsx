'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WebComponentGenerator - Generate vanilla Web Component (Custom Element) boilerplate code.
 * Creates a complete class extending HTMLElement with lifecycle callbacks.
 */
export default function WebComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tagName, setTagName] = useState('');
  const [attributes, setAttributes] = useState('');
  const [useShadowDom, setUseShadowDom] = useState(true);
  const [includeStyles, setIncludeStyles] = useState(true);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    setError('');
    setOutput('');

    const tag = tagName.trim().toLowerCase();
    if (!tag) {
      setError('Please enter a tag name');
      return;
    }
    if (!tag.includes('-')) {
      setError('Custom element names must contain a hyphen (e.g., my-component)');
      return;
    }
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(tag)) {
      setError('Invalid tag name. Use lowercase letters, numbers, and hyphens (e.g., my-widget)');
      return;
    }

    const className = tag.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    const attrs = attributes.trim() ? attributes.split(',').map(a => a.trim()).filter(Boolean) : [];

    let code = `class ${className} extends HTMLElement {\n`;

    if (attrs.length > 0) {
      code += `  static get observedAttributes() {\n`;
      code += `    return [${attrs.map(a => `'${a}'`).join(', ')}];\n`;
      code += `  }\n\n`;
    }

    code += `  constructor() {\n`;
    code += `    super();\n`;
    if (useShadowDom) {
      code += `    this.attachShadow({ mode: 'open' });\n`;
    }
    code += `  }\n\n`;

    code += `  connectedCallback() {\n`;
    code += `    this.render();\n`;
    code += `  }\n\n`;

    code += `  disconnectedCallback() {\n`;
    code += `    // Cleanup event listeners or observers here\n`;
    code += `  }\n\n`;

    if (attrs.length > 0) {
      code += `  attributeChangedCallback(name, oldValue, newValue) {\n`;
      code += `    if (oldValue !== newValue) {\n`;
      code += `      this.render();\n`;
      code += `    }\n`;
      code += `  }\n\n`;
    }

    code += `  render() {\n`;
    const target = useShadowDom ? 'this.shadowRoot' : 'this';
    if (includeStyles && useShadowDom) {
      code += `    ${target}.innerHTML = \`\n`;
      code += `      <style>\n`;
      code += `        :host {\n`;
      code += `          display: block;\n`;
      code += `          font-family: sans-serif;\n`;
      code += `        }\n`;
      code += `        .container {\n`;
      code += `          padding: 1rem;\n`;
      code += `          border: 1px solid #e5e7eb;\n`;
      code += `          border-radius: 0.5rem;\n`;
      code += `        }\n`;
      code += `      </style>\n`;
      code += `      <div class="container">\n`;
      code += `        <p>Hello from &lt;${tag}&gt;!</p>\n`;
      code += `      </div>\n`;
      code += `    \`;\n`;
    } else {
      code += `    ${target}.innerHTML = \`\n`;
      code += `      <div class="${tag}">\n`;
      code += `        <p>Hello from &lt;${tag}&gt;!</p>\n`;
      code += `      </div>\n`;
      code += `    \`;\n`;
    }
    code += `  }\n`;
    code += `}\n\n`;
    code += `customElements.define('${tag}', ${className});\n`;

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-tag`} className="block text-sm font-medium text-gray-700 mb-1">
          Tag Name (must contain a hyphen)
        </label>
        <input
          id={`${toolId}-tag`}
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="e.g. my-component"
          aria-label={`Tag name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-attrs`} className="block text-sm font-medium text-gray-700 mb-1">
          Observed Attributes (comma-separated, optional)
        </label>
        <input
          id={`${toolId}-attrs`}
          type="text"
          value={attributes}
          onChange={(e) => setAttributes(e.target.value)}
          placeholder="e.g. title, color, size"
          aria-label={`Attributes for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useShadowDom} onChange={(e) => setUseShadowDom(e.target.checked)} className="rounded" />
          Shadow DOM
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeStyles} onChange={(e) => setIncludeStyles(e.target.checked)} className="rounded" />
          Include Styles
        </label>
      </div>

      <button onClick={generate} aria-label="Generate web component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated Web Component</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
