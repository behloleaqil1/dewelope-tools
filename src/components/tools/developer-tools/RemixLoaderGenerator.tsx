'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RemixLoaderGenerator - Generate Remix loader/action function boilerplate.
 * Creates typed loader and action functions for Remix routes.
 */
export default function RemixLoaderGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [routeName, setRouteName] = useState('');
  const [includeLoader, setIncludeLoader] = useState(true);
  const [includeAction, setIncludeAction] = useState(true);
  const [useTypescript, setUseTypescript] = useState(true);
  const [includeErrorBoundary, setIncludeErrorBoundary] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = routeName.trim() || 'MyRoute';
    const lines: string[] = [];

    // Imports
    const imports: string[] = [];
    if (includeLoader) imports.push('json', 'LoaderFunctionArgs');
    if (includeAction) imports.push('ActionFunctionArgs', 'redirect');
    if (includeErrorBoundary) imports.push('isRouteErrorResponse', 'useRouteError');
    imports.push('useLoaderData');

    lines.push(`import { ${[...new Set(imports.filter(i => ['json', 'redirect', 'LoaderFunctionArgs', 'ActionFunctionArgs'].includes(i)))].join(', ')} } from "@remix-run/node";`);
    lines.push(`import { ${[...new Set(imports.filter(i => ['useLoaderData', 'isRouteErrorResponse', 'useRouteError'].includes(i)))].join(', ')} } from "@remix-run/react";`);
    lines.push('');

    if (includeLoader) {
      if (useTypescript) {
        lines.push(`interface ${name}Data {`);
        lines.push('  message: string;');
        lines.push('  items: string[];');
        lines.push('}');
        lines.push('');
      }

      lines.push(`export async function loader({ request, params }${useTypescript ? ': LoaderFunctionArgs' : ''}) {`);
      lines.push('  // TODO: Fetch data from your database or API');
      lines.push(`  const data${useTypescript ? `: ${name}Data` : ''} = {`);
      lines.push(`    message: "Hello from ${name}",`);
      lines.push('    items: [],');
      lines.push('  };');
      lines.push('');
      lines.push('  return json(data);');
      lines.push('}');
      lines.push('');
    }

    if (includeAction) {
      lines.push(`export async function action({ request, params }${useTypescript ? ': ActionFunctionArgs' : ''}) {`);
      lines.push('  const formData = await request.formData();');
      lines.push('  const intent = formData.get("intent");');
      lines.push('');
      lines.push('  switch (intent) {');
      lines.push('    case "create": {');
      lines.push('      // TODO: Handle create');
      lines.push('      break;');
      lines.push('    }');
      lines.push('    case "delete": {');
      lines.push('      // TODO: Handle delete');
      lines.push('      break;');
      lines.push('    }');
      lines.push('  }');
      lines.push('');
      lines.push(`  return redirect("/${name.toLowerCase()}");`);
      lines.push('}');
      lines.push('');
    }

    lines.push(`export default function ${name}() {`);
    if (includeLoader) {
      lines.push(`  const data = useLoaderData<typeof loader>();`);
      lines.push('');
    }
    lines.push('  return (');
    lines.push('    <div>');
    lines.push(`      <h1>${name}</h1>`);
    if (includeLoader) {
      lines.push('      <p>{data.message}</p>');
    }
    if (includeAction) {
      lines.push('      <form method="post">');
      lines.push('        <input type="hidden" name="intent" value="create" />');
      lines.push('        <button type="submit">Submit</button>');
      lines.push('      </form>');
    }
    lines.push('    </div>');
    lines.push('  );');
    lines.push('}');

    if (includeErrorBoundary) {
      lines.push('');
      lines.push('export function ErrorBoundary() {');
      lines.push('  const error = useRouteError();');
      lines.push('');
      lines.push('  if (isRouteErrorResponse(error)) {');
      lines.push('    return (');
      lines.push('      <div>');
      lines.push('        <h1>{error.status} {error.statusText}</h1>');
      lines.push('        <p>{error.data}</p>');
      lines.push('      </div>');
      lines.push('    );');
      lines.push('  }');
      lines.push('');
      lines.push('  return (');
      lines.push('    <div>');
      lines.push('      <h1>Error</h1>');
      lines.push('      <p>Something went wrong.</p>');
      lines.push('    </div>');
      lines.push('  );');
      lines.push('}');
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Route/Component Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="e.g. Dashboard"
          aria-label={`Route name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeLoader} onChange={(e) => setIncludeLoader(e.target.checked)} className="rounded" />
          Include Loader
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeAction} onChange={(e) => setIncludeAction(e.target.checked)} className="rounded" />
          Include Action
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useTypescript} onChange={(e) => setUseTypescript(e.target.checked)} className="rounded" />
          TypeScript
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeErrorBoundary} onChange={(e) => setIncludeErrorBoundary(e.target.checked)} className="rounded" />
          Error Boundary
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Remix loader/action" className="btn-primary">
        Generate Code
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated Remix Route</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
