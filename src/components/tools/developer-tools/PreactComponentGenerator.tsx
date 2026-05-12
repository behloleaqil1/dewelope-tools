'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PreactComponentGenerator - Generate Preact component boilerplate code.
 * Creates functional components with hooks, props interface, and styling options.
 */
export default function PreactComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [props, setProps] = useState('');
  const [useSignals, setUseSignals] = useState(false);
  const [typescript, setTypescript] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = componentName.trim() || 'MyComponent';
    const propList = props.split(',').map(p => p.trim()).filter(Boolean);

    let code = '';

    if (typescript) {
      const propsInterface = propList.length > 0
        ? `interface ${name}Props {\n${propList.map(p => {
            const [propName, propType] = p.split(':').map(s => s.trim());
            return `  ${propName}${propType ? `: ${propType}` : ': string'};`;
          }).join('\n')}\n}\n\n`
        : '';

      const imports = useSignals
        ? `import { signal } from '@preact/signals';\nimport { h } from 'preact';\nimport { useCallback } from 'preact/hooks';\n`
        : `import { h } from 'preact';\nimport { useState, useCallback } from 'preact/hooks';\n`;

      const stateCode = useSignals
        ? `  const count = signal(0);\n`
        : `  const [count, setCount] = useState(0);\n`;

      const propsParam = propList.length > 0 ? `{ ${propList.map(p => p.split(':')[0].trim()).join(', ')} }: ${name}Props` : '';

      code = `${imports}\n${propsInterface}export default function ${name}(${propsParam}) {\n${stateCode}\n  return (\n    <div class="${name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}">\n      <h2>${name}</h2>\n    </div>\n  );\n}\n`;
    } else {
      const imports = useSignals
        ? `import { signal } from '@preact/signals';\nimport { h } from 'preact';\n`
        : `import { h } from 'preact';\nimport { useState } from 'preact/hooks';\n`;

      const stateCode = useSignals
        ? `  const count = signal(0);\n`
        : `  const [count, setCount] = useState(0);\n`;

      const propsParam = propList.length > 0 ? `{ ${propList.map(p => p.split(':')[0].trim()).join(', ')} }` : '';

      code = `${imports}\nexport default function ${name}(${propsParam}) {\n${stateCode}\n  return (\n    <div class="${name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}">\n      <h2>${name}</h2>\n    </div>\n  );\n}\n`;
    }

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
          placeholder="e.g. Counter"
          aria-label={`Component name for ${toolName}`}
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
          placeholder="e.g. label:string, onClick:() => void"
          aria-label={`Props for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            id={`${toolId}-ts`}
            type="checkbox"
            checked={typescript}
            onChange={(e) => setTypescript(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor={`${toolId}-ts`} className="text-sm text-gray-700">TypeScript</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id={`${toolId}-signals`}
            type="checkbox"
            checked={useSignals}
            onChange={(e) => setUseSignals(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor={`${toolId}-signals`} className="text-sm text-gray-700">Use Signals</label>
        </div>
      </div>

      <button onClick={generate} aria-label="Generate Preact component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Preact Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
