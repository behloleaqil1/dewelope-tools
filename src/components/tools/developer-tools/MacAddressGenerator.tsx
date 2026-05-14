'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MacAddressGenerator - Generates random MAC addresses in various formats.
 */
export default function MacAddressGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [format, setFormat] = useState<'colon' | 'dash' | 'dot' | 'none'>('colon');
  const [count, setCount] = useState(1);
  const [unicast, setUnicast] = useState(true);
  const [results, setResults] = useState<string[]>([]);

  const generateMac = (): string => {
    const bytes = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
    if (unicast) {
      bytes[0] = bytes[0] & 0xfe; // Clear multicast bit
      bytes[0] = bytes[0] & 0xfd; // Clear locally administered bit for global
    }
    const hex = bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase());
    switch (format) {
      case 'colon': return hex.join(':');
      case 'dash': return hex.join('-');
      case 'dot': return `${hex[0]}${hex[1]}.${hex[2]}${hex[3]}.${hex[4]}${hex[5]}`;
      case 'none': return hex.join('');
    }
  };

  const generate = () => {
    const macs = Array.from({ length: Math.min(count, 50) }, () => generateMac());
    setResults(macs);
  };

  const copyText = results.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-3">
        <div>
          <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value as typeof format)} aria-label={`MAC address format for ${toolName}`} className="input-field">
            <option value="colon">Colon (AA:BB:CC:DD:EE:FF)</option>
            <option value="dash">Dash (AA-BB-CC-DD-EE-FF)</option>
            <option value="dot">Dot (AABB.CCDD.EEFF)</option>
            <option value="none">No separator (AABBCCDDEEFF)</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Count (1-50)</label>
          <input id={`${toolId}-count`} type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} aria-label="Number of MAC addresses to generate" className="input-field" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={unicast} onChange={(e) => setUnicast(e.target.checked)} aria-label="Generate unicast addresses only" className="rounded" />
          Unicast only (clear multicast bit)
        </label>
      </div>
      <button onClick={generate} aria-label="Generate MAC addresses" className="btn-primary">Generate</button>
      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm space-y-1">
              {results.map((mac, i) => (<div key={i} className="text-gray-800">{mac}</div>))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
