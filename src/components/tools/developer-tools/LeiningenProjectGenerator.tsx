'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LeiningenProjectGenerator - Generate Clojure Leiningen project.clj files
 * with configurable project name, version, dependencies, and plugins.
 */
export default function LeiningenProjectGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [version, setVersion] = useState('0.1.0-SNAPSHOT');
  const [description, setDescription] = useState('');
  const [mainNs, setMainNs] = useState('');
  const [dependencies, setDependencies] = useState('org.clojure/clojure "1.11.1"');
  const [plugins, setPlugins] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!projectName.trim()) {
      setOutput('Error: Project name is required.');
      return;
    }

    const fullName = groupId.trim() ? `${groupId.trim()}/${projectName.trim()}` : projectName.trim();

    let result = `(defproject ${fullName} "${version}"\n`;

    if (description.trim()) {
      result += `  :description "${description.trim()}"\n`;
    }

    result += `  :url "http://example.com/${projectName.trim()}"\n`;
    result += `  :license {:name "EPL-2.0"\n`;
    result += `            :url "https://www.eclipse.org/legal/epl-2.0/"}\n`;

    // Dependencies
    const deps = dependencies.trim().split('\n').filter(d => d.trim());
    if (deps.length > 0) {
      result += `  :dependencies [\n`;
      deps.forEach(dep => {
        const trimmed = dep.trim();
        if (trimmed.startsWith('[')) {
          result += `    ${trimmed}\n`;
        } else {
          result += `    [${trimmed}]\n`;
        }
      });
      result += `  ]\n`;
    }

    // Plugins
    const pluginList = plugins.trim().split('\n').filter(p => p.trim());
    if (pluginList.length > 0) {
      result += `  :plugins [\n`;
      pluginList.forEach(p => {
        const trimmed = p.trim();
        if (trimmed.startsWith('[')) {
          result += `    ${trimmed}\n`;
        } else {
          result += `    [${trimmed}]\n`;
        }
      });
      result += `  ]\n`;
    }

    if (mainNs.trim()) {
      result += `  :main ^:skip-aot ${mainNs.trim()}\n`;
    }

    result += `  :target-path "target/%s"\n`;
    result += `  :profiles {:uberjar {:aot :all\n`;
    result += `                        :jvm-opts ["-Dclojure.compiler.direct-linking=true"]}})\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-project"
              aria-label={`Project name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-group`} className="block text-sm font-medium text-gray-700 mb-1">
              Group ID
            </label>
            <input
              id={`${toolId}-group`}
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="com.example"
              aria-label="Group ID"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">
              Version
            </label>
            <input
              id={`${toolId}-version`}
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="0.1.0-SNAPSHOT"
              aria-label="Project version"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-main`} className="block text-sm font-medium text-gray-700 mb-1">
              Main Namespace
            </label>
            <input
              id={`${toolId}-main`}
              type="text"
              value={mainNs}
              onChange={(e) => setMainNs(e.target.value)}
              placeholder="my-project.core"
              aria-label="Main namespace"
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            id={`${toolId}-desc`}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A Clojure project"
            aria-label="Project description"
            className="input-field"
          />
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
            Dependencies (one per line)
          </label>
          <textarea
            id={`${toolId}-deps`}
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
            placeholder={'org.clojure/clojure "1.11.1"\nring/ring-core "1.10.0"'}
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
            placeholder={'lein-ring "0.12.6"'}
            aria-label="Plugins"
            className="input-field h-20 resize-y font-mono"
          />
        </div>
        <button
          onClick={generate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate project.clj
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">project.clj</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
