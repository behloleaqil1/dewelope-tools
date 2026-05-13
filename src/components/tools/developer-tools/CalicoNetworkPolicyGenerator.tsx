'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CalicoNetworkPolicyGenerator - Generate Calico network policy YAML
 * with configurable selectors, ingress/egress rules, ports, and protocols.
 */
export default function CalicoNetworkPolicyGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [policyName, setPolicyName] = useState('allow-frontend');
  const [namespace, setNamespace] = useState('default');
  const [selectorKey, setSelectorKey] = useState('app');
  const [selectorValue, setSelectorValue] = useState('frontend');
  const [ingressSourceKey, setIngressSourceKey] = useState('app');
  const [ingressSourceValue, setIngressSourceValue] = useState('backend');
  const [port, setPort] = useState('80');
  const [protocol, setProtocol] = useState('TCP');
  const [action, setAction] = useState<'Allow' | 'Deny'>('Allow');
  const [output, setOutput] = useState('');

  const generate = () => {
    const yaml = `apiVersion: projectcalico.org/v3
kind: NetworkPolicy
metadata:
  name: ${policyName}
  namespace: ${namespace}
spec:
  selector: ${selectorKey} == '${selectorValue}'
  types:
    - Ingress
    - Egress
  ingress:
    - action: ${action}
      protocol: ${protocol}
      source:
        selector: ${ingressSourceKey} == '${ingressSourceValue}'
      destination:
        ports:
          - ${port}
  egress:
    - action: ${action}
      protocol: ${protocol}
      destination:
        ports:
          - ${port}`;
    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Policy Name</label>
            <input id={`${toolId}-name`} type="text" value={policyName} onChange={(e) => setPolicyName(e.target.value)} className="input-field" aria-label={`Policy name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-ns`} className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
            <input id={`${toolId}-ns`} type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)} className="input-field" aria-label="Namespace" />
          </div>
          <div>
            <label htmlFor={`${toolId}-selkey`} className="block text-sm font-medium text-gray-700 mb-1">Selector Key</label>
            <input id={`${toolId}-selkey`} type="text" value={selectorKey} onChange={(e) => setSelectorKey(e.target.value)} className="input-field" aria-label="Selector key" />
          </div>
          <div>
            <label htmlFor={`${toolId}-selval`} className="block text-sm font-medium text-gray-700 mb-1">Selector Value</label>
            <input id={`${toolId}-selval`} type="text" value={selectorValue} onChange={(e) => setSelectorValue(e.target.value)} className="input-field" aria-label="Selector value" />
          </div>
          <div>
            <label htmlFor={`${toolId}-srckey`} className="block text-sm font-medium text-gray-700 mb-1">Ingress Source Key</label>
            <input id={`${toolId}-srckey`} type="text" value={ingressSourceKey} onChange={(e) => setIngressSourceKey(e.target.value)} className="input-field" aria-label="Ingress source key" />
          </div>
          <div>
            <label htmlFor={`${toolId}-srcval`} className="block text-sm font-medium text-gray-700 mb-1">Ingress Source Value</label>
            <input id={`${toolId}-srcval`} type="text" value={ingressSourceValue} onChange={(e) => setIngressSourceValue(e.target.value)} className="input-field" aria-label="Ingress source value" />
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input id={`${toolId}-port`} type="text" value={port} onChange={(e) => setPort(e.target.value)} className="input-field" aria-label="Port number" />
          </div>
          <div>
            <label htmlFor={`${toolId}-proto`} className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
            <select id={`${toolId}-proto`} value={protocol} onChange={(e) => setProtocol(e.target.value)} className="input-field" aria-label="Protocol">
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="SCTP">SCTP</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-action`} className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select id={`${toolId}-action`} value={action} onChange={(e) => setAction(e.target.value as 'Allow' | 'Deny')} className="input-field" aria-label="Policy action">
              <option value="Allow">Allow</option>
              <option value="Deny">Deny</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Calico Policy</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Calico Network Policy YAML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
