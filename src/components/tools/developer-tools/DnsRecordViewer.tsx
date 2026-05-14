'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const DNS_RECORDS: Record<string, { description: string; format: string; example: string; usage: string }> = {
  A: { description: 'Maps a domain to an IPv4 address', format: 'domain. IN A <IPv4>', example: 'example.com. IN A 93.184.216.34', usage: 'Primary domain-to-IP mapping' },
  AAAA: { description: 'Maps a domain to an IPv6 address', format: 'domain. IN AAAA <IPv6>', example: 'example.com. IN AAAA 2606:2800:220:1:248:1893:25c8:1946', usage: 'IPv6 domain resolution' },
  CNAME: { description: 'Alias of one domain to another', format: 'alias. IN CNAME canonical.', example: 'www.example.com. IN CNAME example.com.', usage: 'Domain aliasing, CDN setup' },
  MX: { description: 'Mail exchange server for the domain', format: 'domain. IN MX <priority> <mail-server>', example: 'example.com. IN MX 10 mail.example.com.', usage: 'Email routing' },
  TXT: { description: 'Arbitrary text data for a domain', format: 'domain. IN TXT "<text>"', example: 'example.com. IN TXT "v=spf1 include:_spf.google.com ~all"', usage: 'SPF, DKIM, domain verification' },
  NS: { description: 'Authoritative nameserver for the domain', format: 'domain. IN NS <nameserver>', example: 'example.com. IN NS ns1.example.com.', usage: 'DNS delegation' },
  SOA: { description: 'Start of Authority - primary NS and admin info', format: 'domain. IN SOA <ns> <admin> (serial refresh retry expire minimum)', example: 'example.com. IN SOA ns1.example.com. admin.example.com. (2024010101 3600 900 604800 86400)', usage: 'Zone authority definition' },
  SRV: { description: 'Service locator record', format: '_service._proto.domain. IN SRV <priority> <weight> <port> <target>', example: '_sip._tcp.example.com. IN SRV 10 60 5060 sip.example.com.', usage: 'Service discovery (SIP, XMPP, etc.)' },
  PTR: { description: 'Pointer record for reverse DNS lookup', format: '<reversed-ip>.in-addr.arpa. IN PTR domain.', example: '34.216.184.93.in-addr.arpa. IN PTR example.com.', usage: 'Reverse DNS, email validation' },
  CAA: { description: 'Certificate Authority Authorization', format: 'domain. IN CAA <flags> <tag> "<value>"', example: 'example.com. IN CAA 0 issue "letsencrypt.org"', usage: 'Restrict which CAs can issue certificates' },
};

/**
 * DnsRecordViewer - Educational reference for DNS record types with format and examples.
 */
export default function DnsRecordViewer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState<string>('A');
  const record = DNS_RECORDS[selected];

  const copyText = record ? `Type: ${selected}\nDescription: ${record.description}\nFormat: ${record.format}\nExample: ${record.example}\nUsage: ${record.usage}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-select`} className="block text-sm font-medium text-gray-700 mb-1">DNS Record Type</label>
        <select id={`${toolId}-select`} value={selected} onChange={(e) => setSelected(e.target.value)} aria-label={`DNS record type selector for ${toolName}`} className="input-field">
          {Object.keys(DNS_RECORDS).map(type => (<option key={type} value={type}>{type}</option>))}
        </select>
      </div>
      <OutputArea hasContent={!!record}>
        {record && (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">{selected} Record</div>
              <div className="text-sm text-gray-800 mt-1">{record.description}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500">Format</div>
              <div className="text-sm font-mono text-gray-800 mt-1">{record.format}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500">Example</div>
              <div className="text-sm font-mono text-gray-800 mt-1 break-all">{record.example}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500">Common Usage</div>
              <div className="text-sm text-gray-800 mt-1">{record.usage}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
