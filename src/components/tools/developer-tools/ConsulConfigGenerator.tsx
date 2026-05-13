'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ConsulConfigGenerator - Generate HashiCorp Consul agent configuration.
 * Supports server and client modes with common configuration options.
 */
export default function ConsulConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'server' | 'client'>('server');
  const [datacenter, setDatacenter] = useState('dc1');
  const [nodeName, setNodeName] = useState('consul-node-1');
  const [bindAddr, setBindAddr] = useState('0.0.0.0');
  const [clientAddr, setClientAddr] = useState('0.0.0.0');
  const [bootstrapExpect, setBootstrapExpect] = useState('3');
  const [retryJoin, setRetryJoin] = useState('consul-server-1');
  const [enableUi, setEnableUi] = useState(true);
  const [encrypt, setEncrypt] = useState('');
  const [logLevel, setLogLevel] = useState('INFO');
  const [output, setOutput] = useState('');

  const generate = () => {
    const config: Record<string, unknown> = {
      datacenter,
      node_name: nodeName,
      server: mode === 'server',
      bind_addr: bindAddr,
      client_addr: clientAddr,
      data_dir: '/opt/consul/data',
      log_level: logLevel,
      retry_join: retryJoin.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (mode === 'server') {
      config.bootstrap_expect = parseInt(bootstrapExpect) || 3;
      config.ui_config = { enabled: enableUi };
    }

    if (encrypt) {
      config.encrypt = encrypt;
    }

    config.performance = { raft_multiplier: 1 };
    config.ports = { http: 8500, https: -1, grpc: 8502, dns: 8600 };
    config.connect = { enabled: true };

    setOutput(JSON.stringify(config, null, 2));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">Agent Mode</label>
            <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'server' | 'client')} className="input-field" aria-label={`Agent mode for ${toolName}`}>
              <option value="server">Server</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-dc`} className="block text-sm font-medium text-gray-700 mb-1">Datacenter</label>
            <input id={`${toolId}-dc`} type="text" value={datacenter} onChange={(e) => setDatacenter(e.target.value)} className="input-field" aria-label="Datacenter name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-nodename`} className="block text-sm font-medium text-gray-700 mb-1">Node Name</label>
            <input id={`${toolId}-nodename`} type="text" value={nodeName} onChange={(e) => setNodeName(e.target.value)} className="input-field" aria-label="Node name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-bind`} className="block text-sm font-medium text-gray-700 mb-1">Bind Address</label>
            <input id={`${toolId}-bind`} type="text" value={bindAddr} onChange={(e) => setBindAddr(e.target.value)} className="input-field" aria-label="Bind address" />
          </div>
          <div>
            <label htmlFor={`${toolId}-client`} className="block text-sm font-medium text-gray-700 mb-1">Client Address</label>
            <input id={`${toolId}-client`} type="text" value={clientAddr} onChange={(e) => setClientAddr(e.target.value)} className="input-field" aria-label="Client address" />
          </div>
          {mode === 'server' && (
            <div>
              <label htmlFor={`${toolId}-bootstrap`} className="block text-sm font-medium text-gray-700 mb-1">Bootstrap Expect</label>
              <input id={`${toolId}-bootstrap`} type="number" value={bootstrapExpect} onChange={(e) => setBootstrapExpect(e.target.value)} className="input-field" aria-label="Bootstrap expect count" />
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-retry`} className="block text-sm font-medium text-gray-700 mb-1">Retry Join (comma-separated)</label>
            <input id={`${toolId}-retry`} type="text" value={retryJoin} onChange={(e) => setRetryJoin(e.target.value)} className="input-field" aria-label="Retry join addresses" />
          </div>
          <div>
            <label htmlFor={`${toolId}-loglevel`} className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
            <select id={`${toolId}-loglevel`} value={logLevel} onChange={(e) => setLogLevel(e.target.value)} className="input-field" aria-label="Log level">
              <option value="TRACE">TRACE</option>
              <option value="DEBUG">DEBUG</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-encrypt`} className="block text-sm font-medium text-gray-700 mb-1">Encrypt Key (optional)</label>
            <input id={`${toolId}-encrypt`} type="text" value={encrypt} onChange={(e) => setEncrypt(e.target.value)} className="input-field" placeholder="Base64 gossip key" aria-label="Encryption key" />
          </div>
          {mode === 'server' && (
            <div className="flex items-center gap-2 pt-6">
              <input id={`${toolId}-ui`} type="checkbox" checked={enableUi} onChange={(e) => setEnableUi(e.target.checked)} aria-label="Enable UI" />
              <label htmlFor={`${toolId}-ui`} className="text-sm font-medium text-gray-700">Enable UI</label>
            </div>
          )}
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Configuration</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Consul Configuration (consul.json)</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
