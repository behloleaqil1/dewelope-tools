'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ReasonReactGenerator - Generate ReasonReact/ReScript component boilerplate code.
 * Supports functional components with hooks, props, and state management.
 */
export default function ReasonReactGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [componentName, setComponentName] = useState('');
  const [props, setProps] = useState('');
  const [includeState, setIncludeState] = useState(true);
  const [includeEffect, setIncludeEffect] = useState(false);
  const [includeReducer, setIncludeReducer] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = componentName.trim() || 'MyComponent';
    const propLines = props.trim().split('\n').filter(Boolean);

    let code = '';

    // Module type definition for props
    if (propLines.length > 0) {
      code += `// ${name}.res\n\n`;
      code += `type props = {\n`;
      propLines.forEach(p => {
        const parts = p.split(':').map(s => s.trim());
        if (parts.length === 2) {
          code += `  ${parts[0]}: ${parts[1]},\n`;
        } else {
          code += `  ${p.trim()}: string,\n`;
        }
      });
      code += `}\n\n`;
    } else {
      code += `// ${name}.res\n\n`;
    }

    // State type if needed
    if (includeState || includeReducer) {
      code += `type state = {\n  count: int,\n  loading: bool,\n}\n\n`;
    }

    // Reducer action type
    if (includeReducer) {
      code += `type action =\n  | Increment\n  | Decrement\n  | SetLoading(bool)\n\n`;
      code += `let reducer = (state, action) => {\n  switch action {\n  | Increment => {...state, count: state.count + 1}\n  | Decrement => {...state, count: state.count - 1}\n  | SetLoading(loading) => {...state, loading}\n  }\n}\n\n`;
    }

    // Component
    code += `@react.component\nlet make = (`;
    if (propLines.length > 0) {
      const params = propLines.map(p => {
        const parts = p.split(':').map(s => s.trim());
        return `~${parts[0]}`;
      });
      code += params.join(', ');
    }
    code += `) => {\n`;

    // State hook
    if (includeState && !includeReducer) {
      code += `  let (state, setState) = React.useState(() => {count: 0, loading: false})\n\n`;
    }

    // Reducer hook
    if (includeReducer) {
      code += `  let (state, dispatch) = React.useReducer(reducer, {count: 0, loading: false})\n\n`;
    }

    // Effect hook
    if (includeEffect) {
      code += `  React.useEffect0(() => {\n    // Side effect on mount\n    Js.log("Component mounted")\n    Some(() => {\n      // Cleanup\n      Js.log("Component unmounted")\n    })\n  })\n\n`;
    }

    // JSX
    code += `  <div className="${name.toLowerCase()}-container">\n`;
    code += `    <h2> {React.string("${name}")} </h2>\n`;
    if (includeState || includeReducer) {
      code += `    <p> {React.string("Count: " ++ Belt.Int.toString(state.count))} </p>\n`;
      if (includeReducer) {
        code += `    <button onClick={_ => dispatch(Increment)}>\n      {React.string("Increment")}\n    </button>\n`;
        code += `    <button onClick={_ => dispatch(Decrement)}>\n      {React.string("Decrement")}\n    </button>\n`;
      } else {
        code += `    <button onClick={_ => setState(prev => {...prev, count: prev.count + 1})}>\n      {React.string("Increment")}\n    </button>\n`;
      }
    }
    code += `  </div>\n`;
    code += `}\n`;

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
          placeholder="e.g., Counter, TodoList"
          aria-label={`Component name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-props`} className="block text-sm font-medium text-gray-700 mb-1">
          Props (one per line, format: name: type)
        </label>
        <textarea
          id={`${toolId}-props`}
          value={props}
          onChange={(e) => setProps(e.target.value)}
          placeholder={"title: string\nonClick: unit => unit\ncount: int"}
          aria-label={`Props definition for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeState} onChange={(e) => setIncludeState(e.target.checked)} className="rounded" />
          Include useState
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeEffect} onChange={(e) => setIncludeEffect(e.target.checked)} className="rounded" />
          Include useEffect
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeReducer} onChange={(e) => setIncludeReducer(e.target.checked)} className="rounded" />
          Include useReducer
        </label>
      </div>

      <button onClick={generate} aria-label="Generate ReasonReact component" className="btn-primary">
        Generate Component
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated ReScript/ReasonReact Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
