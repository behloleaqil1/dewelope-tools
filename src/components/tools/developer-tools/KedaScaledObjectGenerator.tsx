'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KedaScaledObjectGenerator - Generate KEDA ScaledObject manifest YAML.
 */
export default function KedaScaledObjectGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [name, setName] = useState('my-scaledobject');
  const [namespace, setNamespace] = useState('default');
  const [deploymentName, setDeploymentName] = useState('my-deployment');
  const [triggerType, setTriggerType] = useState('cpu');
  const [minReplicas, setMinReplicas] = useState('1');
  const [maxReplicas, setMaxReplicas] = useState('10');
  const [threshold, setThreshold] = useState('50');
  const [cooldownPeriod, setCooldownPeriod] = useState('300');
  const [output, setOutput] = useState('');

  const generate = () => {
    let triggerMetadata = '';
    switch (triggerType) {
      case 'cpu':
        triggerMetadata = `        type: Utilization\n        value: "${threshold}"`;
        break;
      case 'memory':
        triggerMetadata = `        type: Utilization\n        value: "${threshold}"`;
        break;
      case 'prometheus':
        triggerMetadata = `        serverAddress: http://prometheus.monitoring.svc.cluster.local:9090\n        metricName: http_requests_total\n        threshold: "${threshold}"\n        query: sum(rate(http_requests_total[2m]))`;
        break;
      case 'rabbitmq':
        triggerMetadata = `        host: amqp://guest:guest@rabbitmq.default.svc.cluster.local:5672\n        queueName: my-queue\n        queueLength: "${threshold}"`;
        break;
      case 'kafka':
        triggerMetadata = `        bootstrapServers: kafka.default.svc.cluster.local:9092\n        consumerGroup: my-group\n        topic: my-topic\n        lagThreshold: "${threshold}"`;
        break;
      default:
        triggerMetadata = `        value: "${threshold}"`;
    }

    const yaml = `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: ${name}
  namespace: ${namespace}
spec:
  scaleTargetRef:
    name: ${deploymentName}
  minReplicaCount: ${minReplicas}
  maxReplicaCount: ${maxReplicas}
  cooldownPeriod: ${cooldownPeriod}
  triggers:
    - type: ${triggerType}
      metadata:
${triggerMetadata}`;

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">ScaledObject Name</label>
            <input id={`${toolId}-name`} type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" aria-label={`ScaledObject name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-ns`} className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
            <input id={`${toolId}-ns`} type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)} className="input-field" aria-label="Namespace" />
          </div>
          <div>
            <label htmlFor={`${toolId}-deploy`} className="block text-sm font-medium text-gray-700 mb-1">Deployment Name</label>
            <input id={`${toolId}-deploy`} type="text" value={deploymentName} onChange={(e) => setDeploymentName(e.target.value)} className="input-field" aria-label="Target deployment name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-trigger`} className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
            <select id={`${toolId}-trigger`} value={triggerType} onChange={(e) => setTriggerType(e.target.value)} className="input-field" aria-label="Trigger type">
              <option value="cpu">CPU</option>
              <option value="memory">Memory</option>
              <option value="prometheus">Prometheus</option>
              <option value="rabbitmq">RabbitMQ</option>
              <option value="kafka">Kafka</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-min`} className="block text-sm font-medium text-gray-700 mb-1">Min Replicas</label>
              <input id={`${toolId}-min`} type="number" value={minReplicas} onChange={(e) => setMinReplicas(e.target.value)} className="input-field" aria-label="Minimum replicas" />
            </div>
            <div>
              <label htmlFor={`${toolId}-max`} className="block text-sm font-medium text-gray-700 mb-1">Max Replicas</label>
              <input id={`${toolId}-max`} type="number" value={maxReplicas} onChange={(e) => setMaxReplicas(e.target.value)} className="input-field" aria-label="Maximum replicas" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-threshold`} className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
              <input id={`${toolId}-threshold`} type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="input-field" aria-label="Scaling threshold" />
            </div>
            <div>
              <label htmlFor={`${toolId}-cooldown`} className="block text-sm font-medium text-gray-700 mb-1">Cooldown (s)</label>
              <input id={`${toolId}-cooldown`} type="number" value={cooldownPeriod} onChange={(e) => setCooldownPeriod(e.target.value)} className="input-field" aria-label="Cooldown period in seconds" />
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate ScaledObject</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">KEDA ScaledObject YAML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
