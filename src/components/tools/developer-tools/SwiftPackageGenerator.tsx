'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SwiftPackageGenerator - Generate Swift Package.swift manifest files.
 * Creates a valid Package.swift with configurable name, platforms, dependencies, and targets.
 */
export default function SwiftPackageGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [packageName, setPackageName] = useState('');
  const [platforms, setPlatforms] = useState({ iOS: '15.0', macOS: '12.0', watchOS: '', tvOS: '' });
  const [dependencies, setDependencies] = useState('');
  const [targets, setTargets] = useState('');
  const [swiftVersion, setSwiftVersion] = useState('5.9');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!packageName.trim()) {
      setOutput('');
      return;
    }

    const name = packageName.trim();
    const platformLines: string[] = [];
    if (platforms.iOS) platformLines.push(`        .iOS(.v${platforms.iOS.replace('.', '_')})`);
    if (platforms.macOS) platformLines.push(`        .macOS(.v${platforms.macOS.replace('.', '_')})`);
    if (platforms.watchOS) platformLines.push(`        .watchOS(.v${platforms.watchOS.replace('.', '_')})`);
    if (platforms.tvOS) platformLines.push(`        .tvOS(.v${platforms.tvOS.replace('.', '_')})`);

    const depLines: string[] = [];
    const depImports: string[] = [];
    if (dependencies.trim()) {
      dependencies.trim().split('\n').forEach((line) => {
        const parts = line.trim().split(',');
        if (parts.length >= 2) {
          const url = parts[0].trim();
          const version = parts[1].trim();
          const depName = url.split('/').pop()?.replace('.git', '') || 'Package';
          depLines.push(`        .package(url: "${url}", from: "${version}")`);
          depImports.push(`                .product(name: "${depName}", package: "${depName}")`);
        }
      });
    }

    const targetNames = targets.trim() ? targets.trim().split('\n').map(t => t.trim()).filter(Boolean) : [name];

    let manifest = `// swift-tools-version:${swiftVersion}
import PackageDescription

let package = Package(
    name: "${name}",`;

    if (platformLines.length > 0) {
      manifest += `\n    platforms: [\n${platformLines.join(',\n')}\n    ],`;
    }

    manifest += `\n    products: [
        .library(
            name: "${name}",
            targets: ["${targetNames[0]}"]
        ),
    ],`;

    if (depLines.length > 0) {
      manifest += `\n    dependencies: [\n${depLines.join(',\n')}\n    ],`;
    } else {
      manifest += `\n    dependencies: [],`;
    }

    manifest += `\n    targets: [`;
    targetNames.forEach((t) => {
      manifest += `\n        .target(\n            name: "${t}"`;
      if (depImports.length > 0) {
        manifest += `,\n            dependencies: [\n${depImports.join(',\n')}\n            ]`;
      }
      manifest += `\n        ),`;
      manifest += `\n        .testTarget(\n            name: "${t}Tests",\n            dependencies: ["${t}"]\n        ),`;
    });
    manifest += `\n    ]
)
`;

    setOutput(manifest);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
              Package Name
            </label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="MySwiftPackage"
              aria-label={`Package name for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-swift`} className="block text-sm font-medium text-gray-700 mb-1">
              Swift Tools Version
            </label>
            <select
              id={`${toolId}-swift`}
              value={swiftVersion}
              onChange={(e) => setSwiftVersion(e.target.value)}
              aria-label="Swift tools version"
              className="input-field"
            >
              <option value="5.7">5.7</option>
              <option value="5.8">5.8</option>
              <option value="5.9">5.9</option>
              <option value="5.10">5.10</option>
              <option value="6.0">6.0</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${toolId}-ios`} className="block text-sm font-medium text-gray-700 mb-1">iOS Version</label>
              <input id={`${toolId}-ios`} type="text" value={platforms.iOS} onChange={(e) => setPlatforms({ ...platforms, iOS: e.target.value })} placeholder="15.0" aria-label="iOS minimum version" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-macos`} className="block text-sm font-medium text-gray-700 mb-1">macOS Version</label>
              <input id={`${toolId}-macos`} type="text" value={platforms.macOS} onChange={(e) => setPlatforms({ ...platforms, macOS: e.target.value })} placeholder="12.0" aria-label="macOS minimum version" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-watchos`} className="block text-sm font-medium text-gray-700 mb-1">watchOS Version</label>
              <input id={`${toolId}-watchos`} type="text" value={platforms.watchOS} onChange={(e) => setPlatforms({ ...platforms, watchOS: e.target.value })} placeholder="8.0" aria-label="watchOS minimum version" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tvos`} className="block text-sm font-medium text-gray-700 mb-1">tvOS Version</label>
              <input id={`${toolId}-tvos`} type="text" value={platforms.tvOS} onChange={(e) => setPlatforms({ ...platforms, tvOS: e.target.value })} placeholder="15.0" aria-label="tvOS minimum version" className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">
              Dependencies (one per line: url, version)
            </label>
            <textarea
              id={`${toolId}-deps`}
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              placeholder="https://github.com/apple/swift-argument-parser.git, 1.2.0"
              aria-label="Package dependencies"
              className="input-field h-24 resize-y font-mono"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-targets`} className="block text-sm font-medium text-gray-700 mb-1">
              Targets (one per line, leave empty for package name)
            </label>
            <textarea
              id={`${toolId}-targets`}
              value={targets}
              onChange={(e) => setTargets(e.target.value)}
              placeholder="MyLibrary"
              aria-label="Package targets"
              className="input-field h-20 resize-y font-mono"
            />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Package.swift</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Package.swift</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
