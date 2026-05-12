'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HexPmGenerator - Generate Elixir Hex package mix.exs deps entries.
 */
export default function HexPmGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packages, setPackages] = useState('phoenix ~> 1.7\necto ~> 3.10\njason ~> 1.4');
  const [format, setFormat] = useState<'deps' | 'full'>('deps');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines = packages.split('\n').filter(l => l.trim());
    const deps = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      const name = parts[0];
      const version = parts.slice(1).join(' ');
      if (version) {
        return `      {:${name}, "${version}"}`;
      }
      return `      {:${name}, ">= 0.0.0"}`;
    });

    if (format === 'full') {
      const result = `  defp deps do
    [
${deps.join(',\n')}
    ]
  end`;
      setOutput(result);
    } else {
      setOutput(deps.join(',\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-packages`} className="block text-sm font-medium text-gray-700 mb-1">
          Packages (one per line: name version_constraint)
        </label>
        <textarea
          id={`${toolId}-packages`}
          value={packages}
          onChange={(e) => setPackages(e.target.value)}
          placeholder="phoenix ~> 1.7&#10;ecto ~> 3.10"
          aria-label={`Package list for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" checked={format === 'deps'} onChange={() => setFormat('deps')} name="format" />
              <span className="text-sm">Deps list only</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={format === 'full'} onChange={() => setFormat('full')} name="format" />
              <span className="text-sm">Full deps function</span>
            </label>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Deps</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated mix.exs Deps</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
