'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Rebar3ConfigGenerator - Generate Erlang rebar3 rebar.config files
 * with configurable dependencies, plugins, profiles, and compiler options.
 */
export default function Rebar3ConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [appName, setAppName] = useState('');
  const [erlOpts, setErlOpts] = useState('debug_info');
  const [dependencies, setDependencies] = useState('');
  const [plugins, setPlugins] = useState('');
  const [relxName, setRelxName] = useState('');
  const [relxVersion, setRelxVersion] = useState('0.1.0');
  const [includeEunit, setIncludeEunit] = useState(true);
  const [includeCt, setIncludeCt] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!appName.trim()) {
      setOutput('Error: Application name is required.');
      return;
    }

    let result = `%% rebar3 configuration for ${appName.trim()}\n\n`;

    // Erlang compiler options
    const opts = erlOpts.trim().split(',').map(o => o.trim()).filter(o => o);
    if (opts.length > 0) {
      result += `{erl_opts, [${opts.join(', ')}]}.\n\n`;
    }

    // Dependencies
    const deps = dependencies.trim().split('\n').filter(d => d.trim());
    if (deps.length > 0) {
      result += `{deps, [\n`;
      deps.forEach((dep, i) => {
        const trimmed = dep.trim();
        const comma = i < deps.length - 1 ? ',' : '';
        if (trimmed.startsWith('{')) {
          result += `  ${trimmed}${comma}\n`;
        } else {
          // Parse simple format: name version
          const parts = trimmed.split(/\s+/);
          if (parts.length >= 2) {
            result += `  {${parts[0]}, "${parts[1]}"}${comma}\n`;
          } else {
            result += `  {${parts[0]}, ".*", {git, "https://github.com/user/${parts[0]}.git", {branch, "main"}}}${comma}\n`;
          }
        }
      });
      result += `]}.\n\n`;
    } else {
      result += `{deps, []}.\n\n`;
    }

    // Plugins
    const pluginList = plugins.trim().split('\n').filter(p => p.trim());
    if (pluginList.length > 0) {
      result += `{plugins, [\n`;
      pluginList.forEach((p, i) => {
        const trimmed = p.trim();
        const comma = i < pluginList.length - 1 ? ',' : '';
        result += `  ${trimmed}${comma}\n`;
      });
      result += `]}.\n\n`;
    }

    // Relx release config
    if (relxName.trim()) {
      result += `{relx, [\n`;
      result += `  {release, {${relxName.trim()}, "${relxVersion}"}, [${appName.trim()}]},\n`;
      result += `  {dev_mode, true},\n`;
      result += `  {include_erts, false}\n`;
      result += `]}.\n\n`;
    }

    // Profiles
    result += `{profiles, [\n`;
    result += `  {prod, [\n`;
    if (relxName.trim()) {
      result += `    {relx, [{dev_mode, false}, {include_erts, true}]}\n`;
    } else {
      result += `    {erl_opts, [no_debug_info]}\n`;
    }
    result += `  ]}`;

    if (includeEunit || includeCt) {
      result += `,\n  {test, [\n`;
      const testDeps: string[] = [];
      if (includeEunit) testDeps.push('    {erl_opts, [nowarn_export_all]}');
      if (includeCt) testDeps.push('    {ct_opts, [{verbose, true}]}');
      result += testDeps.join(',\n');
      result += `\n  ]}`;
    }

    result += `\n]}.\n`;

    // Shell config
    result += `\n{shell, [{apps, [${appName.trim()}]}]}.\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Application Name *
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="my_app"
              aria-label={`Application name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-erlopts`} className="block text-sm font-medium text-gray-700 mb-1">
              Compiler Options (comma-separated)
            </label>
            <input
              id={`${toolId}-erlopts`}
              type="text"
              value={erlOpts}
              onChange={(e) => setErlOpts(e.target.value)}
              placeholder="debug_info, warnings_as_errors"
              aria-label="Erlang compiler options"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-relx`} className="block text-sm font-medium text-gray-700 mb-1">
              Release Name (optional)
            </label>
            <input
              id={`${toolId}-relx`}
              type="text"
              value={relxName}
              onChange={(e) => setRelxName(e.target.value)}
              placeholder="my_app_release"
              aria-label="Release name"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-relxver`} className="block text-sm font-medium text-gray-700 mb-1">
              Release Version
            </label>
            <input
              id={`${toolId}-relxver`}
              type="text"
              value={relxVersion}
              onChange={(e) => setRelxVersion(e.target.value)}
              placeholder="0.1.0"
              aria-label="Release version"
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
            Dependencies (one per line: name version)
          </label>
          <textarea
            id={`${toolId}-deps`}
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
            placeholder={'cowboy 2.10.0\njiffy 1.1.1'}
            aria-label="Dependencies"
            className="input-field h-24 resize-y font-mono"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-plugins`} className="block text-sm font-medium text-gray-700 mb-1">
            Plugins (one per line)
          </label>
          <textarea
            id={`${toolId}-plugins`}
            value={plugins}
            onChange={(e) => setPlugins(e.target.value)}
            placeholder="rebar3_hex"
            aria-label="Plugins"
            className="input-field h-20 resize-y font-mono"
          />
        </div>
        <div className="mt-4 flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={includeEunit} onChange={(e) => setIncludeEunit(e.target.checked)} />
            Include EUnit
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={includeCt} onChange={(e) => setIncludeCt(e.target.checked)} />
            Include Common Test
          </label>
        </div>
        <button
          onClick={generate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate rebar.config
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">rebar.config</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
