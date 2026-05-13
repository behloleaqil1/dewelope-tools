'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LinkerdServiceProfileGenerator - Generate Linkerd ServiceProfile manifest YAML
 * with configurable routes, retries, and timeouts.
 */
export default function LinkerdServiceProfileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [serviceName, setServiceName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [routeName, setRouteName] = useState('');
  const [routeMethod, setRouteMethod] = useState('GET');
  const [routePath, setRoutePath] = useState('/');
  const [isRetryable, setIsRetryable] = useState(false);
  const [timeout, setTimeout] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!serviceName.trim()) {
      setOutput('Error: Service name is required.');
      return;
    }

    const fqdn = serviceName.includes('.') ? serviceName.trim() : `${serviceName.trim()}.${namespace.trim()}.svc.cluster.local`;
    const rName = routeName.trim() || `${routeMethod} ${routePath.trim()}`;

    let routeSpec = '';
    if (routePath.trim()) {
      routeSpec = `  routes:
  - name: "${rName}"
    condition:
      method: ${routeMethod}
      pathRegex: "${routePath.trim()}"
    isRetryable: ${isRetryable}`;
      if (timeout.trim()) {
        routeSpec += `\n    timeout: ${timeout.trim()}`;
      }
    }

    const yaml = `apiVersion: linkerd.io/v1alpha2
kind: ServiceProfile
metadata:
  name: ${fqdn}
  namespace: ${namespace.trim()}
spec:
${routeSpec || '  routes: []'}
`;

    setOutput(yaml);
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
            <label htmlFor={`${toolId}-route-name`} className="block text-sm font-medium text-gray-700 mb-1">Route Name (optional)</label>
            <input id={`${toolId}-route-name`} type="text" value={routeName} onChange={(e) => setRouteName(e.target.value)} placeholder="GET /api/users" aria-label="Route name" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-method`} className="block text-sm font-medium text-gray-700 mb-1">HTTP Method</label>
            <select id={`${toolId}-method`} value={routeMethod} onChange={(e) => setRouteMethod(e.target.value)} aria-label="HTTP method" className="input-field">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
              <option value="HEAD">HEAD</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">Path Regex</label>
            <input id={`${toolId}-path`} type="text" value={routePath} onChange={(e) => setRoutePath(e.target.value)} placeholder="/api/.*" aria-label="Path regex" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-timeout`} className="block text-sm font-medium text-gray-700 mb-1">Timeout (e.g. 500ms)</label>
            <input id={`${toolId}-timeout`} type="text" value={timeout} onChange={(e) => setTimeout(e.target.value)} placeholder="500ms" aria-label="Timeout" className="input-field" />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input id={`${toolId}-retry`} type="checkbox" checked={isRetryable} onChange={(e) => setIsRetryable(e.target.checked)} aria-label="Is retryable" className="h-4 w-4" />
            <label htmlFor={`${toolId}-retry`} className="text-sm font-medium text-gray-700">Is Retryable</label>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate ServiceProfile</button>
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
