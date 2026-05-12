'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function MixExsGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [appName, setAppName] = useState('my_app');
  const [version, setVersion] = useState('0.1.0');
  const [elixirVersion, setElixirVersion] = useState('~> 1.14');
  const [description, setDescription] = useState('');
  const [deps, setDeps] = useState('phoenix, ecto, jason');
  const [output, setOutput] = useState('');

  const generate = () => {
    const depList = deps
      .split(',')
      .map(d => d.trim())
      .filter(Boolean)
      .map(d => `      {:${d}, "~> 0.1"}`)
      .join(',\n');

    const result = `defmodule ${toPascalCase(appName)}.MixProject do
  use Mix.Project

  def project do
    [
      app: :${appName},
      version: "${version}",
      elixir: "${elixirVersion}",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      description: "${description}"
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {${toPascalCase(appName)}.Application, []}
    ]
  end

  defp deps do
    [
${depList}
    ]
  end
end
`;
    setOutput(result);
  };

  function toPascalCase(str: string): string {
    return str
      .split('_')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-app`} className="block text-sm font-medium text-gray-700 mb-1">App Name (snake_case)</label>
            <input id={`${toolId}-app`} type="text" value={appName} onChange={(e) => setAppName(e.target.value)} className="input-field" aria-label={`App name for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="input-field" aria-label="Version" />
            </div>
            <div>
              <label htmlFor={`${toolId}-elixir`} className="block text-sm font-medium text-gray-700 mb-1">Elixir Version</label>
              <input id={`${toolId}-elixir`} type="text" value={elixirVersion} onChange={(e) => setElixirVersion(e.target.value)} className="input-field" aria-label="Elixir version" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" placeholder="A brief description of your project" aria-label="Description" />
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (comma-separated)</label>
            <input id={`${toolId}-deps`} type="text" value={deps} onChange={(e) => setDeps(e.target.value)} className="input-field" placeholder="phoenix, ecto, jason" aria-label="Dependencies" />
          </div>
          <button onClick={generate} className="btn-primary">Generate mix.exs</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated mix.exs</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
