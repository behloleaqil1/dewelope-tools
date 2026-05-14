'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LoadBalancerConfigGenerator - Generate load balancer configuration.
 */
export default function LoadBalancerConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [backends, setBackends] = useState('server1:8080,server2:8080,server3:8080');
  const [algorithm, setAlgorithm] = useState('round_robin');
  const [healthPath, setHealthPath] = useState('/health');
  const [format, setFormat] = useState('nginx');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function generate() {
    setError('');
    setOutput('');
    const servers = backends.split(',').map(s => s.trim()).filter(Boolean);
    if (servers.length === 0) { setError('Please enter at least one backend server'); return; }

    if (format === 'nginx') {
      const algoDirective = algorithm === 'least_conn' ? '    least_conn;\n' : algorithm === 'ip_hash' ? '    ip_hash;\n' : '';
      const serverLines = servers.map(s => `    server ${s};`).join('\n');
      setOutput(`upstream backend {
${algoDirective}${serverLines}
}

server {
    listen 80;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location ${healthPath} {
        access_log off;
        return 200 "OK";
    }
}`);
    } else {
      const algoLine = algorithm === 'least_conn' ? 'leastconn' : algorithm === 'ip_hash' ? 'source' : 'roundrobin';
      const serverLines = servers.map((s, i) => `    server srv${i + 1} ${s} check`).join('\n');
      setOutput(`frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    balance ${algoLine}
    option httpchk GET ${healthPath}
${serverLines}`);
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor={`${toolId}-backends`} className="block text-sm font-medium text-gray-700 mb-1">Backend Servers (comma-separated)</label>
            <input id={`${toolId}-backends`} type="text" value={backends} onChange={(e) => setBackends(e.target.value)} placeholder="host:port,host:port" aria-label={`Backend servers for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-algo`} className="block text-sm font-medium text-gray-700 mb-1">Algorithm</label>
            <select id={`${toolId}-algo`} value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} aria-label="Load balancing algorithm" className="input-field">
              <option value="round_robin">Round Robin</option>
              <option value="least_conn">Least Connections</option>
              <option value="ip_hash">IP Hash</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value)} aria-label="Config format" className="input-field">
              <option value="nginx">Nginx</option>
              <option value="haproxy">HAProxy</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-health`} className="block text-sm font-medium text-gray-700 mb-1">Health Check Path</label>
            <input id={`${toolId}-health`} type="text" value={healthPath} onChange={(e) => setHealthPath(e.target.value)} aria-label="Health check path" className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate load balancer config" className="btn-primary">
        Generate Config
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{format === 'nginx' ? 'Nginx' : 'HAProxy'} Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
