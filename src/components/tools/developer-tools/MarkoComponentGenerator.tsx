'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkoComponentGenerator - Generate Marko.js component boilerplate.
 * Creates class-based or tag-based components with state, lifecycle, and event handling.
 */
export default function MarkoComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [style, setStyle] = useState<'tags' | 'class'>('tags');
  const [includeState, setIncludeState] = useState(true);
  const [includeLifecycle, setIncludeLifecycle] = useState(true);
  const [includeEvents, setIncludeEvents] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = componentName.trim() || 'my-component';

    if (style === 'tags') {
      const stateBlock = includeState
        ? `class {\n  onCreate() {\n    this.state = {\n      count: 0,\n      message: 'Hello'\n    };\n  }\n${includeLifecycle ? `\n  onMount() {\n    // Component mounted to DOM\n  }\n\n  onUpdate() {\n    // Component state updated\n  }\n\n  onDestroy() {\n    // Cleanup before removal\n  }\n` : ''}${includeEvents ? `\n  handleClick() {\n    this.state.count++;\n  }\n\n  handleInput(newValue) {\n    this.state.message = newValue;\n  }\n` : ''}}\n\n`
        : includeLifecycle
          ? `class {\n  onMount() {\n    // Component mounted to DOM\n  }\n\n  onDestroy() {\n    // Cleanup before removal\n  }\n}\n\n`
          : '';

      const templateBlock = includeState && includeEvents
        ? `<div class="${name}">\n  <h2>\${state.message}</h2>\n  <p>Count: \${state.count}</p>\n  <button on-click("handleClick")>\n    Increment\n  </button>\n  <input\n    value=state.message\n    on-input("handleInput")\n  />\n</div>\n`
        : `<div class="${name}">\n  <h2>${name}</h2>\n  <p>Hello from Marko component</p>\n</div>\n`;

      const code = `// ${name}.marko\n${stateBlock}${templateBlock}`;
      setOutput(code);
    } else {
      const stateBlock = includeState
        ? `  onCreate() {\n    this.state = {\n      count: 0,\n      message: 'Hello'\n    };\n  }\n\n`
        : '';
      const lifecycleBlock = includeLifecycle
        ? `  onMount() {\n    // Component mounted to DOM\n  }\n\n  onUpdate() {\n    // Component state updated\n  }\n\n  onDestroy() {\n    // Cleanup before removal\n  }\n\n`
        : '';
      const eventsBlock = includeEvents
        ? `  handleClick() {\n    this.state.count++;\n  }\n\n  handleInput(newValue) {\n    this.state.message = newValue;\n  }\n`
        : '';

      const componentJs = `// component.js\nmodule.exports = class {\n${stateBlock}${lifecycleBlock}${eventsBlock}};\n`;

      const templateMarko = includeState && includeEvents
        ? `\n// index.marko\n<div class="${name}">\n  <h2>\${state.message}</h2>\n  <p>Count: \${state.count}</p>\n  <button on-click("handleClick")>\n    Increment\n  </button>\n  <input\n    value=state.message\n    on-input("handleInput")\n  />\n</div>\n`
        : `\n// index.marko\n<div class="${name}">\n  <h2>${name}</h2>\n  <p>Hello from Marko component</p>\n</div>\n`;

      setOutput(componentJs + templateMarko);
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
          placeholder="my-component"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Component Style</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={style === 'tags'} onChange={() => setStyle('tags')} className="text-blue-600" />
            <span className="text-sm">Single-File (Tags API)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={style === 'class'} onChange={() => setStyle('class')} className="text-blue-600" />
            <span className="text-sm">Split Files (Class)</span>
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
          <span className="text-sm text-gray-700">Include Lifecycle</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeEvents} onChange={(e) => setIncludeEvents(e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">Include Events</span>
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Marko component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Marko.js Component</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
