'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LitElementGenerator - Generate Lit element component boilerplate code.
 * Creates a complete LitElement class with reactive properties and template.
 */
export default function LitElementGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tagName, setTagName] = useState('');
  const [properties, setProperties] = useState('');
  const [useTypeScript, setUseTypeScript] = useState(true);
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
      setError('Custom element names must contain a hyphen (e.g., my-element)');
      return;
    }
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(tag)) {
      setError('Invalid tag name. Use lowercase letters, numbers, and hyphens');
      return;
    }

    const className = tag.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    const props = properties.trim() ? properties.split(',').map(p => p.trim()).filter(Boolean) : [];

    let code = '';

    if (useTypeScript) {
      code += `import { LitElement, css, html } from 'lit';\n`;
      code += `import { customElement, property } from 'lit/decorators.js';\n\n`;
      code += `@customElement('${tag}')\n`;
      code += `export class ${className} extends LitElement {\n`;

      if (includeStyles) {
        code += `  static styles = css\`\n`;
        code += `    :host {\n`;
        code += `      display: block;\n`;
        code += `      padding: 1rem;\n`;
        code += `      font-family: sans-serif;\n`;
        code += `    }\n`;
        code += `    .container {\n`;
        code += `      border: 1px solid #e5e7eb;\n`;
        code += `      border-radius: 0.5rem;\n`;
        code += `      padding: 1rem;\n`;
        code += `    }\n`;
        code += `  \`;\n\n`;
      }

      for (const prop of props) {
        code += `  @property({ type: String })\n`;
        code += `  ${prop} = '';\n\n`;
      }

      code += `  render() {\n`;
      code += `    return html\`\n`;
      code += `      <div class="container">\n`;
      code += `        <h2>\${this.localName}</h2>\n`;
      if (props.length > 0) {
        for (const prop of props) {
          code += `        <p>${prop}: \${this.${prop}}</p>\n`;
        }
      } else {
        code += `        <p>Hello from ${tag}!</p>\n`;
      }
      code += `      </div>\n`;
      code += `    \`;\n`;
      code += `  }\n`;
      code += `}\n\n`;
      code += `declare global {\n`;
      code += `  interface HTMLElementTagNameMap {\n`;
      code += `    '${tag}': ${className};\n`;
      code += `  }\n`;
      code += `}\n`;
    } else {
      code += `import { LitElement, css, html } from 'lit';\n\n`;
      code += `export class ${className} extends LitElement {\n`;
      code += `  static properties = {\n`;
      for (const prop of props) {
        code += `    ${prop}: { type: String },\n`;
      }
      code += `  };\n\n`;

      if (includeStyles) {
        code += `  static styles = css\`\n`;
        code += `    :host {\n`;
        code += `      display: block;\n`;
        code += `      padding: 1rem;\n`;
        code += `      font-family: sans-serif;\n`;
        code += `    }\n`;
        code += `    .container {\n`;
        code += `      border: 1px solid #e5e7eb;\n`;
        code += `      border-radius: 0.5rem;\n`;
        code += `      padding: 1rem;\n`;
        code += `    }\n`;
        code += `  \`;\n\n`;
      }

      code += `  constructor() {\n`;
      code += `    super();\n`;
      for (const prop of props) {
        code += `    this.${prop} = '';\n`;
      }
      code += `  }\n\n`;

      code += `  render() {\n`;
      code += `    return html\`\n`;
      code += `      <div class="container">\n`;
      code += `        <h2>\${this.localName}</h2>\n`;
      if (props.length > 0) {
        for (const prop of props) {
          code += `        <p>${prop}: \${this.${prop}}</p>\n`;
        }
      } else {
        code += `        <p>Hello from ${tag}!</p>\n`;
      }
      code += `      </div>\n`;
      code += `    \`;\n`;
      code += `  }\n`;
      code += `}\n\n`;
      code += `customElements.define('${tag}', ${className});\n`;
    }

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
          placeholder="e.g. my-element"
          aria-label={`Tag name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-props`} className="block text-sm font-medium text-gray-700 mb-1">
          Reactive Properties (comma-separated, optional)
        </label>
        <input
          id={`${toolId}-props`}
          type="text"
          value={properties}
          onChange={(e) => setProperties(e.target.value)}
          placeholder="e.g. name, count, active"
          aria-label={`Properties for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useTypeScript} onChange={(e) => setUseTypeScript(e.target.checked)} className="rounded" />
          TypeScript (decorators)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeStyles} onChange={(e) => setIncludeStyles(e.target.checked)} className="rounded" />
          Include Styles
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Lit element" className="btn-primary">
        Generate Element
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated Lit Element</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
