'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HyperappComponentGenerator - Generate Hyperapp component boilerplate code.
 * Creates view functions, actions, and state structure for Hyperapp v2.
 */
export default function HyperappComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [stateFields, setStateFields] = useState('');
  const [includeEffects, setIncludeEffects] = useState(false);
  const [includeSubscriptions, setIncludeSubscriptions] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!componentName.trim()) return;

    const name = componentName.trim();
    const fields = stateFields.split('\n').map(f => f.trim()).filter(Boolean);

    const stateObj = fields.length > 0
      ? `{\n${fields.map(f => `  ${f}: null,`).join('\n')}\n}`
      : '{\n  // Add your state fields here\n}';

    const actions = fields.map(f => {
      const capitalized = f.charAt(0).toUpperCase() + f.slice(1);
      return `const Set${capitalized} = (state, ${f}) => ({ ...state, ${f} });`;
    }).join('\n');

    let code = `// ${name} - Hyperapp v2 Component
// State
const init${name} = ${stateObj};

// Actions
${actions || '// const MyAction = (state, payload) => ({ ...state, ...payload });'}
`;

    if (includeEffects) {
      code += `
// Effects
const fetch${name}Data = (dispatch) => {
  fetch('/api/${name.toLowerCase()}')
    .then(res => res.json())
    .then(data => dispatch(Set${fields[0] ? fields[0].charAt(0).toUpperCase() + fields[0].slice(1) : 'Data'}, data));
};

const ${name}Effect = [fetch${name}Data];
`;
    }

    if (includeSubscriptions) {
      code += `
// Subscriptions
const ${name}Subscriptions = (state) => [
  state.active && [
    every, { interval: 1000, action: Tick }
  ],
];
`;
    }

    code += `
// View
const ${name} = (state) => (
  h("div", { class: "${name.toLowerCase()}-container" }, [
    h("h2", {}, "${name}"),
${fields.map(f => `    h("p", {}, \`${f}: \${state.${f}}\`),`).join('\n') || '    h("p", {}, "Hello from ' + name + '"),'}
  ])
);

// App initialization
app({
  init: init${name},
  view: ${name},${includeSubscriptions ? `\n  subscriptions: ${name}Subscriptions,` : ''}
  node: document.getElementById("app"),
});
`;

    setOutput(code);
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
          placeholder="e.g. Counter, TodoList, UserProfile"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-fields`} className="block text-sm font-medium text-gray-700 mb-1">
          State Fields (one per line)
        </label>
        <textarea
          id={`${toolId}-fields`}
          value={stateFields}
          onChange={(e) => setStateFields(e.target.value)}
          placeholder="count&#10;name&#10;items"
          aria-label={`State fields for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={includeEffects}
            onChange={(e) => setIncludeEffects(e.target.checked)}
            className="rounded border-gray-300"
          />
          Include Effects
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={includeSubscriptions}
            onChange={(e) => setIncludeSubscriptions(e.target.checked)}
            className="rounded border-gray-300"
          />
          Include Subscriptions
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Hyperapp component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Hyperapp Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
