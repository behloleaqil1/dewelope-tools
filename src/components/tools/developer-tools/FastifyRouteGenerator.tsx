'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FastifyRouteGenerator - Generate Fastify route handler boilerplate.
 * Creates route definitions with schema validation, handlers, and TypeScript types.
 */
export default function FastifyRouteGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [routePath, setRoutePath] = useState('');
  const [method, setMethod] = useState('GET');
  const [routeName, setRouteName] = useState('');
  const [includeSchema, setIncludeSchema] = useState(true);
  const [includeAuth, setIncludeAuth] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleGenerate() {
    setError('');
    setOutput('');

    if (!routePath.trim()) {
      setError('Please enter a route path');
      return;
    }

    const name = routeName.trim() || routePath.replace(/[^a-zA-Z]/g, '') || 'myRoute';
    const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
    const lines: string[] = [];

    lines.push(`import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';`);
    lines.push('');

    if (includeSchema) {
      lines.push(`const ${name}Schema = {`);
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        lines.push('  body: {');
        lines.push("    type: 'object',");
        lines.push('    required: [],');
        lines.push('    properties: {');
        lines.push("      // Add your body properties here");
        lines.push('    },');
        lines.push('  },');
      }
      if (routePath.includes(':')) {
        lines.push('  params: {');
        lines.push("    type: 'object',");
        lines.push('    properties: {');
        const params = routePath.match(/:(\w+)/g) || [];
        for (const p of params) {
          lines.push(`      ${p.slice(1)}: { type: 'string' },`);
        }
        lines.push('    },');
        lines.push('  },');
      }
      lines.push('  response: {');
      lines.push('    200: {');
      lines.push("      type: 'object',");
      lines.push('      properties: {');
      lines.push("        success: { type: 'boolean' },");
      lines.push("        data: { type: 'object' },");
      lines.push('      },');
      lines.push('    },');
      lines.push('  },');
      lines.push('};');
      lines.push('');
    }

    lines.push(`async function ${name}Handler(`);
    lines.push('  request: FastifyRequest,');
    lines.push('  reply: FastifyReply');
    lines.push(') {');
    lines.push('  try {');
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      lines.push('    const body = request.body;');
    }
    if (routePath.includes(':')) {
      lines.push('    const params = request.params;');
    }
    lines.push('');
    lines.push('    // TODO: Implement your logic here');
    lines.push('');
    lines.push('    return reply.status(200).send({ success: true, data: {} });');
    lines.push('  } catch (error) {');
    lines.push('    request.log.error(error);');
    lines.push("    return reply.status(500).send({ success: false, error: 'Internal Server Error' });");
    lines.push('  }');
    lines.push('}');
    lines.push('');

    lines.push(`export default async function register${capitalName}Route(fastify: FastifyInstance) {`);
    lines.push(`  fastify.${method.toLowerCase()}('${routePath}', {`);
    if (includeSchema) {
      lines.push(`    schema: ${name}Schema,`);
    }
    if (includeAuth) {
      lines.push('    preHandler: [fastify.authenticate],');
    }
    lines.push(`    handler: ${name}Handler,`);
    lines.push('  });');
    lines.push('}');

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
          placeholder="/api/users/:id"
          aria-label={`Route path for ${toolName}`}
          className="input-field mb-3"
        />

        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Route Name (optional)
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="getUser"
          aria-label={`Route name for ${toolName}`}
          className="input-field w-48 mb-3"
        />

        <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">
          HTTP Method
        </label>
        <select
          id={`${toolId}-method`}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          aria-label={`HTTP method for ${toolName}`}
          className="input-field w-40 mb-3"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>

        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeSchema}
              onChange={(e) => setIncludeSchema(e.target.checked)}
              className="rounded border-gray-300"
            />
            Include Schema
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={includeAuth}
              onChange={(e) => setIncludeAuth(e.target.checked)}
              className="rounded border-gray-300"
            />
            Include Auth Hook
          </label>
        </div>
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate Fastify route" className="btn-primary">
        Generate Route
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Fastify Route</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
