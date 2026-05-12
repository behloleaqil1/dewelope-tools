'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SbtBuildGenerator - Generate Scala sbt build.sbt configuration files.
 */
export default function SbtBuildGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [organization, setOrganization] = useState('');
  const [projectName, setProjectName] = useState('');
  const [version, setVersion] = useState('0.1.0');
  const [scalaVersion, setScalaVersion] = useState('3.3.1');
  const [dependencies, setDependencies] = useState('');
  const [plugins, setPlugins] = useState<string[]>([]);
  const [output, setOutput] = useState('');

  const togglePlugin = (plugin: string) => {
    setPlugins((prev) =>
      prev.includes(plugin) ? prev.filter((p) => p !== plugin) : [...prev, plugin]
    );
  };

  const generate = () => {
    let result = '';
    result += `ThisBuild / organization := "${organization || 'com.example'}"\n`;
    result += `ThisBuild / version := "${version}"\n`;
    result += `ThisBuild / scalaVersion := "${scalaVersion}"\n\n`;

    result += `lazy val root = (project in file("."))\n`;

    if (plugins.length > 0) {
      result += `  .enablePlugins(${plugins.join(', ')})\n`;
    }

    result += `  .settings(\n`;
    result += `    name := "${projectName || 'my-project'}",\n`;

    const deps = dependencies
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    if (deps.length > 0) {
      result += `    libraryDependencies ++= Seq(\n`;
      deps.forEach((dep, i) => {
        const comma = i < deps.length - 1 ? ',' : '';
        result += `      ${dep}${comma}\n`;
      });
      result += `    ),\n`;
    }

    result += `    scalacOptions ++= Seq(\n`;
    result += `      "-deprecation",\n`;
    result += `      "-feature",\n`;
    result += `      "-unchecked"\n`;
    result += `    )\n`;
    result += `  )\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-org`} className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <input
                id={`${toolId}-org`}
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="com.example"
                aria-label={`Organization for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                id={`${toolId}-name`}
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-project"
                aria-label="Project name"
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">
                Version
              </label>
              <input
                id={`${toolId}-version`}
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="0.1.0"
                aria-label="Project version"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-scala`} className="block text-sm font-medium text-gray-700 mb-1">
                Scala Version
              </label>
              <select
                id={`${toolId}-scala`}
                value={scalaVersion}
                onChange={(e) => setScalaVersion(e.target.value)}
                aria-label="Scala version"
                className="input-field"
              >
                <option value="3.3.1">Scala 3.3.1</option>
                <option value="3.2.2">Scala 3.2.2</option>
                <option value="2.13.12">Scala 2.13.12</option>
                <option value="2.12.18">Scala 2.12.18</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plugins</label>
            <div className="flex flex-wrap gap-2">
              {['JavaAppPackaging', 'DockerPlugin', 'PlayScala', 'ScalaJSPlugin'].map((plugin) => (
                <button
                  key={plugin}
                  onClick={() => togglePlugin(plugin)}
                  className={`px-3 py-1 rounded text-sm border ${plugins.includes(plugin) ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                >
                  {plugin}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
              Dependencies (one per line, sbt format)
            </label>
            <textarea
              id={`${toolId}-deps`}
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              placeholder={'"org.typelevel" %% "cats-core" % "2.10.0"\n"org.scalatest" %% "scalatest" % "3.2.17" % Test'}
              aria-label="Dependencies list"
              className="input-field h-32 resize-y font-mono"
            />
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate build.sbt
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated build.sbt</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
