'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CidrNotationConverter - Converts between subnet mask and CIDR notation.
 */
export default function CidrNotationConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ cidr: string; subnetMask: string; wildcard: string; totalAddresses: number } | null>(null);

  const convert = () => {
    setError(undefined);
    setResult(null);
    const trimmed = input.trim();

    // Check if input is CIDR (e.g., /24 or 24)
    const cidrMatch = trimmed.match(/^\/?(\d{1,2})$/);
    if (cidrMatch) {
      const cidr = parseInt(cidrMatch[1], 10);
      if (cidr < 0 || cidr > 32) { setError('CIDR must be between 0 and 32'); return; }
      const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
      const wildcard = (~mask) >>> 0;
      setResult({
        cidr: `/${cidr}`,
        subnetMask: intToIp(mask),
        wildcard: intToIp(wildcard),
        totalAddresses: Math.pow(2, 32 - cidr),
      });
      return;
    }

    // Check if input is subnet mask (e.g., 255.255.255.0)
    const maskMatch = trimmed.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (maskMatch) {
      const octets = [parseInt(maskMatch[1]), parseInt(maskMatch[2]), parseInt(maskMatch[3]), parseInt(maskMatch[4])];
      if (octets.some(o => o < 0 || o > 255)) { setError('Each octet must be 0-255'); return; }
      const maskInt = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
      const binary = maskInt.toString(2).padStart(32, '0');
      if (!/^1*0*$/.test(binary)) { setError('Not a valid subnet mask (must be contiguous 1s followed by 0s)'); return; }
      const cidr = binary.indexOf('0') === -1 ? 32 : binary.indexOf('0');
      const wildcard = (~maskInt) >>> 0;
      setResult({
        cidr: `/${cidr}`,
        subnetMask: trimmed,
        wildcard: intToIp(wildcard),
        totalAddresses: Math.pow(2, 32 - cidr),
      });
      return;
    }

    setError('Enter a CIDR prefix (e.g., /24) or subnet mask (e.g., 255.255.255.0)');
  };

  const intToIp = (int: number): string => [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');

  const copyText = result ? `CIDR: ${result.cidr}\nSubnet Mask: ${result.subnetMask}\nWildcard: ${result.wildcard}\nTotal Addresses: ${result.totalAddresses}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Subnet Mask or CIDR Prefix</label>
        <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && convert()} placeholder="e.g. 255.255.255.0 or /24" aria-label={`Subnet mask or CIDR input for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <button onClick={convert} aria-label="Convert notation" className="btn-primary">Convert</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'CIDR Notation', value: result.cidr },
                { label: 'Subnet Mask', value: result.subnetMask },
                { label: 'Wildcard Mask', value: result.wildcard },
                { label: 'Total Addresses', value: result.totalAddresses.toLocaleString() },
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
