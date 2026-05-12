'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SvelteKitEndpointGenerator - Generate SvelteKit endpoint boilerplate.
 * Creates +server.ts files with request handlers, validation, and error handling.
 */
export default function SvelteKitEndpointGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [routePath, setRoutePath] = useState('');
  const [methods, setMethods] = useState<string[]>(['GET']);
  const [includeValidation, setIncludeValidation] = useState(true);
  const [includeAuth, setIncludeAuth] = useState(false);
  const [includeTypes, setIncludeTypes] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function toggleMethod(m: string) {
    setMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  function handleGenerate() {
    setError('');
    setOutput('');

    if (!routePath.trim()) {
      setError('Please enter a route path');
      return;
    }

    if (methods.length === 0) {
      setError('Select at least one HTTP method');
      return;
    }

    const lines: string[] = [];

    lines.push(`import { json, error } from '@sveltejs/kit';`);
    lines.push(`import type { RequestHandler } from './$types';`);
    lines.push('');

    if (includeTypes) {
      lines.push('interface ResponseData {');
      lines.push('  success: boolean;');
      lines.push('  data?: unknown;');
      lines.push('  message?: string;');
      lines.push('}');
      lines.push('');
    }

    // Extract params from route path
    const params = routePath.match(/\[(\w+)\]/g)?.map((p) => p.slice(1, -1)) || [];

    for (const method of methods) {
      lines.push(`// ${method} ${routePath}`);
      lines.push(`export const ${method}: RequestHandler = async ({ ${params.length > 0 ? 'params, ' : ''}${['POST', 'PUT', 'PATCH'].includes(method) ? 'request, ' : ''}${includeAuth ? 'locals, ' : ''}url }) => {`);

      if (includeAuth) {
        lines.push('  // Check authentication');
        lines.push('  if (!locals.user) {');
        lines.push("    throw error(401, 'Unauthorized');");
        lines.push('  }');
        lines.push('');
      }

      if (params.length > 0) {
        for (const param of params) {
          lines.push(`  const ${param} = params.${param};`);
          if (includeValidation) {
            lines.push(`  if (!${param}) {`);
            lines.push(`    throw error(400, '${param} is required');`);
            lines.push('  }');
          }
        }
        lines.push('');
      }

      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        lines.push('  const body = await request.json();');
        if (includeValidation) {
          lines.push('');
          lines.push('  // Validate request body');
          lines.push('  if (!body || typeof body !== "object") {');
          lines.push("    throw error(400, 'Invalid request body');");
          lines.push('  }');
        }
        lines.push('');
      }

      if (method === 'GET') {
        lines.push('  // Access query parameters');
        lines.push("  // const page = url.searchParams.get('page') ?? '1';");
        lines.push('');
      }

      lines.push('  // TODO: Implement your logic here');
      lines.push('');

      if (method === 'DELETE') {
        lines.push('  return new Response(null, { status: 204 });');
      } else {
        lines.push(`  return json(${includeTypes ? '{ success: true, data: {} } satisfies ResponseData' : '{ success: true, data: {} }'});`);
      }

      lines.push('};');
      if (methods.indexOf(method) < methods.length - 1) lines.push('');
    }

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">
          Route Path
        </label>
        <input
          id={`${toolId}-path`}
          type="text"
          value={routePath}
          onChange={(e) => setRoutePath(e.target.value)}
          placeholder="/api/users/[id]"
          aria-label={`Route path for ${toolName}`}
          className="input-field mb-3"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">HTTP Methods</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
            <label key={m} className="flex items-center gap-1 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={methods.includes(m)}
                onChange={() => toggleMethod(m)}
                className="rounded border-gray-300"
              />
              {m}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeValidation}
              onChange={(e) => setIncludeValidation(e.target.checked)}
              className="rounded border-gray-300"
            />
            Validation
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeAuth}
              onChange={(e) => setIncludeAuth(e.target.checked)}
              className="rounded border-gray-300"
            />
            Auth Check
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeTypes}
              onChange={(e) => setIncludeTypes(e.target.checked)}
              className="rounded border-gray-300"
            />
            TypeScript Types
          </label>
        </div>
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate SvelteKit endpoint" className="btn-primary">
        Generate Endpoint
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated SvelteKit Endpoint (+server.ts)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
