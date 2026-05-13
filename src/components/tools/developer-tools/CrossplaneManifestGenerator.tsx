'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CrossplaneManifestGenerator - Generate Crossplane composite resource manifests.
 * Creates XRD and Composition YAML for Crossplane managed resources.
 */
export default function CrossplaneManifestGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [resourceName, setResourceName] = useState('MyDatabase');
  const [group, setGroup] = useState('example.org');
  const [version, setVersion] = useState('v1alpha1');
  const [provider, setProvider] = useState('aws');
  const [managedResource, setManagedResource] = useState('RDSInstance');
  const [parameters, setParameters] = useState('region: us-east-1\nengine: postgres\nengineVersion: "14"');
  const [output, setOutput] = useState('');

  const generate = () => {
    const kindName = resourceName.replace(/[^a-zA-Z0-9]/g, '');
    const plural = kindName.toLowerCase() + 's';

    const xrd = `apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: x${plural}.${group}
spec:
  group: ${group}
  names:
    kind: X${kindName}
    plural: x${plural}
  versions:
    - name: ${version}
      served: true
      referenceable: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                parameters:
                  type: object
                  properties:
${parameters.split('\n').filter(l => l.trim()).map(l => {
  const key = l.split(':')[0].trim();
  return `                    ${key}:\n                      type: string`;
}).join('\n')}`;

    const composition = `
---
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: ${kindName.toLowerCase()}-${provider}
spec:
  compositeTypeRef:
    apiVersion: ${group}/${version}
    kind: X${kindName}
  resources:
    - name: ${managedResource.toLowerCase()}
      base:
        apiVersion: ${provider}.crossplane.io/${version}
        kind: ${managedResource}
        spec:
          forProvider:
${parameters.split('\n').filter(l => l.trim()).map(l => {
  const parts = l.split(':');
  const key = parts[0].trim();
  const val = parts.slice(1).join(':').trim();
  return `            ${key}: ${val}`;
}).join('\n')}`;

    setOutput(xrd + '\n' + composition);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
              <input id={`${toolId}-name`} type="text" value={resourceName} onChange={e => setResourceName(e.target.value)} className="input-field" aria-label={`Resource name for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-group`} className="block text-sm font-medium text-gray-700 mb-1">API Group</label>
              <input id={`${toolId}-group`} type="text" value={group} onChange={e => setGroup(e.target.value)} className="input-field" aria-label="API group" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <input id={`${toolId}-version`} type="text" value={version} onChange={e => setVersion(e.target.value)} className="input-field" aria-label="API version" />
            </div>
            <div>
              <label htmlFor={`${toolId}-provider`} className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <input id={`${toolId}-provider`} type="text" value={provider} onChange={e => setProvider(e.target.value)} className="input-field" aria-label="Cloud provider" />
            </div>
            <div>
              <label htmlFor={`${toolId}-managed`} className="block text-sm font-medium text-gray-700 mb-1">Managed Resource Kind</label>
              <input id={`${toolId}-managed`} type="text" value={managedResource} onChange={e => setManagedResource(e.target.value)} className="input-field" aria-label="Managed resource kind" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-params`} className="block text-sm font-medium text-gray-700 mb-1">Parameters (key: value per line)</label>
            <textarea id={`${toolId}-params`} value={parameters} onChange={e => setParameters(e.target.value)} className="input-field h-28 resize-y font-mono" aria-label="Resource parameters" />
          </div>
          <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]">Generate Manifest</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Crossplane Manifest</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
