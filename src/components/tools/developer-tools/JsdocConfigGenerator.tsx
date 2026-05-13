'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsdocConfigGenerator - Generate JSDoc jsdoc.json configuration files.
 */
export default function JsdocConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [source, setSource] = useState('./src');
  const [destination, setDestination] = useState('./docs');
  const [recurse, setRecurse] = useState(true);
  const [includePrivate, setIncludePrivate] = useState(false);
  const [template, setTemplate] = useState('default');
  const [plugins, setPlugins] = useState('markdown');
  const [output, setOutput] = useState('');

  const generate = () => {
    const config: Record<string, unknown> = {
      source: {
        include: [source],
        includePattern: '.+\\.js(doc|x)?$',
        excludePattern: '(^|\\/|\\\\)_',
      },
      opts: {
        destination: destination,
        recurse: recurse,
        template: template === 'default' ? undefined : `./node_modules/${template}`,
      },
      plugins: plugins.split(',').map(p => p.trim()).filter(Boolean),
      templates: {
        cleverLinks: false,
        monospaceLinks: false,
      },
    };

    if (includePrivate) {
      config.opts = { ...(config.opts as object), access: 'all' };
    }

    // Clean undefined values from opts
    const opts = config.opts as Record<string, unknown>;
    Object.keys(opts).forEach(key => {
      if (opts[key] === undefined) delete opts[key];
    });

    setOutput(JSON.stringify(config, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">
              Source Directory
            </label>
            <input
              id={`${toolId}-source`}
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="input-field"
              aria-label={`Source directory for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-dest`} className="block text-sm font-medium text-gray-700 mb-1">
              Destination Directory
            </label>
            <input
              id={`${toolId}-dest`}
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-field"
              aria-label="Destination directory"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-plugins`} className="block text-sm font-medium text-gray-700 mb-1">
              Plugins (comma-separated)
            </label>
            <input
              id={`${toolId}-plugins`}
              type="text"
              value={plugins}
              onChange={(e) => setPlugins(e.target.value)}
              className="input-field"
              aria-label="Plugins"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-template`} className="block text-sm font-medium text-gray-700 mb-1">
              Template
            </label>
            <select
              id={`${toolId}-template`}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="input-field"
              aria-label="Template"
            >
              <option value="default">Default</option>
              <option value="docdash">Docdash</option>
              <option value="better-docs">Better Docs</option>
              <option value="clean-jsdoc-theme">Clean JSDoc Theme</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={recurse}
                onChange={(e) => setRecurse(e.target.checked)}
              />
              Recurse subdirectories
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includePrivate}
                onChange={(e) => setIncludePrivate(e.target.checked)}
              />
              Include private members
            </label>
          </div>
          <button
            onClick={generate}
            className="btn-primary"
            aria-label="Generate JSDoc config"
          >
            Generate jsdoc.json
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated jsdoc.json</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
