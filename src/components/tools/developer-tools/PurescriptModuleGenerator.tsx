'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PurescriptModuleGenerator - Generate PureScript module boilerplate code.
 * Supports data types, type classes, effects, and module exports.
 */
export default function PurescriptModuleGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [moduleName, setModuleName] = useState('');
  const [dataTypes, setDataTypes] = useState('');
  const [includeEffect, setIncludeEffect] = useState(false);
  const [includeAff, setIncludeAff] = useState(false);
  const [includeHalogen, setIncludeHalogen] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = moduleName.trim() || 'Main';
    const types = dataTypes.trim().split('\n').filter(Boolean);

    let code = `module ${name} where\n\n`;

    // Imports
    code += `import Prelude\n`;
    if (includeEffect) {
      code += `import Effect (Effect)\n`;
      code += `import Effect.Console (log)\n`;
    }
    if (includeAff) {
      code += `import Effect.Aff (Aff, launchAff_)\n`;
      code += `import Effect.Class (liftEffect)\n`;
    }
    if (includeHalogen) {
      code += `import Halogen as H\n`;
      code += `import Halogen.HTML as HH\n`;
      code += `import Halogen.HTML.Events as HE\n`;
      code += `import Halogen.HTML.Properties as HP\n`;
    }
    code += `\n`;

    // Data types
    if (types.length > 0) {
      types.forEach(t => {
        const trimmed = t.trim();
        code += `data ${trimmed} = ${trimmed}\n`;
      });
      code += `\n`;
      types.forEach(t => {
        const trimmed = t.trim();
        code += `derive instance eq${trimmed} :: Eq ${trimmed}\n`;
        code += `derive instance ord${trimmed} :: Ord ${trimmed}\n`;
      });
      code += `\n`;
    }

    // Halogen component
    if (includeHalogen) {
      code += `-- Halogen Component\n`;
      code += `type State = { count :: Int }\n\n`;
      code += `data Action = Increment | Decrement\n\n`;
      code += `component :: forall query input output m. H.Component query input output m\n`;
      code += `component =\n`;
      code += `  H.mkComponent\n`;
      code += `    { initialState: \\_ -> { count: 0 }\n`;
      code += `    , render\n`;
      code += `    , eval: H.mkEval H.defaultEval { handleAction = handleAction }\n`;
      code += `    }\n\n`;
      code += `render :: forall m. State -> H.ComponentHTML Action () m\n`;
      code += `render state =\n`;
      code += `  HH.div_\n`;
      code += `    [ HH.p_ [ HH.text $ "Count: " <> show state.count ]\n`;
      code += `    , HH.button\n`;
      code += `        [ HE.onClick \\_ -> Increment ]\n`;
      code += `        [ HH.text "+" ]\n`;
      code += `    , HH.button\n`;
      code += `        [ HE.onClick \\_ -> Decrement ]\n`;
      code += `        [ HH.text "-" ]\n`;
      code += `    ]\n\n`;
      code += `handleAction :: forall output m. Action -> H.HalogenM State Action () output m Unit\n`;
      code += `handleAction = case _ of\n`;
      code += `  Increment -> H.modify_ \\st -> st { count = st.count + 1 }\n`;
      code += `  Decrement -> H.modify_ \\st -> st { count = st.count - 1 }\n`;
    } else if (includeEffect) {
      code += `-- Main entry point\n`;
      code += `main :: Effect Unit\n`;
      code += `main = do\n`;
      code += `  log "Hello from ${name}!"\n`;
    } else if (includeAff) {
      code += `-- Async main entry point\n`;
      code += `main :: Effect Unit\n`;
      code += `main = launchAff_ do\n`;
      code += `  liftEffect $ log "Starting async operation..."\n`;
      code += `  -- Add async operations here\n`;
      code += `  liftEffect $ log "Done!"\n`;
    } else {
      code += `-- Pure function example\n`;
      code += `greet :: String -> String\n`;
      code += `greet name = "Hello, " <> name <> "!"\n`;
    }

    setOutput(code);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Module Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder="e.g., Main, App.Counter, Data.User"
          aria-label={`Module name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-types`} className="block text-sm font-medium text-gray-700 mb-1">
          Data Types (one per line)
        </label>
        <textarea
          id={`${toolId}-types`}
          value={dataTypes}
          onChange={(e) => setDataTypes(e.target.value)}
          placeholder={"Color\nDirection\nStatus"}
          aria-label={`Data types for ${toolName}`}
          className="input-field h-24 resize-y font-mono"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeEffect} onChange={(e) => setIncludeEffect(e.target.checked)} className="rounded" />
          Include Effect
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeAff} onChange={(e) => setIncludeAff(e.target.checked)} className="rounded" />
          Include Aff (Async)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeHalogen} onChange={(e) => setIncludeHalogen(e.target.checked)} className="rounded" />
          Include Halogen UI
        </label>
      </div>

      <button onClick={generate} aria-label="Generate PureScript module" className="btn-primary">
        Generate Module
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated PureScript Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
