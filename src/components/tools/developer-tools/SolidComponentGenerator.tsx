'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SolidComponentGenerator - Generate SolidJS component boilerplate code.
 * Supports signals, props, createEffect, and various component patterns.
 */
export default function SolidComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [props, setProps] = useState('');
  const [useSignals, setUseSignals] = useState(true);
  const [useEffect, setUseEffect] = useState(false);
  const [useMemo, setUseMemo] = useState(false);
  const [useStore, setUseStore] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [useTypeScript, setUseTypeScript] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!componentName.trim()) return;

    const name = componentName.trim();
    const propsList = props.trim() ? props.split(',').map((p) => p.trim()).filter(Boolean) : [];

    const imports: string[] = [];
    const solidImports: string[] = ['Component'];

    if (useSignals) solidImports.push('createSignal');
    if (useEffect) solidImports.push('createEffect');
    if (useMemo) solidImports.push('createMemo');
    if (hasChildren) solidImports.push('JSX');

    imports.push(`import { ${solidImports.join(', ')} } from 'solid-js';`);

    if (useStore) {
      imports.push(`import { createStore } from 'solid-js/store';`);
    }

    let code = imports.join('\n') + '\n\n';

    // Props interface
    if (useTypeScript && (propsList.length > 0 || hasChildren)) {
      code += `interface ${name}Props {\n`;
      propsList.forEach((prop) => {
        const [propName, propType] = prop.includes(':') ? prop.split(':').map((s) => s.trim()) : [prop, 'string'];
        code += `  ${propName}: ${propType};\n`;
      });
      if (hasChildren) {
        code += `  children?: JSX.Element;\n`;
      }
      code += `}\n\n`;
    }

    // Component declaration
    const propsType = useTypeScript ? (propsList.length > 0 || hasChildren ? `${name}Props` : '{}') : '';
    code += useTypeScript
      ? `const ${name}: Component<${propsType}> = (props) => {\n`
      : `const ${name} = (props) => {\n`;

    // Signals
    if (useSignals) {
      code += `  const [count, setCount] = createSignal(0);\n`;
    }

    // Store
    if (useStore) {
      code += `  const [state, setState] = createStore({ items: [] as string[] });\n`;
    }

    // Effect
    if (useEffect) {
      code += `\n  createEffect(() => {\n`;
      code += `    console.log('${name} mounted or dependencies changed');\n`;
      if (useSignals) code += `    console.log('Count:', count());\n`;
      code += `  });\n`;
    }

    // Memo
    if (useMemo) {
      code += `\n  const doubled = createMemo(() => count() * 2);\n`;
    }

    // Return JSX
    code += `\n  return (\n`;
    code += `    <div class="${name.toLowerCase()}">\n`;

    if (propsList.length > 0) {
      code += `      <h2>{props.${propsList[0].split(':')[0].trim()}}</h2>\n`;
    }

    if (useSignals) {
      code += `      <button onClick={() => setCount((c) => c + 1)}>\n`;
      code += `        Count: {count()}\n`;
      code += `      </button>\n`;
    }

    if (useMemo) {
      code += `      <p>Doubled: {doubled()}</p>\n`;
    }

    if (hasChildren) {
      code += `      {props.children}\n`;
    }

    code += `    </div>\n`;
    code += `  );\n`;
    code += `};\n\n`;
    code += `export default ${name};\n`;

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Component Name</label>
          <input id={`${toolId}-name`} type="text" value={componentName} onChange={(e) => setComponentName(e.target.value)} placeholder="e.g. Counter" aria-label={`Component name for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-props`} className="block text-sm font-medium text-gray-700 mb-1">Props (comma-separated, name:type)</label>
          <input id={`${toolId}-props`} type="text" value={props} onChange={(e) => setProps(e.target.value)} placeholder="e.g. title:string, onClick:() => void" aria-label={`Props for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useTypeScript} onChange={(e) => setUseTypeScript(e.target.checked)} className="rounded" />
          TypeScript
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useSignals} onChange={(e) => setUseSignals(e.target.checked)} className="rounded" />
          createSignal
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useEffect} onChange={(e) => setUseEffect(e.target.checked)} className="rounded" />
          createEffect
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useMemo} onChange={(e) => setUseMemo(e.target.checked)} className="rounded" />
          createMemo
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useStore} onChange={(e) => setUseStore(e.target.checked)} className="rounded" />
          createStore
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={hasChildren} onChange={(e) => setHasChildren(e.target.checked)} className="rounded" />
          Children
        </label>
      </div>

      <button onClick={generate} aria-label="Generate SolidJS component" className="btn-primary">Generate Component</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated SolidJS Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
