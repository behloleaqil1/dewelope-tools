'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FluxKustomizationGenerator - Generate Flux CD Kustomization manifest YAML.
 * Creates a valid Flux Kustomization resource with configurable source, path, interval, and prune settings.
 */
export default function FluxKustomizationGenerator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('flux-system');
  const [sourceKind, setSourceKind] = useState('GitRepository');
  const [sourceName, setSourceName] = useState('');
  const [path, setPath] = useState('./');
  const [interval, setInterval] = useState('5m');
  const [pruneEnabled, setPruneEnabled] = useState(true);
  const [targetNamespace, setTargetNamespace] = useState('');
  const [timeout, setTimeout] = useState('2m');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!name || !sourceName) {
      setOutput('# Please fill in Name and Source Name');
      return;
    }

    let yaml = `apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: ${name}
  namespace: ${namespace}
spec:
  interval: ${interval}
  timeout: ${timeout}
  sourceRef:
    kind: ${sourceKind}
    name: ${sourceName}
  path: ${path}
  prune: ${pruneEnabled}`;

    if (targetNamespace) {
      yaml += `
  targetNamespace: ${targetNamespace}`;
    }

    yaml += `
  wait: true
  force: false`;

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id={`${toolId}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="my-app" aria-label="Kustomization name" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ns`} className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
            <input id={`${toolId}-ns`} type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)} placeholder="flux-system" aria-label="Kustomization namespace" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-srckind`} className="block text-sm font-medium text-gray-700 mb-1">Source Kind</label>
            <select id={`${toolId}-srckind`} value={sourceKind} onChange={(e) => setSourceKind(e.target.value)} aria-label="Source kind" className="input-field">
              <option value="GitRepository">GitRepository</option>
              <option value="OCIRepository">OCIRepository</option>
              <option value="Bucket">Bucket</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-srcname`} className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
            <input id={`${toolId}-srcname`} type="text" value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="flux-system" aria-label="Source reference name" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">Path</label>
            <input id={`${toolId}-path`} type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="./" aria-label="Path in source" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-interval`} className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
            <input id={`${toolId}-interval`} type="text" value={interval} onChange={(e) => setInterval(e.target.value)} placeholder="5m" aria-label="Reconciliation interval" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-timeout`} className="block text-sm font-medium text-gray-700 mb-1">Timeout</label>
            <input id={`${toolId}-timeout`} type="text" value={timeout} onChange={(e) => setTimeout(e.target.value)} placeholder="2m" aria-label="Apply timeout" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-targetns`} className="block text-sm font-medium text-gray-700 mb-1">Target Namespace (optional)</label>
            <input id={`${toolId}-targetns`} type="text" value={targetNamespace} onChange={(e) => setTargetNamespace(e.target.value)} placeholder="default" aria-label="Target namespace" className="input-field" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={pruneEnabled} onChange={(e) => setPruneEnabled(e.target.checked)} aria-label="Enable prune" /> Prune
          </label>
        </div>
        <button onClick={generate} className="btn-primary mt-3" aria-label="Generate Flux Kustomization YAML">
          Generate YAML
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Flux Kustomization Manifest</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
