'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CycleComponentGenerator - Generates Cycle.js component boilerplate code.
 * Supports different driver configurations and stream patterns.
 */
export default function CycleComponentGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [withHttp, setWithHttp] = useState(false);
  const [withState, setWithState] = useState(false);
  const [withDom, setWithDom] = useState(true);
  const [useTypescript, setUseTypescript] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const generate = () => {
    const name = componentName.trim();
    if (!name) {
      setError('Please enter a component name');
      setOutput('');
      return;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) {
      setError('Component name must start with a letter and contain only letters/numbers');
      setOutput('');
      return;
    }
    setError(undefined);

    const ts = useTypescript;
    let code = '';

    // Imports
    code += `import { run } from '@cycle/run';\n`;
    if (withDom) {
      code += `import { makeDOMDriver, div, h1, button, p${ts ? ', DOMSource, VNode' : ''} } from '@cycle/dom';\n`;
    }
    if (withHttp) {
      code += `import { makeHTTPDriver${ts ? ', HTTPSource, RequestOptions' : ''} } from '@cycle/http';\n`;
    }
    code += `import xs${ts ? ', { Stream }' : ''} from 'xstream';\n`;
    code += `\n`;

    // Types
    if (ts) {
      code += `interface Sources {\n`;
      if (withDom) code += `  DOM: DOMSource;\n`;
      if (withHttp) code += `  HTTP: HTTPSource;\n`;
      code += `}\n\n`;

      code += `interface Sinks {\n`;
      if (withDom) code += `  DOM: Stream<VNode>;\n`;
      if (withHttp) code += `  HTTP: Stream<RequestOptions>;\n`;
      code += `}\n\n`;
    }

    // Main function
    code += `function ${name}(sources${ts ? ': Sources' : ''})${ts ? ': Sinks' : ''} {\n`;

    if (withState) {
      code += `  // State management with fold\n`;
      code += `  const increment$ = sources.DOM.select('.increment').events('click').mapTo(+1);\n`;
      code += `  const decrement$ = sources.DOM.select('.decrement').events('click').mapTo(-1);\n`;
      code += `  const count$ = xs.merge(increment$, decrement$).fold((acc, x) => acc + x, 0);\n\n`;
    }

    if (withHttp) {
      code += `  // HTTP request stream\n`;
      code += `  const request$ = sources.DOM.select('.fetch').events('click')\n`;
      code += `    .mapTo({ url: 'https://api.example.com/data', category: 'api' }${ts ? ' as RequestOptions' : ''});\n\n`;
      code += `  const response$ = sources.HTTP.select('api')\n`;
      code += `    .flatten()\n`;
      code += `    .map(res => res.body);\n\n`;
    }

    if (withDom) {
      code += `  // View\n`;
      code += `  const vdom$ = ${withState ? 'count$' : 'xs.of(0)'}.map(${withState ? 'count' : '_'} =>\n`;
      code += `    div('.${name.toLowerCase()}', [\n`;
      code += `      h1('${name}'),\n`;
      if (withState) {
        code += `      p(\`Count: \${count}\`),\n`;
        code += `      button('.increment', 'Increment'),\n`;
        code += `      button('.decrement', 'Decrement'),\n`;
      }
      if (withHttp) {
        code += `      button('.fetch', 'Fetch Data'),\n`;
      }
      code += `    ])\n  );\n\n`;
    }

    code += `  return {\n`;
    if (withDom) code += `    DOM: vdom$,\n`;
    if (withHttp) code += `    HTTP: request$,\n`;
    code += `  };\n}\n\n`;

    // Drivers
    code += `const drivers = {\n`;
    if (withDom) code += `  DOM: makeDOMDriver('#app'),\n`;
    if (withHttp) code += `  HTTP: makeHTTPDriver(),\n`;
    code += `};\n\n`;
    code += `run(${name}, drivers);\n`;

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
          placeholder="e.g. App"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Drivers & Options</label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={withDom} onChange={(e) => setWithDom(e.target.checked)} className="rounded" />
            DOM Driver
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={withHttp} onChange={(e) => setWithHttp(e.target.checked)} className="rounded" />
            HTTP Driver
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={withState} onChange={(e) => setWithState(e.target.checked)} className="rounded" />
            State (counter example)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={useTypescript} onChange={(e) => setUseTypescript(e.target.checked)} className="rounded" />
            TypeScript types
          </label>
        </div>
      </div>

      <button onClick={generate} aria-label="Generate Cycle.js component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated Cycle.js Component</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
