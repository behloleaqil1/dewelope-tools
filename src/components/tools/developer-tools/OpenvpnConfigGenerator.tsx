'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OpenvpnConfigGenerator - Generate OpenVPN client/server configuration files.
 */
export default function OpenvpnConfigGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'server' | 'client'>('server');
  const [protocol, setProtocol] = useState('udp');
  const [port, setPort] = useState('1194');
  const [subnet, setSubnet] = useState('10.8.0.0');
  const [subnetMask, setSubnetMask] = useState('255.255.255.0');
  const [serverIp, setServerIp] = useState('');
  const [dns, setDns] = useState('1.1.1.1');
  const [cipher, setCipher] = useState('AES-256-GCM');
  const [compress, setCompress] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    if (mode === 'server') {
      const config = [
        '# OpenVPN Server Configuration',
        `port ${port}`,
        `proto ${protocol}`,
        'dev tun',
        '',
        'ca ca.crt',
        'cert server.crt',
        'key server.key',
        'dh dh2048.pem',
        '',
        `server ${subnet} ${subnetMask}`,
        'ifconfig-pool-persist /var/log/openvpn/ipp.txt',
        '',
        `push "dhcp-option DNS ${dns}"`,
        'push "redirect-gateway def1 bypass-dhcp"',
        '',
        'keepalive 10 120',
        `cipher ${cipher}`,
        'auth SHA256',
        compress ? 'compress lz4-v2' : '',
        compress ? 'push "compress lz4-v2"' : '',
        '',
        'user nobody',
        'group nogroup',
        'persist-key',
        'persist-tun',
        '',
        `status /var/log/openvpn/openvpn-status.log`,
        'verb 3',
        'explicit-exit-notify 1',
      ].filter(l => l !== '' || true).join('\n');
      setOutput(config);
    } else {
      const config = [
        '# OpenVPN Client Configuration',
        'client',
        'dev tun',
        `proto ${protocol}`,
        '',
        `remote ${serverIp || 'YOUR_SERVER_IP'} ${port}`,
        'resolv-retry infinite',
        'nobind',
        '',
        'persist-key',
        'persist-tun',
        '',
        'ca ca.crt',
        'cert client.crt',
        'key client.key',
        '',
        `cipher ${cipher}`,
        'auth SHA256',
        compress ? 'compress lz4-v2' : '',
        '',
        'verb 3',
        '',
        '# Uncomment for inline certificates:',
        '# <ca>',
        '# </ca>',
        '# <cert>',
        '# </cert>',
        '# <key>',
        '# </key>',
      ].filter(l => l !== '' || true).join('\n');
      setOutput(config);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => setMode('server')}
              className={`px-4 py-2 rounded text-sm font-medium ${mode === 'server' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              aria-label="Server mode"
            >
              Server Config
            </button>
            <button
              onClick={() => setMode('client')}
              className={`px-4 py-2 rounded text-sm font-medium ${mode === 'client' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              aria-label="Client mode"
            >
              Client Config
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
              <select value={protocol} onChange={e => setProtocol(e.target.value)} className="input-field" aria-label="Protocol">
                <option value="udp">UDP</option>
                <option value="tcp">TCP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <input type="text" value={port} onChange={e => setPort(e.target.value)} className="input-field" aria-label="Port" />
            </div>
          </div>

          {mode === 'server' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VPN Subnet</label>
                <input type="text" value={subnet} onChange={e => setSubnet(e.target.value)} className="input-field" aria-label="VPN subnet" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subnet Mask</label>
                <input type="text" value={subnetMask} onChange={e => setSubnetMask(e.target.value)} className="input-field" aria-label="Subnet mask" />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Server IP/Domain</label>
              <input type="text" value={serverIp} onChange={e => setServerIp(e.target.value)} className="input-field" placeholder="e.g. vpn.example.com" aria-label="Server IP" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DNS Server</label>
              <input type="text" value={dns} onChange={e => setDns(e.target.value)} className="input-field" aria-label="DNS server" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cipher</label>
              <select value={cipher} onChange={e => setCipher(e.target.value)} className="input-field" aria-label="Cipher">
                <option value="AES-256-GCM">AES-256-GCM</option>
                <option value="AES-128-GCM">AES-128-GCM</option>
                <option value="AES-256-CBC">AES-256-CBC</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={compress} onChange={e => setCompress(e.target.checked)} aria-label="Enable compression" />
            Enable LZ4 compression
          </label>

          <button onClick={generate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium" aria-label={`Generate ${toolName} configuration`}>
            Generate Config
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
