'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RiotComponentGenerator - Generate Riot.js component boilerplate.
 * Creates Riot.js tag components with state, lifecycle hooks, and event handling.
 */
export default function RiotComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [includeState, setIncludeState] = useState(true);
  const [includeLifecycle, setIncludeLifecycle] = useState(true);
  const [includeEvents, setIncludeEvents] = useState(true);
  const [includeStyles, setIncludeStyles] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = componentName.trim() || 'my-component';

    const stateBlock = includeState
      ? `    state: {\n      count: 0,\n      message: 'Hello World'\n    },\n\n`
      : '';

    const lifecycleBlock = includeLifecycle
      ? `    onBeforeMount(props, state) {\n      // Before the component is mounted\n    },\n\n    onMounted(props, state) {\n      // After the component is mounted to DOM\n    },\n\n    onBeforeUpdate(props, state) {\n      // Before the component is updated\n    },\n\n    onUpdated(props, state) {\n      // After the component is updated\n    },\n\n    onBeforeUnmount(props, state) {\n      // Before the component is removed\n    },\n\n    onUnmounted(props, state) {\n      // After the component is removed from DOM\n    },\n\n`
      : '';

    const eventsBlock = includeEvents
      ? `    increment() {\n      this.update({ count: this.state.count + 1 });\n    },\n\n    handleInput(e) {\n      this.update({ message: e.target.value });\n    },\n`
      : '';

    const templateContent = includeState && includeEvents
      ? `  <div class="${name}">\n    <h2>{state.message}</h2>\n    <p>Count: {state.count}</p>\n    <button onclick={increment}>Increment</button>\n    <input value={state.message} oninput={handleInput} />\n  </div>`
      : `  <div class="${name}">\n    <h2>${name}</h2>\n    <p>Hello from Riot.js component</p>\n  </div>`;

    const styleBlock = includeStyles
      ? `\n\n  <style>\n    :host {\n      display: block;\n    }\n\n    .${name} {\n      padding: 1rem;\n    }\n\n    button {\n      padding: 0.5rem 1rem;\n      cursor: pointer;\n    }\n  </style>`
      : '';

    const scriptContent = `${stateBlock}${lifecycleBlock}${eventsBlock}`;

    const code = `<${name}>\n${templateContent}\n\n  <script>\n    export default {\n${scriptContent}    }\n  </script>${styleBlock}\n</${name}>`;

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
          placeholder="my-component"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeState} onChange={(e) => setIncludeState(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include State</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeLifecycle} onChange={(e) => setIncludeLifecycle(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include Lifecycle</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeEvents} onChange={(e) => setIncludeEvents(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include Events</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeStyles} onChange={(e) => setIncludeStyles(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include Styles</span>
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Riot component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Riot.js Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
