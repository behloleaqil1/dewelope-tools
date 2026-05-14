'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KubernetesManifestBuilder - Build K8s deployment YAML.
 */
export default function KubernetesManifestBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [appName, setAppName] = useState('');
  const [image, setImage] = useState('');
  const [replicas, setReplicas] = useState('3');
  const [port, setPort] = useState('80');
  const [cpuLimit, setCpuLimit] = useState('500m');
  const [memLimit, setMemLimit] = useState('256Mi');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function generate() {
    setError('');
    setOutput('');
    if (!appName.trim()) { setError('Please enter an app name'); return; }
    if (!image.trim()) { setError('Please enter a container image'); return; }

    const yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  labels:
    app: ${appName}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${image}
        ports:
        - containerPort: ${port}
        resources:
          limits:
            cpu: "${cpuLimit}"
            memory: "${memLimit}"
          requests:
            cpu: "100m"
            memory: "64Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: ${appName}-service
spec:
  selector:
    app: ${appName}
  ports:
  - protocol: TCP
    port: ${port}
    targetPort: ${port}
  type: ClusterIP`;

    setOutput(yaml);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
            <input id={`${toolId}-name`} type="text" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="my-app" aria-label={`App name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-image`} className="block text-sm font-medium text-gray-700 mb-1">Container Image</label>
            <input id={`${toolId}-image`} type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="nginx:latest" aria-label="Container image" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-replicas`} className="block text-sm font-medium text-gray-700 mb-1">Replicas</label>
            <input id={`${toolId}-replicas`} type="number" min="1" value={replicas} onChange={(e) => setReplicas(e.target.value)} aria-label="Number of replicas" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input id={`${toolId}-port`} type="number" value={port} onChange={(e) => setPort(e.target.value)} aria-label="Container port" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cpu`} className="block text-sm font-medium text-gray-700 mb-1">CPU Limit</label>
            <input id={`${toolId}-cpu`} type="text" value={cpuLimit} onChange={(e) => setCpuLimit(e.target.value)} aria-label="CPU limit" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-mem`} className="block text-sm font-medium text-gray-700 mb-1">Memory Limit</label>
            <input id={`${toolId}-mem`} type="text" value={memLimit} onChange={(e) => setMemLimit(e.target.value)} aria-label="Memory limit" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate Kubernetes manifest" className="btn-primary">
        Generate Manifest
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Kubernetes Deployment + Service YAML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
