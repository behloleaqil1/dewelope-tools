'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EnvoyFilterGenerator - Generate Envoy proxy filter configuration YAML
 * with configurable filter type, routes, and settings.
 */
export default function EnvoyFilterGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filterType, setFilterType] = useState('http_connection_manager');
  const [filterName, setFilterName] = useState('my_filter');
  const [routePrefix, setRoutePrefix] = useState('/api');
  const [clusterName, setClusterName] = useState('backend_service');
  const [timeout, setTimeout] = useState('30');
  const [output, setOutput] = useState('');

  const generate = () => {
    const timeoutSec = parseInt(timeout, 10) || 30;

    let yaml = '';
    if (filterType === 'http_connection_manager') {
      yaml = `filters:
- name: envoy.filters.network.http_connection_manager
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
    stat_prefix: ${filterName}
    codec_type: AUTO
    route_config:
      name: local_route
      virtual_hosts:
      - name: backend
        domains:
        - "*"
        routes:
        - match:
            prefix: "${routePrefix}"
          route:
            cluster: ${clusterName}
            timeout: ${timeoutSec}s
    http_filters:
    - name: envoy.filters.http.router
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router`;
    } else if (filterType === 'tcp_proxy') {
      yaml = `filters:
- name: envoy.filters.network.tcp_proxy
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.network.tcp_proxy.v3.TcpProxy
    stat_prefix: ${filterName}
    cluster: ${clusterName}
    idle_timeout: ${timeoutSec}s`;
    } else if (filterType === 'rate_limit') {
      yaml = `http_filters:
- name: envoy.filters.http.ratelimit
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.ratelimit.v3.RateLimit
    domain: ${filterName}
    stage: 0
    rate_limit_service:
      grpc_service:
        envoy_grpc:
          cluster_name: ${clusterName}
      timeout: ${timeoutSec}s
    failure_mode_deny: false`;
    } else if (filterType === 'ext_authz') {
      yaml = `http_filters:
- name: envoy.filters.http.ext_authz
  typed_config:
    "@type": type.googleapis.com/envoy.extensions.filters.http.ext_authz.v3.ExtAuthz
    grpc_service:
      envoy_grpc:
        cluster_name: ${clusterName}
      timeout: ${timeoutSec}s
    failure_mode_allow: false
    with_request_body:
      max_request_bytes: 8192
      allow_partial_message: true`;
    }

    setOutput(yaml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
            <select id={`${toolId}-type`} value={filterType} onChange={(e) => setFilterType(e.target.value)} aria-label={`Filter type for ${toolName}`} className="input-field">
              <option value="http_connection_manager">HTTP Connection Manager</option>
              <option value="tcp_proxy">TCP Proxy</option>
              <option value="rate_limit">Rate Limit</option>
              <option value="ext_authz">External Authorization</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Filter/Stat Prefix Name</label>
            <input id={`${toolId}-name`} type="text" value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="my_filter" aria-label="Filter name" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-route`} className="block text-sm font-medium text-gray-700 mb-1">Route Prefix</label>
            <input id={`${toolId}-route`} type="text" value={routePrefix} onChange={(e) => setRoutePrefix(e.target.value)} placeholder="/api" aria-label="Route prefix" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cluster`} className="block text-sm font-medium text-gray-700 mb-1">Cluster Name</label>
            <input id={`${toolId}-cluster`} type="text" value={clusterName} onChange={(e) => setClusterName(e.target.value)} placeholder="backend_service" aria-label="Cluster name" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-timeout`} className="block text-sm font-medium text-gray-700 mb-1">Timeout (seconds)</label>
            <input id={`${toolId}-timeout`} type="number" min="1" max="300" value={timeout} onChange={(e) => setTimeout(e.target.value)} aria-label="Timeout in seconds" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Filter Config</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Envoy Filter Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
