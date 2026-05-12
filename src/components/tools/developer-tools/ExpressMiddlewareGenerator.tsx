'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ExpressMiddlewareGenerator - Generate Express.js middleware boilerplate code.
 * Supports error handling, authentication, logging, rate limiting, and custom middleware.
 */
export default function ExpressMiddlewareGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'standard' | 'error' | 'async'>('standard');
  const [includeNext, setIncludeNext] = useState(true);
  const [includeLogging, setIncludeLogging] = useState(false);
  const [includeErrorHandling, setIncludeErrorHandling] = useState(true);
  const [useTypescript, setUseTypescript] = useState(true);
  const [output, setOutput] = useState('');

  function generate() {
    const fnName = name.trim() || 'myMiddleware';
    const camelName = fnName.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));

    let code = '';

    if (useTypescript) {
      code += `import { Request, Response, NextFunction } from 'express';\n\n`;
    }

    if (type === 'error') {
      if (useTypescript) {
        code += `/**\n * ${camelName} - Error handling middleware\n */\n`;
        code += `export function ${camelName}(err: Error, req: Request, res: Response, next: NextFunction): void {\n`;
      } else {
        code += `/**\n * ${camelName} - Error handling middleware\n */\n`;
        code += `function ${camelName}(err, req, res, next) {\n`;
      }
      if (includeLogging) {
        code += `  console.error(\`[${camelName}] \${err.message}\`, { stack: err.stack });\n\n`;
      }
      code += `  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;\n`;
      code += `  res.status(statusCode).json({\n`;
      code += `    message: err.message,\n`;
      code += `    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),\n`;
      code += `  });\n`;
      code += `}\n`;
    } else if (type === 'async') {
      if (useTypescript) {
        code += `/**\n * ${camelName} - Async middleware\n */\n`;
        code += `export function ${camelName}(req: Request, res: Response, next: NextFunction): void {\n`;
        code += `  (async () => {\n`;
        code += `    try {\n`;
        if (includeLogging) {
          code += `      console.log(\`[${camelName}] \${req.method} \${req.path}\`);\n\n`;
        }
        code += `      // Your async logic here\n`;
        code += `      // const data = await someAsyncOperation();\n\n`;
        if (includeNext) {
          code += `      next();\n`;
        }
        code += `    } catch (error) {\n`;
        code += `      next(error);\n`;
        code += `    }\n`;
        code += `  })();\n`;
        code += `}\n`;
      } else {
        code += `/**\n * ${camelName} - Async middleware\n */\n`;
        code += `async function ${camelName}(req, res, next) {\n`;
        code += `  try {\n`;
        if (includeLogging) {
          code += `    console.log(\`[${camelName}] \${req.method} \${req.path}\`);\n\n`;
        }
        code += `    // Your async logic here\n`;
        code += `    // const data = await someAsyncOperation();\n\n`;
        if (includeNext) {
          code += `    next();\n`;
        }
        code += `  } catch (error) {\n`;
        code += `    next(error);\n`;
        code += `  }\n`;
        code += `}\n`;
      }
    } else {
      if (useTypescript) {
        code += `/**\n * ${camelName} - Standard middleware\n */\n`;
        code += `export function ${camelName}(req: Request, res: Response, next: NextFunction): void {\n`;
      } else {
        code += `/**\n * ${camelName} - Standard middleware\n */\n`;
        code += `function ${camelName}(req, res, next) {\n`;
      }
      if (includeLogging) {
        code += `  console.log(\`[${camelName}] \${req.method} \${req.path}\`);\n\n`;
      }
      code += `  // Your middleware logic here\n\n`;
      if (includeErrorHandling) {
        code += `  try {\n`;
        code += `    // Process request\n`;
        if (includeNext) {
          code += `    next();\n`;
        }
        code += `  } catch (error) {\n`;
        code += `    next(error);\n`;
        code += `  }\n`;
      } else if (includeNext) {
        code += `  next();\n`;
      }
      code += `}\n`;
    }

    if (!useTypescript) {
      code += `\nmodule.exports = ${camelName};\n`;
    }

    setOutput(code);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Middleware Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. authMiddleware"
          aria-label={`Middleware name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Middleware Type
        </label>
        <select
          id={`${toolId}-type`}
          value={type}
          onChange={(e) => setType(e.target.value as 'standard' | 'error' | 'async')}
          aria-label={`Middleware type for ${toolName}`}
          className="input-field"
        >
          <option value="standard">Standard</option>
          <option value="error">Error Handler</option>
          <option value="async">Async</option>
        </select>
      </InputArea>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={useTypescript} onChange={(e) => setUseTypescript(e.target.checked)} className="rounded" />
          TypeScript
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeNext} onChange={(e) => setIncludeNext(e.target.checked)} className="rounded" />
          Call next()
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeLogging} onChange={(e) => setIncludeLogging(e.target.checked)} className="rounded" />
          Logging
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={includeErrorHandling} onChange={(e) => setIncludeErrorHandling(e.target.checked)} className="rounded" />
          Error Handling
        </label>
      </div>

      <button onClick={generate} aria-label="Generate middleware" className="btn-primary">
        Generate Middleware
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Generated Middleware</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
