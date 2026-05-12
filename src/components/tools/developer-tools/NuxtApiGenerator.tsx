'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NuxtApiGenerator - Generate Nuxt 3 server API route boilerplate.
 * Creates typed defineEventHandler functions for Nuxt 3 server routes.
 */
export default function NuxtApiGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [routePath, setRoutePath] = useState('');
  const [method, setMethod] = useState('get');
  const [useTypescript, setUseTypescript] = useState(true);
  const [includeValidation, setIncludeValidation] = useState(true);
  const [includeErrorHandling, setIncludeErrorHandling] = useState(true);
  const [output, setOutput] = useState('');

  const methods = [
    { value: 'get', label: 'GET' },
    { value: 'post', label: 'POST' },
    { value: 'put', label: 'PUT' },
    { value: 'patch', label: 'PATCH' },
    { value: 'delete', label: 'DELETE' },
  ];

  const generate = () => {
    const path = routePath.trim() || 'items';
    const lines: string[] = [];

    // File path comment
    lines.push(`// server/api/${path}.${method}.${useTypescript ? 'ts' : 'js'}`);
    lines.push('');

    if (useTypescript && (method === 'post' || method === 'put' || method === 'patch')) {
      lines.push('interface RequestBody {');
      lines.push('  name: string;');
      lines.push('  description?: string;');
      lines.push('}');
      lines.push('');
    }

    if (useTypescript) {
      lines.push('interface ResponseData {');
      lines.push('  success: boolean;');
      lines.push('  data: unknown;');
      lines.push('  message?: string;');
      lines.push('}');
      lines.push('');
    }

    lines.push('export default defineEventHandler(async (event) => {');

    if (method === 'get') {
      lines.push('  // Get query parameters');
      lines.push('  const query = getQuery(event);');
      if (includeValidation) {
        lines.push('');
        lines.push('  // Validate query params');
        lines.push('  const page = Number(query.page) || 1;');
        lines.push('  const limit = Math.min(Number(query.limit) || 10, 100);');
      }
    }

    if (method === 'post' || method === 'put' || method === 'patch') {
      lines.push(`  const body = await readBody${useTypescript ? '<RequestBody>' : ''}(event);`);
      if (includeValidation) {
        lines.push('');
        lines.push('  // Validate request body');
        lines.push('  if (!body.name || typeof body.name !== "string") {');
        lines.push('    throw createError({');
        lines.push('      statusCode: 400,');
        lines.push('      statusMessage: "Name is required",');
        lines.push('    });');
        lines.push('  }');
      }
    }

    if (method === 'delete' || method === 'put' || method === 'patch') {
      lines.push('');
      lines.push('  // Get route params');
      lines.push('  const id = getRouterParam(event, "id");');
      if (includeValidation) {
        lines.push('  if (!id) {');
        lines.push('    throw createError({');
        lines.push('      statusCode: 400,');
        lines.push('      statusMessage: "ID is required",');
        lines.push('    });');
        lines.push('  }');
      }
    }

    lines.push('');

    if (includeErrorHandling) {
      lines.push('  try {');
      lines.push('    // TODO: Implement your logic here');
      lines.push(`    const result = { id: "1", name: "Example" };`);
      lines.push('');
      lines.push(`    return ${useTypescript ? '{ success: true, data: result } satisfies ResponseData' : '{ success: true, data: result }'};`);
      lines.push('  } catch (error) {');
      lines.push('    throw createError({');
      lines.push('      statusCode: 500,');
      lines.push('      statusMessage: "Internal Server Error",');
      lines.push('    });');
      lines.push('  }');
    } else {
      lines.push('  // TODO: Implement your logic here');
      lines.push(`  const result = { id: "1", name: "Example" };`);
      lines.push('');
      lines.push(`  return { success: true, data: result };`);
    }

    lines.push('});');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">
            Route Path
          </label>
          <input
            id={`${toolId}-path`}
            type="text"
            value={routePath}
            onChange={(e) => setRoutePath(e.target.value)}
            placeholder="e.g. users/[id]"
            aria-label={`Route path for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">
            HTTP Method
          </label>
          <select
            id={`${toolId}-method`}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            aria-label={`HTTP method for ${toolName}`}
            className="input-field"
          >
            {methods.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </InputArea>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useTypescript} onChange={(e) => setUseTypescript(e.target.checked)} className="rounded" />
          TypeScript
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeValidation} onChange={(e) => setIncludeValidation(e.target.checked)} className="rounded" />
          Validation
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeErrorHandling} onChange={(e) => setIncludeErrorHandling(e.target.checked)} className="rounded" />
          Error Handling
        </label>
      </div>

      <button onClick={generate} aria-label="Generate Nuxt API route" className="btn-primary">
        Generate Code
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated Nuxt 3 API Route</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
