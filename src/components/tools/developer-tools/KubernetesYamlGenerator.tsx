'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KubernetesYamlGenerator - Generate Kubernetes deployment/service YAML from form inputs.
 */
export default function KubernetesYamlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [appName, setAppName] = useState('');
  const [image, setImage] = useState('');
  const [replicas, setReplicas] = useState('1');
  const [containerPort, setContainerPort] = useState('80');
  const [serviceType, setServiceType] = useState<'ClusterIP' | 'NodePort' | 'LoadBalancer'>('ClusterIP');
  const [namespace, setNamespace] = useState('default');
  const [includeService, setIncludeService] = useState(true);
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generate = () => {
    const newErrors: Record<string, string> = {};
    if (!appName.trim()) newErrors.appName = 'App name is required';
    if (!image.trim()) newErrors.image = 'Container image is required';
    if (!replicas.trim() || isNaN(parseInt(replicas)) || parseInt(replicas) < 1) newErrors.replicas = 'Enter a valid number of replicas';
    if (!containerPort.trim() || isNaN(parseInt(containerPort))) newErrors.containerPort = 'Enter a valid port number';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setOutput('');
      return;
    }
    setErrors({});

    const name = appName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    let yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${name}
  namespace: ${namespace}
  labels:
    app: ${name}
spec:
  replicas: ${parseInt(replicas)}
  selector:
    matchLabels:
      app: ${name}
  template:
    metadata:
      labels:
        app: ${name}
    spec:
      containers:
        - name: ${name}
          image: ${image.trim()}
          ports:
            - containerPort: ${parseInt(containerPort)}
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"`;

    if (includeService) {
      yaml += `
---
apiVersion: v1
kind: Service
metadata:
  name: ${name}-service
  namespace: ${namespace}
spec:
  type: ${serviceType}
  selector:
    app: ${name}
  ports:
    - protocol: TCP
      port: ${parseInt(containerPort)}
      targetPort: ${parseInt(containerPort)}`;
    }

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.appName}>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
        <input id={`${toolId}-name`} type="text" value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="my-app" aria-label={`Application name for ${toolName}`} className="input-field" />
      </InputArea>

      <InputArea error={errors.image}>
        <label htmlFor={`${toolId}-image`} className="block text-sm font-medium text-gray-700 mb-1">Container Image</label>
        <input id={`${toolId}-image`} type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="nginx:latest" aria-label={`Container image for ${toolName}`} className="input-field" />
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.replicas}>
          <label htmlFor={`${toolId}-replicas`} className="block text-sm font-medium text-gray-700 mb-1">Replicas</label>
          <input id={`${toolId}-replicas`} type="number" min="1" value={replicas} onChange={(e) => setReplicas(e.target.value)} aria-label={`Replicas for ${toolName}`} className="input-field" />
        </InputArea>

        <InputArea error={errors.containerPort}>
          <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Container Port</label>
          <input id={`${toolId}-port`} type="number" value={containerPort} onChange={(e) => setContainerPort(e.target.value)} aria-label={`Container port for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-namespace`} className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
        <input id={`${toolId}-namespace`} type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)} placeholder="default" aria-label={`Namespace for ${toolName}`} className="input-field" />
      </InputArea>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeService} onChange={(e) => setIncludeService(e.target.checked)} className="rounded" />
          Include Service
        </label>
        {includeService && (
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value as 'ClusterIP' | 'NodePort' | 'LoadBalancer')} className="input-field w-auto" aria-label="Service type">
            <option value="ClusterIP">ClusterIP</option>
            <option value="NodePort">NodePort</option>
            <option value="LoadBalancer">LoadBalancer</option>
          </select>
        )}
      </div>

      <button onClick={generate} className="btn-primary" aria-label="Generate Kubernetes YAML">Generate YAML</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated YAML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
