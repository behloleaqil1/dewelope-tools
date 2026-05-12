'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NugetCsprojGenerator - Generate .NET .csproj files with NuGet package references.
 * Creates a valid .csproj XML with configurable target framework, packages, and project settings.
 */
export default function NugetCsprojGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [projectName, setProjectName] = useState('');
  const [targetFramework, setTargetFramework] = useState('net8.0');
  const [outputType, setOutputType] = useState('Library');
  const [nullable, setNullable] = useState(true);
  const [implicitUsings, setImplicitUsings] = useState(true);
  const [packages, setPackages] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!projectName.trim()) {
      setOutput('');
      return;
    }

    const packageRefs: string[] = [];
    if (packages.trim()) {
      packages.trim().split('\n').forEach((line) => {
        const parts = line.trim().split(',');
        if (parts.length >= 1) {
          const name = parts[0].trim();
          const version = parts.length >= 2 ? parts[1].trim() : '*';
          packageRefs.push(`    <PackageReference Include="${name}" Version="${version}" />`);
        }
      });
    }

    let csproj = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>${targetFramework}</TargetFramework>
    <RootNamespace>${projectName.trim().replace(/[^a-zA-Z0-9_.]/g, '_')}</RootNamespace>
    <OutputType>${outputType === 'Library' ? 'Library' : 'Exe'}</OutputType>
    <Nullable>${nullable ? 'enable' : 'disable'}</Nullable>
    <ImplicitUsings>${implicitUsings ? 'enable' : 'disable'}</ImplicitUsings>
  </PropertyGroup>`;

    if (packageRefs.length > 0) {
      csproj += `\n\n  <ItemGroup>\n${packageRefs.join('\n')}\n  </ItemGroup>`;
    }

    csproj += `\n\n</Project>\n`;

    setOutput(csproj);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="MyApp"
              aria-label={`Project name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-framework`} className="block text-sm font-medium text-gray-700 mb-1">
                Target Framework
              </label>
              <select
                id={`${toolId}-framework`}
                value={targetFramework}
                onChange={(e) => setTargetFramework(e.target.value)}
                aria-label="Target framework"
                className="input-field"
              >
                <option value="net6.0">.NET 6.0</option>
                <option value="net7.0">.NET 7.0</option>
                <option value="net8.0">.NET 8.0</option>
                <option value="net9.0">.NET 9.0</option>
                <option value="netstandard2.0">.NET Standard 2.0</option>
                <option value="netstandard2.1">.NET Standard 2.1</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-output`} className="block text-sm font-medium text-gray-700 mb-1">
                Output Type
              </label>
              <select
                id={`${toolId}-output`}
                value={outputType}
                onChange={(e) => setOutputType(e.target.value)}
                aria-label="Output type"
                className="input-field"
              >
                <option value="Library">Library</option>
                <option value="Exe">Executable</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={nullable} onChange={(e) => setNullable(e.target.checked)} className="rounded" />
              Nullable
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={implicitUsings} onChange={(e) => setImplicitUsings(e.target.checked)} className="rounded" />
              Implicit Usings
            </label>
          </div>
          <div>
            <label htmlFor={`${toolId}-packages`} className="block text-sm font-medium text-gray-700 mb-1">
              NuGet Packages (one per line: name, version)
            </label>
            <textarea
              id={`${toolId}-packages`}
              value={packages}
              onChange={(e) => setPackages(e.target.value)}
              placeholder="Newtonsoft.Json, 13.0.3&#10;Microsoft.Extensions.Logging, 8.0.0"
              aria-label="NuGet packages"
              className="input-field h-32 resize-y font-mono"
            />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate .csproj</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{projectName.trim() || 'Project'}.csproj</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
