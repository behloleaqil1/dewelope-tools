'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NextApiRouteGenerator - Generate Next.js API route handler boilerplate.
 * Creates App Router route handlers with TypeScript types and error handling.
 */
export default function NextApiRouteGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [routePath, setRoutePath] = useState('');
  const [methods, setMethods] = useState<string[]>(['GET']);
  const [routeName, setRouteName] = useState('');
  const [includeValidation, setIncludeValidation] = useState(true);
  const [includeErrorHandling, setIncludeErrorHandling] = useState(true);
  const [routerType, setRouterType] = useState<'app' | 'pages'>('app');
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

    const name = routeName.trim() || 'route';
    const lines: string[] = [];

    if (routerType === 'app') {
      lines.push(`import { NextRequest, NextResponse } from 'next/server';`);
      lines.push('');

      if (includeValidation && methods.some((m) => ['POST', 'PUT', 'PATCH'].includes(m))) {
        lines.push('interface RequestBody {');
        lines.push('  // Define your request body shape here');
        lines.push('  [key: string]: unknown;');
        lines.push('}');
        lines.push('');
      }

      for (const method of methods) {
        lines.push(`// ${method} ${routePath}`);
        lines.push(`export async function ${method}(request: NextRequest) {`);

        if (includeErrorHandling) {
          lines.push('  try {');
        }

        const indent = includeErrorHandling ? '    ' : '  ';

        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          if (includeValidation) {
            lines.push(`${indent}const body: RequestBody = await request.json();`);
            lines.push('');
            lines.push(`${indent}// Validate request body`);
            lines.push(`${indent}if (!body) {`);
            lines.push(`${indent}  return NextResponse.json({ error: 'Request body is required' }, { status: 400 });`);
            lines.push(`${indent}}`);
          } else {
            lines.push(`${indent}const body = await request.json();`);
          }
          lines.push('');
        }

        if (method === 'GET') {
          lines.push(`${indent}const { searchParams } = new URL(request.url);`);
          lines.push(`${indent}// const param = searchParams.get('param');`);
          lines.push('');
        }

        lines.push(`${indent}// TODO: Implement ${method} logic for ${routePath}`);
        lines.push('');
        lines.push(`${indent}return NextResponse.json({ success: true, data: {} });`);

        if (includeErrorHandling) {
          lines.push('  } catch (error) {');
          lines.push("    console.error(`[${method} ${routePath}]`, error);");
          lines.push(`    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });`);
          lines.push('  }');
        }

        lines.push('}');
        if (methods.indexOf(method) < methods.length - 1) lines.push('');
      }
    } else {
      // Pages Router
      lines.push(`import type { NextApiRequest, NextApiResponse } from 'next';`);
      lines.push('');
      lines.push('interface ResponseData {');
      lines.push('  success: boolean;');
      lines.push('  data?: unknown;');
      lines.push('  error?: string;');
      lines.push('}');
      lines.push('');
      lines.push(`export default async function ${name}Handler(`);
      lines.push('  req: NextApiRequest,');
      lines.push('  res: NextApiResponse<ResponseData>');
      lines.push(') {');

      if (includeErrorHandling) {
        lines.push('  try {');
      }

      const indent = includeErrorHandling ? '    ' : '  ';
      lines.push(`${indent}switch (req.method) {`);

      for (const method of methods) {
        lines.push(`${indent}  case '${method}':`);
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          lines.push(`${indent}    const body = req.body;`);
        }
        lines.push(`${indent}    // TODO: Implement ${method} logic`);
        lines.push(`${indent}    return res.status(200).json({ success: true, data: {} });`);
      }

      lines.push(`${indent}  default:`);
      lines.push(`${indent}    res.setHeader('Allow', [${methods.map((m) => `'${m}'`).join(', ')}]);`);
      lines.push(`${indent}    return res.status(405).json({ success: false, error: 'Method Not Allowed' });`);
      lines.push(`${indent}}`);

      if (includeErrorHandling) {
        lines.push('  } catch (error) {');
        lines.push("    console.error('[API Error]', error);");
        lines.push("    return res.status(500).json({ success: false, error: 'Internal Server Error' });");
        lines.push('  }');
      }

      lines.push('}');
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

        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Handler Name (optional, Pages Router only)
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="users"
          aria-label={`Handler name for ${toolName}`}
          className="input-field w-48 mb-3"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Router Type</label>
        <select
          value={routerType}
          onChange={(e) => setRouterType(e.target.value as 'app' | 'pages')}
          aria-label={`Router type for ${toolName}`}
          className="input-field w-48 mb-3"
        >
          <option value="app">App Router (Next.js 13+)</option>
          <option value="pages">Pages Router</option>
        </select>

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

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeValidation}
              onChange={(e) => setIncludeValidation(e.target.checked)}
              className="rounded border-gray-300"
            />
            Include Validation
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeErrorHandling}
              onChange={(e) => setIncludeErrorHandling(e.target.checked)}
              className="rounded border-gray-300"
            />
            Error Handling
          </label>
        </div>
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate Next.js API route" className="btn-primary">
        Generate Route
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Next.js API Route</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
