'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const PORT_DATABASE: Record<number, { service: string; protocol: string; description: string }> = {
  20: { service: 'FTP Data', protocol: 'TCP', description: 'File Transfer Protocol data transfer' },
  21: { service: 'FTP Control', protocol: 'TCP', description: 'File Transfer Protocol command control' },
  22: { service: 'SSH', protocol: 'TCP', description: 'Secure Shell remote login' },
  23: { service: 'Telnet', protocol: 'TCP', description: 'Unencrypted text communications' },
  25: { service: 'SMTP', protocol: 'TCP', description: 'Simple Mail Transfer Protocol' },
  53: { service: 'DNS', protocol: 'TCP/UDP', description: 'Domain Name System' },
  67: { service: 'DHCP Server', protocol: 'UDP', description: 'Dynamic Host Configuration Protocol' },
  68: { service: 'DHCP Client', protocol: 'UDP', description: 'Dynamic Host Configuration Protocol' },
  80: { service: 'HTTP', protocol: 'TCP', description: 'Hypertext Transfer Protocol' },
  110: { service: 'POP3', protocol: 'TCP', description: 'Post Office Protocol v3' },
  123: { service: 'NTP', protocol: 'UDP', description: 'Network Time Protocol' },
  143: { service: 'IMAP', protocol: 'TCP', description: 'Internet Message Access Protocol' },
  443: { service: 'HTTPS', protocol: 'TCP', description: 'HTTP over TLS/SSL' },
  445: { service: 'SMB', protocol: 'TCP', description: 'Server Message Block / Windows shares' },
  465: { service: 'SMTPS', protocol: 'TCP', description: 'SMTP over SSL' },
  587: { service: 'SMTP Submission', protocol: 'TCP', description: 'Email message submission' },
  993: { service: 'IMAPS', protocol: 'TCP', description: 'IMAP over SSL' },
  995: { service: 'POP3S', protocol: 'TCP', description: 'POP3 over SSL' },
  1433: { service: 'MSSQL', protocol: 'TCP', description: 'Microsoft SQL Server' },
  1521: { service: 'Oracle DB', protocol: 'TCP', description: 'Oracle Database listener' },
  3306: { service: 'MySQL', protocol: 'TCP', description: 'MySQL Database' },
  3389: { service: 'RDP', protocol: 'TCP', description: 'Remote Desktop Protocol' },
  5432: { service: 'PostgreSQL', protocol: 'TCP', description: 'PostgreSQL Database' },
  5672: { service: 'AMQP', protocol: 'TCP', description: 'Advanced Message Queuing Protocol' },
  6379: { service: 'Redis', protocol: 'TCP', description: 'Redis key-value store' },
  8080: { service: 'HTTP Alt', protocol: 'TCP', description: 'Alternative HTTP port' },
  8443: { service: 'HTTPS Alt', protocol: 'TCP', description: 'Alternative HTTPS port' },
  9200: { service: 'Elasticsearch', protocol: 'TCP', description: 'Elasticsearch REST API' },
  27017: { service: 'MongoDB', protocol: 'TCP', description: 'MongoDB Database' },
};

/**
 * PortScannerSimulator - Educational reference for common port/service mappings.
 */
export default function PortScannerSimulator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [portInput, setPortInput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ port: number; service: string; protocol: string; description: string } | null>(null);

  const lookup = () => {
    setError(undefined);
    setResult(null);
    const port = parseInt(portInput.trim(), 10);
    if (isNaN(port) || port < 0 || port > 65535) { setError('Enter a valid port number (0-65535)'); return; }
    const info = PORT_DATABASE[port];
    if (info) {
      setResult({ port, ...info });
    } else {
      setResult({ port, service: 'Unknown', protocol: 'N/A', description: port < 1024 ? 'Well-known port (no common service mapped)' : port < 49152 ? 'Registered port (no common service mapped)' : 'Dynamic/private port range' });
    }
  };

  const copyText = result ? `Port: ${result.port}\nService: ${result.service}\nProtocol: ${result.protocol}\nDescription: ${result.description}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Port Number</label>
        <input id={`${toolId}-input`} type="number" value={portInput} onChange={(e) => setPortInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && lookup()} placeholder="e.g. 443" aria-label={`Port number input for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <button onClick={lookup} aria-label="Look up port information" className="btn-primary">Look Up Port</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200"><div className="text-xs text-gray-500">Port</div><div className="text-sm font-mono font-semibold text-gray-800">{result.port}</div></div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200"><div className="text-xs text-gray-500">Service</div><div className="text-sm font-semibold text-gray-800">{result.service}</div></div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200"><div className="text-xs text-gray-500">Protocol</div><div className="text-sm font-semibold text-gray-800">{result.protocol}</div></div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200"><div className="text-xs text-gray-500">Description</div><div className="text-sm text-gray-800">{result.description}</div></div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
      <div className="text-xs text-gray-500 italic">Educational reference only. This tool does not perform actual network scanning.</div>
    </div>
  );
}
