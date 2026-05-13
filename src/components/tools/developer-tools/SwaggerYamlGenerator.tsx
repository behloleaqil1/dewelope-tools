'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SwaggerYamlGenerator - Generate OpenAPI/Swagger YAML from endpoint definitions.
 * Users define endpoints with method, path, summary, and parameters to produce valid YAML.
 */
export default function SwaggerYamlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [title, setTitle] = useState('My API');
  const [version, setVersion] = useState('1.0.0');
  const [basePath, setBasePath] = useState('/api/v1');
  const [endpoints, setEndpoints] = useState('GET /users - List all users\nPOST /users - Create a new user\nGET /users/{id} - Get user by ID\nPUT /users/{id} - Update user\nDELETE /users/{id} - Delete user');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!endpoints.trim()) {
      setOutput('Please enter at least one endpoint definition.');
      return;
    }

    const lines = endpoints.trim().split('\n').filter(l => l.trim());
    let yaml = `openapi: "3.0.3"\ninfo:\n  title: "${title}"\n  version: "${version}"\n  description: "Auto-generated OpenAPI specification"\nservers:\n  - url: "${basePath}"\npaths:\n`;

    const pathMap: Record<string, string[]> = {};

    for (const line of lines) {
      const match = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s*-?\s*(.*)?$/i);
      if (!match) continue;

      const method = match[1].toLowerCase();
      const path = match[2];
      const summary = match[3] || `${match[1]} ${path}`;

      if (!pathMap[path]) pathMap[path] = [];

      const params = path.match(/\{(\w+)\}/g);
      let paramYaml = '';
      if (params) {
        paramYaml = '\n      parameters:\n';
        for (const p of params) {
          const name = p.replace(/[{}]/g, '');
          paramYaml += `        - name: ${name}\n          in: path\n          required: true\n          schema:\n            type: string\n`;
        }
      }

      const hasBody = ['post', 'put', 'patch'].includes(method);
      let bodyYaml = '';
      if (hasBody) {
        bodyYaml = `\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              type: object\n`;
      }

      pathMap[path].push(
        `    ${method}:\n      summary: "${summary}"\n      operationId: "${method}${path.replace(/[/{}-]/g, '_').replace(/_+/g, '_')}"\n      tags:\n        - "${path.split('/').filter(s => s && !s.startsWith('{'))[0] || 'default'}"${paramYaml}${bodyYaml}\n      responses:\n        "200":\n          description: "Successful response"\n          content:\n            application/json:\n              schema:\n                type: object\n        "400":\n          description: "Bad request"\n        "404":\n          description: "Not found"\n`
      );
    }

    for (const [path, methods] of Object.entries(pathMap)) {
      yaml += `  ${path}:\n`;
      yaml += methods.join('');
    }

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-title`} className="block text-sm font-medium text-gray-700 mb-1">API Title</label>
              <input id={`${toolId}-title`} type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" aria-label={`API title for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="input-field" aria-label="API version" />
            </div>
            <div>
              <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base Path</label>
              <input id={`${toolId}-base`} type="text" value={basePath} onChange={(e) => setBasePath(e.target.value)} className="input-field" aria-label="API base path" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-endpoints`} className="block text-sm font-medium text-gray-700 mb-1">
              Endpoint Definitions (METHOD /path - description)
            </label>
            <textarea
              id={`${toolId}-endpoints`}
              value={endpoints}
              onChange={(e) => setEndpoints(e.target.value)}
              placeholder="GET /users - List all users&#10;POST /users - Create user&#10;GET /users/{id} - Get user by ID"
              aria-label="Endpoint definitions"
              className="input-field h-40 resize-y font-mono"
            />
          </div>
          <button onClick={generate} className="btn-primary" aria-label="Generate Swagger YAML">
            Generate Swagger YAML
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated OpenAPI YAML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
