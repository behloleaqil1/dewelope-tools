'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WireguardConfigGenerator - Generate WireGuard VPN configuration files.
 * Creates both server and client configuration with key placeholders.
 */
export default function WireguardConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [serverEndpoint, setServerEndpoint] = useState('');
  const [serverPort, setServerPort] = useState('51820');
  const [serverAddress, setServerAddress] = useState('10.0.0.1/24');
  const [clientAddress, setClientAddress] = useState('10.0.0.2/32');
  const [dns, setDns] = useState('1.1.1.1');
  const [allowedIps, setAllowedIps] = useState('0.0.0.0/0');
  const [interfaceName, setInterfaceName] = useState('wg0');
  const [output, setOutput] = useState('');

  const generate = () => {
    const serverConfig = [
      `# ${interfaceName} Server Configuration`,
      '[Interface]',
      `Address = ${serverAddress}`,
      `ListenPort = ${serverPort}`,
      'PrivateKey = <SERVER_PRIVATE_KEY>',
      'PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE',
      'PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE',
      '',
      '# Client Peer',
      '[Peer]',
      'PublicKey = <CLIENT_PUBLIC_KEY>',
      `AllowedIPs = ${clientAddress.replace('/32', '/32').replace('/24', '/32')}`,
    ].join('\n');

    const clientConfig = [
      `# ${interfaceName} Client Configuration`,
      '[Interface]',
      `Address = ${clientAddress}`,
      'PrivateKey = <CLIENT_PRIVATE_KEY>',
      `DNS = ${dns}`,
      '',
      '[Peer]',
      'PublicKey = <SERVER_PUBLIC_KEY>',
      `Endpoint = ${serverEndpoint || '<SERVER_IP>'}:${serverPort}`,
      `AllowedIPs = ${allowedIps}`,
      'PersistentKeepalive = 25',
    ].join('\n');

    setOutput(`=== SERVER CONFIG (${interfaceName}.conf) ===\n\n${serverConfig}\n\n\n=== CLIENT CONFIG (${interfaceName}.conf) ===\n\n${clientConfig}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-endpoint`} className="block text-sm font-medium text-gray-700 mb-1">Server Endpoint (IP/Domain)</label>
            <input id={`${toolId}-endpoint`} type="text" value={serverEndpoint} onChange={(e) => setServerEndpoint(e.target.value)} placeholder="e.g. vpn.example.com" className="input-field" aria-label={`Server endpoint for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Listen Port</label>
            <input id={`${toolId}-port`} type="text" value={serverPort} onChange={(e) => setServerPort(e.target.value)} className="input-field" aria-label="Listen port" />
          </div>
          <div>
            <label htmlFor={`${toolId}-server-addr`} className="block text-sm font-medium text-gray-700 mb-1">Server Address (CIDR)</label>
            <input id={`${toolId}-server-addr`} type="text" value={serverAddress} onChange={(e) => setServerAddress(e.target.value)} placeholder="10.0.0.1/24" className="input-field" aria-label="Server address" />
          </div>
          <div>
            <label htmlFor={`${toolId}-client-addr`} className="block text-sm font-medium text-gray-700 mb-1">Client Address (CIDR)</label>
            <input id={`${toolId}-client-addr`} type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="10.0.0.2/32" className="input-field" aria-label="Client address" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dns`} className="block text-sm font-medium text-gray-700 mb-1">DNS Server</label>
            <input id={`${toolId}-dns`} type="text" value={dns} onChange={(e) => setDns(e.target.value)} placeholder="1.1.1.1" className="input-field" aria-label="DNS server" />
          </div>
          <div>
            <label htmlFor={`${toolId}-allowed`} className="block text-sm font-medium text-gray-700 mb-1">Allowed IPs (Client)</label>
            <input id={`${toolId}-allowed`} type="text" value={allowedIps} onChange={(e) => setAllowedIps(e.target.value)} placeholder="0.0.0.0/0" className="input-field" aria-label="Allowed IPs" />
          </div>
          <div>
            <label htmlFor={`${toolId}-iface`} className="block text-sm font-medium text-gray-700 mb-1">Interface Name</label>
            <input id={`${toolId}-iface`} type="text" value={interfaceName} onChange={(e) => setInterfaceName(e.target.value)} className="input-field" aria-label="Interface name" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Generate WireGuard Config</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated WireGuard Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
