'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * StencilComponentGenerator - Generate Stencil.js web component boilerplate code.
 * Creates a complete component with decorator, props, state, and render method.
 */
export default function StencilComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [tagName, setTagName] = useState('');
  const [props, setProps] = useState('');
  const [shadow, setShadow] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = componentName.trim() || 'MyComponent';
    const tag = tagName.trim() || name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    const propList = props.split(',').map(p => p.trim()).filter(Boolean);

    const propsCode = propList.map(p => {
      const [propName, propType] = p.split(':').map(s => s.trim());
      const type = propType || 'string';
      return `  @Prop() ${propName}: ${type};`;
    }).join('\n');

    const code = `import { Component, Prop, State, h } from '@stencil/core';

@Component({
  tag: '${tag}',
  styleUrl: '${tag}.css',
  shadow: ${shadow},
})
export class ${name} {
${propsCode ? propsCode + '\n' : ''}
  @State() private isReady: boolean = false;

  componentWillLoad() {
    this.isReady = true;
  }

  render() {
    return (
      <div class="${tag}">
        <slot></slot>
      </div>
    );
  }
}
`;

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Component Name (PascalCase)
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="e.g. MyButton"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-tag`} className="block text-sm font-medium text-gray-700 mb-1">
          Tag Name (optional, auto-generated from name)
        </label>
        <input
          id={`${toolId}-tag`}
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="e.g. my-button"
          aria-label={`Tag name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-props`} className="block text-sm font-medium text-gray-700 mb-1">
          Props (comma-separated, name:type)
        </label>
        <input
          id={`${toolId}-props`}
          type="text"
          value={props}
          onChange={(e) => setProps(e.target.value)}
          placeholder="e.g. label:string, disabled:boolean, size:number"
          aria-label={`Props for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="flex items-center gap-2">
        <input
          id={`${toolId}-shadow`}
          type="checkbox"
          checked={shadow}
          onChange={(e) => setShadow(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor={`${toolId}-shadow`} className="text-sm text-gray-700">Shadow DOM</label>
      </div>

      <button onClick={generate} aria-label="Generate Stencil component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Stencil Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
