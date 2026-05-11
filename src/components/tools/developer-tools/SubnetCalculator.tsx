'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  subnetMask: string;
  cidr: number;
}

/**
 * SubnetCalculator - Calculates subnet information from an IP address and CIDR notation.
 * Outputs: network address, broadcast address, first/last usable host, total hosts, subnet mask.
 */
export default function SubnetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<SubnetResult | null>(null);

  const ipToInt = (ip: string): number => {
    const parts = ip.split('.').map(Number);
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  };

  const intToIp = (int: number): string => {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join('.');
  };

  const calculate = () => {
    const trimmed = input.trim();

    // Parse IP/CIDR
    const match = trimmed.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
    if (!match) {
      setError('Please enter a valid IP address with CIDR notation (e.g., 192.168.1.0/24)');
      setResult(null);
      return;
    }

    const ip = match[1];
    const cidr = parseInt(match[2], 10);

    // Validate CIDR
    if (cidr < 0 || cidr > 32) {
      setError('CIDR must be between 0 and 32');
      setResult(null);
      return;
    }

    // Validate IP octets
    const octets = ip.split('.').map(Number);
    if (octets.some((o) => o < 0 || o > 255)) {
      setError('Each IP octet must be between 0 and 255');
      setResult(null);
      return;
    }

    setError(undefined);

    const ipInt = ipToInt(ip);
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;

    const totalHosts = cidr >= 31 ? Math.pow(2, 32 - cidr) : Math.pow(2, 32 - cidr) - 2;
    const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
    const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;

    setResult({
      networkAddress: intToIp(network),
      broadcastAddress: intToIp(broadcast),
      firstHost: intToIp(firstHost),
      lastHost: intToIp(lastHost),
      totalHosts: Math.max(0, totalHosts),
      subnetMask: intToIp(mask),
      cidr,
    });
  };

  const copyText = result
    ? [
        `Network Address: ${result.networkAddress}`,
        `Broadcast Address: ${result.broadcastAddress}`,
        `First Usable Host: ${result.firstHost}`,
        `Last Usable Host: ${result.lastHost}`,
        `Total Usable Hosts: ${result.totalHosts}`,
        `Subnet Mask: ${result.subnetMask}`,
        `CIDR: /${result.cidr}`,
      ].join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          IP Address / CIDR
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && calculate()}
          placeholder="e.g. 192.168.1.0/24"
          aria-label={`IP address and CIDR input for ${toolName}`}
          className="input-field font-mono"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate subnet" className="btn-primary">
        Calculate Subnet
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Network Address', value: result.networkAddress },
                { label: 'Broadcast Address', value: result.broadcastAddress },
                { label: 'First Usable Host', value: result.firstHost },
                { label: 'Last Usable Host', value: result.lastHost },
                { label: 'Total Usable Hosts', value: result.totalHosts.toLocaleString() },
                { label: 'Subnet Mask', value: result.subnetMask },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-sm font-mono font-semibold text-gray-800 mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
