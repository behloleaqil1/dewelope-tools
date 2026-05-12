'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PubYamlGenerator - Generate Dart/Flutter pubspec.yaml manifest files.
 * Configurable package name, version, description, dependencies, and environment constraints.
 */
export default function PubYamlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('my_app');
  const [description, setDescription] = useState('A new Flutter project.');
  const [version, setVersion] = useState('1.0.0+1');
  const [sdkMin, setSdkMin] = useState('3.0.0');
  const [sdkMax, setSdkMax] = useState('4.0.0');
  const [flutterSdk, setFlutterSdk] = useState(true);
  const [dependencies, setDependencies] = useState('http: ^1.1.0\nprovider: ^6.0.5');
  const [devDependencies, setDevDependencies] = useState('flutter_test:\n  sdk: flutter\nflutter_lints: ^3.0.0');
  const [output, setOutput] = useState('');

  const generate = () => {
    let yaml = `name: ${name}\n`;
    yaml += `description: "${description}"\n`;
    yaml += `version: ${version}\n`;
    yaml += `publish_to: 'none'\n\n`;
    yaml += `environment:\n`;
    yaml += `  sdk: '>=${sdkMin} <${sdkMax}'\n`;
    if (flutterSdk) {
      yaml += `  flutter: ">=3.10.0"\n`;
    }
    yaml += `\ndependencies:\n`;
    if (flutterSdk) {
      yaml += `  flutter:\n    sdk: flutter\n`;
    }
    const deps = dependencies.trim().split('\n').filter(Boolean);
    deps.forEach(dep => {
      const trimmed = dep.trim();
      if (trimmed.includes(':')) {
        yaml += `  ${trimmed}\n`;
      }
    });
    yaml += `\ndev_dependencies:\n`;
    const devDeps = devDependencies.trim().split('\n').filter(Boolean);
    devDeps.forEach(dep => {
      const trimmed = dep.trim();
      if (trimmed.startsWith('sdk:')) {
        yaml += `    ${trimmed}\n`;
      } else {
        yaml += `  ${trimmed}\n`;
      }
    });
    if (flutterSdk) {
      yaml += `\nflutter:\n  uses-material-design: true\n`;
    }
    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
            <input id={`${toolId}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" aria-label={`Package name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input id={`${toolId}-version`} type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="input-field" aria-label="Package version" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-desc`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input id={`${toolId}-desc`} type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" aria-label="Package description" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-sdk-min`} className="block text-sm font-medium text-gray-700 mb-1">SDK Min Version</label>
            <input id={`${toolId}-sdk-min`} type="text" value={sdkMin} onChange={(e) => setSdkMin(e.target.value)} className="input-field" aria-label="Minimum SDK version" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sdk-max`} className="block text-sm font-medium text-gray-700 mb-1">SDK Max Version</label>
            <input id={`${toolId}-sdk-max`} type="text" value={sdkMax} onChange={(e) => setSdkMax(e.target.value)} className="input-field" aria-label="Maximum SDK version" />
          </div>
        </div>
        <div className="mt-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="checkbox" checked={flutterSdk} onChange={(e) => setFlutterSdk(e.target.checked)} className="rounded" />
            Include Flutter SDK
          </label>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dependencies (one per line: name: ^version)</label>
          <textarea id={`${toolId}-deps`} value={dependencies} onChange={(e) => setDependencies(e.target.value)} className="input-field h-24 resize-y font-mono" aria-label="Dependencies list" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-dev-deps`} className="block text-sm font-medium text-gray-700 mb-1">Dev Dependencies (one per line)</label>
          <textarea id={`${toolId}-dev-deps`} value={devDependencies} onChange={(e) => setDevDependencies(e.target.value)} className="input-field h-24 resize-y font-mono" aria-label="Dev dependencies list" />
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate pubspec.yaml</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated pubspec.yaml</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
