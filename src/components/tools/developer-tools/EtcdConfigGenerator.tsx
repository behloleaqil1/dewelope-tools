'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EtcdConfigGenerator - Generate etcd cluster configuration YAML.
 * Supports single-node and multi-node cluster setups with TLS, authentication, and snapshot settings.
 */
export default function EtcdConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [clusterName, setClusterName] = useState('my-etcd-cluster');
  const [nodeName, setNodeName] = useState('etcd-node-1');
  const [clientPort, setClientPort] = useState('2379');
  const [peerPort, setPeerPort] = useState('2380');
  const [dataDir, setDataDir] = useState('/var/lib/etcd');
  const [initialCluster, setInitialCluster] = useState('etcd-node-1=http://localhost:2380');
  const [enableTLS, setEnableTLS] = useState(false);
  const [enableAuth, setEnableAuth] = useState(false);
  const [snapshotCount, setSnapshotCount] = useState('10000');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push('# etcd configuration file');
    lines.push(`name: '${nodeName}'`);
    lines.push(`data-dir: '${dataDir}'`);
    lines.push('');
    lines.push('# Member configuration');
    lines.push(`listen-peer-urls: 'http://0.0.0.0:${peerPort}'`);
    lines.push(`listen-client-urls: 'http://0.0.0.0:${clientPort}'`);
    lines.push('');
    lines.push('# Clustering configuration');
    lines.push(`initial-advertise-peer-urls: 'http://localhost:${peerPort}'`);
    lines.push(`advertise-client-urls: 'http://localhost:${clientPort}'`);
    lines.push(`initial-cluster: '${initialCluster}'`);
    lines.push(`initial-cluster-token: '${clusterName}-token'`);
    lines.push("initial-cluster-state: 'new'");
    lines.push('');
    lines.push('# Tuning');
    lines.push(`snapshot-count: ${snapshotCount}`);
    lines.push('heartbeat-interval: 100');
    lines.push('election-timeout: 1000');

    if (enableTLS) {
      lines.push('');
      lines.push('# TLS configuration');
      lines.push("client-transport-security:");
      lines.push("  cert-file: '/etc/etcd/ssl/server.crt'");
      lines.push("  key-file: '/etc/etcd/ssl/server.key'");
      lines.push("  trusted-ca-file: '/etc/etcd/ssl/ca.crt'");
      lines.push("  client-cert-auth: true");
      lines.push("peer-transport-security:");
      lines.push("  cert-file: '/etc/etcd/ssl/peer.crt'");
      lines.push("  key-file: '/etc/etcd/ssl/peer.key'");
      lines.push("  trusted-ca-file: '/etc/etcd/ssl/ca.crt'");
      lines.push("  client-cert-auth: true");
    }

    if (enableAuth) {
      lines.push('');
      lines.push('# Authentication');
      lines.push('auth-token: simple');
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-cluster-name`} className="block text-sm font-medium text-gray-700 mb-1">Cluster Name</label>
            <input id={`${toolId}-cluster-name`} type="text" value={clusterName} onChange={(e) => setClusterName(e.target.value)} className="input-field" aria-label={`Cluster name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-node-name`} className="block text-sm font-medium text-gray-700 mb-1">Node Name</label>
            <input id={`${toolId}-node-name`} type="text" value={nodeName} onChange={(e) => setNodeName(e.target.value)} className="input-field" aria-label="Node name" />
          </div>
          <div>
            <label htmlFor={`${toolId}-client-port`} className="block text-sm font-medium text-gray-700 mb-1">Client Port</label>
            <input id={`${toolId}-client-port`} type="text" value={clientPort} onChange={(e) => setClientPort(e.target.value)} className="input-field" aria-label="Client port" />
          </div>
          <div>
            <label htmlFor={`${toolId}-peer-port`} className="block text-sm font-medium text-gray-700 mb-1">Peer Port</label>
            <input id={`${toolId}-peer-port`} type="text" value={peerPort} onChange={(e) => setPeerPort(e.target.value)} className="input-field" aria-label="Peer port" />
          </div>
          <div>
            <label htmlFor={`${toolId}-data-dir`} className="block text-sm font-medium text-gray-700 mb-1">Data Directory</label>
            <input id={`${toolId}-data-dir`} type="text" value={dataDir} onChange={(e) => setDataDir(e.target.value)} className="input-field" aria-label="Data directory" />
          </div>
          <div>
            <label htmlFor={`${toolId}-snapshot`} className="block text-sm font-medium text-gray-700 mb-1">Snapshot Count</label>
            <input id={`${toolId}-snapshot`} type="text" value={snapshotCount} onChange={(e) => setSnapshotCount(e.target.value)} className="input-field" aria-label="Snapshot count" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-initial-cluster`} className="block text-sm font-medium text-gray-700 mb-1">Initial Cluster</label>
            <input id={`${toolId}-initial-cluster`} type="text" value={initialCluster} onChange={(e) => setInitialCluster(e.target.value)} className="input-field" aria-label="Initial cluster members" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={enableTLS} onChange={(e) => setEnableTLS(e.target.checked)} className="rounded" />
              Enable TLS
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={enableAuth} onChange={(e) => setEnableAuth(e.target.checked)} className="rounded" />
              Enable Auth
            </label>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Configuration</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated etcd Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
