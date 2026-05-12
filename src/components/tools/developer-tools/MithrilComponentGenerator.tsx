'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MithrilComponentGenerator - Generate Mithril.js component boilerplate.
 * Creates class-based or closure components with lifecycle hooks and state management.
 */
export default function MithrilComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [style, setStyle] = useState<'closure' | 'class'>('closure');
  const [includeState, setIncludeState] = useState(true);
  const [includeLifecycle, setIncludeLifecycle] = useState(true);
  const [useTypeScript, setUseTypeScript] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = componentName.trim() || 'MyComponent';

    if (style === 'closure') {
      const tsAttrs = useTypeScript ? `\ninterface ${name}Attrs {\n  // Define attributes here\n}\n` : '';
      const stateBlock = includeState ? `  let count = 0;\n  let message = '';\n\n` : '';
      const lifecycleBlock = includeLifecycle
        ? `    oninit(vnode${useTypeScript ? `: m.Vnode<${name}Attrs>` : ''}) {\n      // Called before DOM is created\n    },\n    oncreate(vnode${useTypeScript ? `: m.VnodeDOM<${name}Attrs>` : ''}) {\n      // Called after DOM element is created\n    },\n    onupdate(vnode${useTypeScript ? `: m.VnodeDOM<${name}Attrs>` : ''}) {\n      // Called after DOM element is updated\n    },\n    onremove(vnode${useTypeScript ? `: m.VnodeDOM<${name}Attrs>` : ''}) {\n      // Called before DOM element is removed\n    },\n`
        : '';

      const code = `import m from 'mithril';
${tsAttrs}
${useTypeScript ? `const ${name}: m.ClosureComponent<${name}Attrs> = () => {` : `const ${name} = () => {`}
${stateBlock}  return {
${lifecycleBlock}    view(vnode${useTypeScript ? `: m.Vnode<${name}Attrs>` : ''}) {
      return m('div', { class: '${name.toLowerCase()}' }, [
        m('h2', '${name}'),
${includeState ? `        m('p', \`Count: \${count}\`),\n        m('button', { onclick: () => count++ }, 'Increment'),\n` : `        m('p', 'Hello from ${name}'),\n`}      ]);
    },
  };
};

export default ${name};`;

      setOutput(code);
    } else {
      const tsType = useTypeScript ? `\ninterface ${name}Attrs {\n  // Define attributes here\n}\n` : '';
      const stateFields = includeState ? `  count${useTypeScript ? ': number' : ''} = 0;\n  message${useTypeScript ? ': string' : ''} = '';\n\n` : '';
      const lifecycleBlock = includeLifecycle
        ? `  oninit(vnode${useTypeScript ? `: m.Vnode<${name}Attrs>` : ''}) {\n    // Called before DOM is created\n  }\n\n  oncreate(vnode${useTypeScript ? `: m.VnodeDOM<${name}Attrs>` : ''}) {\n    // Called after DOM element is created\n  }\n\n  onupdate(vnode${useTypeScript ? `: m.VnodeDOM<${name}Attrs>` : ''}) {\n    // Called after DOM element is updated\n  }\n\n  onremove(vnode${useTypeScript ? `: m.VnodeDOM<${name}Attrs>` : ''}) {\n    // Called before DOM element is removed\n  }\n\n`
        : '';

      const code = `import m from 'mithril';
${tsType}
class ${name} implements m.ClassComponent${useTypeScript ? `<${name}Attrs>` : ''} {
${stateFields}${lifecycleBlock}  view(vnode${useTypeScript ? `: m.Vnode<${name}Attrs>` : ''}) {
    return m('div', { class: '${name.toLowerCase()}' }, [
      m('h2', '${name}'),
${includeState ? `      m('p', \`Count: \${this.count}\`),\n      m('button', { onclick: () => this.count++ }, 'Increment'),\n` : `      m('p', 'Hello from ${name}'),\n`}    ]);
  }
}

export default ${name};`;

      setOutput(code);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Component Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="MyComponent"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Component Style</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={style === 'closure'} onChange={() => setStyle('closure')} className="text-blue-600" />
            <span className="text-sm">Closure Component</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={style === 'class'} onChange={() => setStyle('class')} className="text-blue-600" />
            <span className="text-sm">Class Component</span>
          </label>
        </div>
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeState} onChange={(e) => setIncludeState(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include State</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeLifecycle} onChange={(e) => setIncludeLifecycle(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include Lifecycle Hooks</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={useTypeScript} onChange={(e) => setUseTypeScript(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">TypeScript</span>
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Mithril component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Mithril.js Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
