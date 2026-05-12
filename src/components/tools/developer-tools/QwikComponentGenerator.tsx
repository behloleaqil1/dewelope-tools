'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * QwikComponentGenerator - Generate Qwik component boilerplate code.
 * Creates component$, useSignal, useStore, and other Qwik patterns.
 */
export default function QwikComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [componentType, setComponentType] = useState<'basic' | 'with-signal' | 'with-store' | 'with-task' | 'with-resource'>('basic');
  const [includeStyles, setIncludeStyles] = useState(false);
  const [includeSlot, setIncludeSlot] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = componentName.trim() || 'MyComponent';
    const pascalName = name.charAt(0).toUpperCase() + name.slice(1);

    let imports = "import { component$";
    const extraImports: string[] = [];

    if (componentType === 'with-signal') extraImports.push('useSignal');
    if (componentType === 'with-store') extraImports.push('useStore');
    if (componentType === 'with-task') { extraImports.push('useSignal', 'useTask$'); }
    if (componentType === 'with-resource') { extraImports.push('useSignal', 'useResource$', 'Resource'); }
    if (includeSlot) extraImports.push('Slot');
    if (includeStyles) extraImports.push('useStylesScoped$');

    const uniqueImports = [...new Set(extraImports)];
    if (uniqueImports.length > 0) imports += `, ${uniqueImports.join(', ')}`;
    imports += " } from '@builder.io/qwik';";

    let body = '';

    if (includeStyles) {
      body += `  useStylesScoped$(\`\n    .container {\n      padding: 1rem;\n    }\n  \`);\n\n`;
    }

    if (componentType === 'with-signal') {
      body += `  const count = useSignal(0);\n\n`;
    } else if (componentType === 'with-store') {
      body += `  const state = useStore({\n    count: 0,\n    name: '',\n  });\n\n`;
    } else if (componentType === 'with-task') {
      body += `  const data = useSignal('');\n\n  useTask$(({ track }) => {\n    track(() => data.value);\n    // Runs on server and client when tracked value changes\n    console.log('Data changed:', data.value);\n  });\n\n`;
    } else if (componentType === 'with-resource') {
      body += `  const query = useSignal('');\n\n  const dataResource = useResource$(async ({ track, cleanup }) => {\n    const q = track(() => query.value);\n    const controller = new AbortController();\n    cleanup(() => controller.abort());\n\n    const res = await fetch(\`/api/data?q=\${q}\`, { signal: controller.signal });\n    return res.json();\n  });\n\n`;
    }

    let jsx = '';
    if (componentType === 'with-signal') {
      jsx = `      <p>Count: {count.value}</p>\n      <button onClick$={() => count.value++}>Increment</button>`;
    } else if (componentType === 'with-store') {
      jsx = `      <p>Count: {state.count}</p>\n      <input value={state.name} onInput$={(e) => state.name = (e.target as HTMLInputElement).value} />\n      <button onClick$={() => state.count++}>Increment</button>`;
    } else if (componentType === 'with-task') {
      jsx = `      <input value={data.value} onInput$={(e) => data.value = (e.target as HTMLInputElement).value} />\n      <p>Value: {data.value}</p>`;
    } else if (componentType === 'with-resource') {
      jsx = `      <input value={query.value} onInput$={(e) => query.value = (e.target as HTMLInputElement).value} />\n      <Resource\n        value={dataResource}\n        onPending={() => <p>Loading...</p>}\n        onRejected={(err) => <p>Error: {err.message}</p>}\n        onResolved={(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}\n      />`;
    } else {
      jsx = `      <p>Hello from ${pascalName}!</p>`;
    }

    if (includeSlot) {
      jsx += `\n      <Slot />`;
    }

    const wrapperClass = includeStyles ? ' class="container"' : '';

    const code = `${imports}

export const ${pascalName} = component$(() => {
${body}  return (
    <div${wrapperClass}>
${jsx}
    </div>
  );
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
          placeholder="e.g. MyComponent"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Component Type
        </label>
        <select
          id={`${toolId}-type`}
          value={componentType}
          onChange={(e) => setComponentType(e.target.value as typeof componentType)}
          aria-label={`Component type for ${toolName}`}
          className="input-field"
        >
          <option value="basic">Basic Component</option>
          <option value="with-signal">With useSignal (reactive state)</option>
          <option value="with-store">With useStore (object state)</option>
          <option value="with-task">With useTask$ (side effects)</option>
          <option value="with-resource">With useResource$ (async data)</option>
        </select>
      </InputArea>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeStyles} onChange={(e) => setIncludeStyles(e.target.checked)} className="rounded" />
          Scoped Styles
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeSlot} onChange={(e) => setIncludeSlot(e.target.checked)} className="rounded" />
          Include Slot
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Qwik component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Qwik Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
