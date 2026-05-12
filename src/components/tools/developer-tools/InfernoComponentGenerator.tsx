'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * InfernoComponentGenerator - Generates Inferno.js component boilerplate code.
 * Supports functional and class components with optional lifecycle methods and state.
 */
export default function InfernoComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [componentType, setComponentType] = useState<'functional' | 'class'>('functional');
  const [withState, setWithState] = useState(false);
  const [withLifecycle, setWithLifecycle] = useState(false);
  const [withProps, setWithProps] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const generate = () => {
    const name = componentName.trim();
    if (!name) {
      setError('Please enter a component name');
      setOutput('');
      return;
    }
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
      setError('Component name must start with uppercase and contain only letters/numbers');
      setOutput('');
      return;
    }
    setError(undefined);

    let code = '';

    if (componentType === 'functional') {
      code += `import { Component } from 'inferno';\n`;
      if (withState) {
        code += `import { useState } from 'inferno-hooks';\n`;
      }
      code += `\n`;
      if (withProps) {
        code += `interface ${name}Props {\n  title?: string;\n  children?: any;\n}\n\n`;
      }
      code += `function ${name}(${withProps ? `props: ${name}Props` : ''}) {\n`;
      if (withState) {
        code += `  const [count, setCount] = useState(0);\n\n`;
      }
      code += `  return (\n    <div className="${name.toLowerCase()}">\n`;
      code += `      <h2>${withProps ? '{props.title || "' + name + '"}' : `"${name}"`}</h2>\n`;
      if (withState) {
        code += `      <p>Count: {count}</p>\n`;
        code += `      <button onClick={() => setCount(count + 1)}>Increment</button>\n`;
      }
      if (withProps) {
        code += `      {props.children}\n`;
      }
      code += `    </div>\n  );\n}\n\nexport default ${name};\n`;
    } else {
      code += `import { Component } from 'inferno';\n\n`;
      if (withProps) {
        code += `interface ${name}Props {\n  title?: string;\n  children?: any;\n}\n\n`;
      }
      if (withState) {
        code += `interface ${name}State {\n  count: number;\n}\n\n`;
      }
      code += `class ${name} extends Component<${withProps ? `${name}Props` : 'any'}${withState ? `, ${name}State` : ''}> {\n`;
      if (withState) {
        code += `  state = {\n    count: 0,\n  };\n\n`;
      }
      if (withLifecycle) {
        code += `  componentDidMount() {\n    // Component mounted\n  }\n\n`;
        code += `  componentWillUnmount() {\n    // Cleanup\n  }\n\n`;
        code += `  shouldComponentUpdate(nextProps: ${withProps ? `${name}Props` : 'any'}, nextState: ${withState ? `${name}State` : 'any'}) {\n    return true;\n  }\n\n`;
      }
      code += `  render() {\n    return (\n      <div className="${name.toLowerCase()}">\n`;
      code += `        <h2>${withProps ? '{this.props.title || "' + name + '"}' : `"${name}"`}</h2>\n`;
      if (withState) {
        code += `        <p>Count: {this.state.count}</p>\n`;
        code += `        <button onClick={() => this.setState({ count: this.state.count + 1 })}>Increment</button>\n`;
      }
      if (withProps) {
        code += `        {this.props.children}\n`;
      }
      code += `      </div>\n    );\n  }\n}\n\nexport default ${name};\n`;
    }

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Component Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={componentName}
          onChange={(e) => { setComponentName(e.target.value); if (error) setError(undefined); }}
          placeholder="e.g. MyComponent"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Component Type</label>
          <select
            value={componentType}
            onChange={(e) => setComponentType(e.target.value as 'functional' | 'class')}
            aria-label="Component type"
            className="input-field"
          >
            <option value="functional">Functional</option>
            <option value="class">Class</option>
          </select>
        </div>
        <div className="space-y-2 pt-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={withProps} onChange={(e) => setWithProps(e.target.checked)} className="rounded" />
            Props interface
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={withState} onChange={(e) => setWithState(e.target.checked)} className="rounded" />
            State
          </label>
          {componentType === 'class' && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={withLifecycle} onChange={(e) => setWithLifecycle(e.target.checked)} className="rounded" />
              Lifecycle methods
            </label>
          )}
        </div>
      </div>

      <button onClick={generate} aria-label="Generate Inferno component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated Inferno.js Component</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
