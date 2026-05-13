'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IstioVirtualserviceGenerator - Generate Istio VirtualService manifest YAML
 * from user-provided service name, host, routes, and traffic rules.
 */
export default function IstioVirtualserviceGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [serviceName, setServiceName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [hosts, setHosts] = useState('');
  const [gateway, setGateway] = useState('');
  const [destHost, setDestHost] = useState('');
  const [destPort, setDestPort] = useState('80');
  const [matchPrefix, setMatchPrefix] = useState('/');
  const [timeout, setTimeout] = useState('');
  const [retries, setRetries] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!serviceName.trim() || !destHost.trim()) {
      setOutput('Error: Service name and destination host are required.');
      return;
    }

    const hostList = hosts.trim() ? hosts.split(',').map(h => h.trim()).filter(Boolean) : [destHost.trim()];
    const hostsYaml = hostList.map(h => `    - "${h}"`).join('\n');

    let routeSpec = `      - destination:\n          host: ${destHost.trim()}`;
    if (destPort.trim()) {
      routeSpec += `\n          port:\n            number: ${parseInt(destPort, 10) || 80}`;
    }

    let matchYaml = '';
    if (matchPrefix.trim() && matchPrefix.trim() !== '/') {
      matchYaml = `      match:\n      - uri:\n          prefix: "${matchPrefix.trim()}"\n`;
    }

    let extraSpec = '';
    if (timeout.trim()) {
      extraSpec += `      timeout: ${timeout.trim()}\n`;
    }
    if (retries.trim()) {
      const retryNum = parseInt(retries, 10) || 3;
      extraSpec += `      retries:\n        attempts: ${retryNum}\n        perTryTimeout: 2s\n`;
    }

    let gatewayYaml = '';
    if (gateway.trim()) {
      gatewayYaml = `  gateways:\n    - ${gateway.trim()}\n`;
    }

    const yaml = `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ${serviceName.trim()}
  namespace: ${namespace.trim()}
spec:
  hosts:
${hostsYaml}
${gatewayYaml}  http:
  - route:
${routeSpec}
${matchYaml}${extraSpec}`;

    setOutput(yaml.replace(/\n{3,}/g, '\n\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input id={`${toolId}-name`} type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="my-service" aria-label={`Service name for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ns`} className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
            <input id={`${toolId}-ns`} type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)} placeholder="default" aria-label="Namespace" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-hosts`} className="block text-sm font-medium text-gray-700 mb-1">Hosts (comma-separated)</label>
            <input id={`${toolId}-hosts`} type="text" value={hosts} onChange={(e) => setHosts(e.target.value)} placeholder="example.com, api.example.com" aria-label="Hosts" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-gw`} className="block text-sm font-medium text-gray-700 mb-1">Gateway (optional)</label>
            <input id={`${toolId}-gw`} type="text" value={gateway} onChange={(e) => setGateway(e.target.value)} placeholder="my-gateway" aria-label="Gateway" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dest`} className="block text-sm font-medium text-gray-700 mb-1">Destination Host</label>
            <input id={`${toolId}-dest`} type="text" value={destHost} onChange={(e) => setDestHost(e.target.value)} placeholder="my-service.default.svc.cluster.local" aria-label="Destination host" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Destination Port</label>
            <input id={`${toolId}-port`} type="text" value={destPort} onChange={(e) => setDestPort(e.target.value)} placeholder="80" aria-label="Destination port" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-prefix`} className="block text-sm font-medium text-gray-700 mb-1">Match Prefix</label>
            <input id={`${toolId}-prefix`} type="text" value={matchPrefix} onChange={(e) => setMatchPrefix(e.target.value)} placeholder="/" aria-label="Match prefix" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-timeout`} className="block text-sm font-medium text-gray-700 mb-1">Timeout (e.g. 30s)</label>
            <input id={`${toolId}-timeout`} type="text" value={timeout} onChange={(e) => setTimeout(e.target.value)} placeholder="30s" aria-label="Timeout" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-retries`} className="block text-sm font-medium text-gray-700 mb-1">Retries (attempts)</label>
            <input id={`${toolId}-retries`} type="text" value={retries} onChange={(e) => setRetries(e.target.value)} placeholder="3" aria-label="Retries" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate VirtualService</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Manifest</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
