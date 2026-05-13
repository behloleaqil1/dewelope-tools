'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NftablesRuleGenerator - Generate nftables firewall rules from user-specified parameters.
 * Supports common rule types: accept, drop, reject with protocol/port/address filtering.
 */
export default function NftablesRuleGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [chain, setChain] = useState('input');
  const [action, setAction] = useState('accept');
  const [protocol, setProtocol] = useState('tcp');
  const [port, setPort] = useState('');
  const [sourceIp, setSourceIp] = useState('');
  const [destIp, setDestIp] = useState('');
  const [tableName, setTableName] = useState('filter');
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    lines.push('#!/usr/sbin/nft -f');
    lines.push('');
    lines.push(`table inet ${tableName} {`);
    lines.push(`  chain ${chain} {`);
    if (chain === 'input') {
      lines.push('    type filter hook input priority 0; policy drop;');
    } else if (chain === 'output') {
      lines.push('    type filter hook output priority 0; policy accept;');
    } else {
      lines.push('    type filter hook forward priority 0; policy drop;');
    }
    lines.push('');
    lines.push('    # Allow established/related connections');
    lines.push('    ct state established,related accept');
    lines.push('    # Allow loopback');
    lines.push('    iifname "lo" accept');
    lines.push('');

    let rule = '    ';
    if (protocol) rule += `${protocol} `;
    if (sourceIp) rule += `ip saddr ${sourceIp} `;
    if (destIp) rule += `ip daddr ${destIp} `;
    if (port) rule += `dport ${port} `;
    rule += action;

    lines.push(`    # Custom rule`);
    lines.push(rule);
    lines.push('  }');
    lines.push('}');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-table`} className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
            <input id={`${toolId}-table`} type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} className="input-field" aria-label={`Table name for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-chain`} className="block text-sm font-medium text-gray-700 mb-1">Chain</label>
            <select id={`${toolId}-chain`} value={chain} onChange={(e) => setChain(e.target.value)} className="input-field" aria-label="Chain type">
              <option value="input">Input</option>
              <option value="output">Output</option>
              <option value="forward">Forward</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-protocol`} className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
            <select id={`${toolId}-protocol`} value={protocol} onChange={(e) => setProtocol(e.target.value)} className="input-field" aria-label="Protocol">
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
              <option value="icmp">ICMP</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-action`} className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select id={`${toolId}-action`} value={action} onChange={(e) => setAction(e.target.value)} className="input-field" aria-label="Rule action">
              <option value="accept">Accept</option>
              <option value="drop">Drop</option>
              <option value="reject">Reject</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-port`} className="block text-sm font-medium text-gray-700 mb-1">Port (optional)</label>
            <input id={`${toolId}-port`} type="text" value={port} onChange={(e) => setPort(e.target.value)} placeholder="e.g. 80, 443, 8080-8090" className="input-field" aria-label="Port number" />
          </div>
          <div>
            <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">Source IP (optional)</label>
            <input id={`${toolId}-source`} type="text" value={sourceIp} onChange={(e) => setSourceIp(e.target.value)} placeholder="e.g. 192.168.1.0/24" className="input-field" aria-label="Source IP address" />
          </div>
          <div>
            <label htmlFor={`${toolId}-dest`} className="block text-sm font-medium text-gray-700 mb-1">Destination IP (optional)</label>
            <input id={`${toolId}-dest`} type="text" value={destIp} onChange={(e) => setDestIp(e.target.value)} placeholder="e.g. 10.0.0.1" className="input-field" aria-label="Destination IP address" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Generate nftables Rules</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated nftables Configuration</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
