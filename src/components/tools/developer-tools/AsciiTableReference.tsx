'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function AsciiTableReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filter, setFilter] = useState('');

  const chars = Array.from({ length: 128 }, (_, i) => ({
    dec: i, hex: i.toString(16).toUpperCase().padStart(2, '0'),
    char: i < 32 ? ['NUL','SOH','STX','ETX','EOT','ENQ','ACK','BEL','BS','TAB','LF','VT','FF','CR','SO','SI','DLE','DC1','DC2','DC3','DC4','NAK','SYN','ETB','CAN','EM','SUB','ESC','FS','GS','RS','US'][i] : i === 32 ? 'SP' : i === 127 ? 'DEL' : String.fromCharCode(i),
  }));

  const filtered = filter ? chars.filter(c => c.char.toLowerCase().includes(filter.toLowerCase()) || c.dec.toString().includes(filter) || c.hex.toLowerCase().includes(filter.toLowerCase())) : chars;
  const output = filtered.map(c => `${c.dec}\t0x${c.hex}\t${c.char}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-filter`} className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
        <input id={`${toolId}-filter`} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by char, decimal, or hex..." className="input-field" aria-label={`Filter for ${toolName}`} />
      </InputArea>
      <OutputArea hasContent={filtered.length > 0}>
        <div className="overflow-auto max-h-80 border border-gray-200 rounded-lg">
          <table className="w-full text-sm font-mono"><thead className="bg-gray-100 sticky top-0"><tr><th className="p-2 text-left">Dec</th><th className="p-2 text-left">Hex</th><th className="p-2 text-left">Char</th></tr></thead>
            <tbody>{filtered.map(c => (<tr key={c.dec} className="border-t border-gray-100"><td className="p-2">{c.dec}</td><td className="p-2">0x{c.hex}</td><td className="p-2">{c.char}</td></tr>))}</tbody>
          </table>
        </div>
        <CopyToClipboard text={output} />
      </OutputArea>
    </div>
  );
}
