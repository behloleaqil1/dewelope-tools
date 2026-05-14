'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SitemapXmlGenerator - Generate sitemap.xml from a list of URLs.
 */
export default function SitemapXmlGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [urls, setUrls] = useState('');
  const [changefreq, setChangefreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');

  const generate = (): string => {
    const urlList = urls.split('\n').map(u => u.trim()).filter(Boolean);
    if (urlList.length === 0) return '';
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (const url of urlList) {
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${changefreq}</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += '  </url>\n';
    }
    xml += '</urlset>';
    return xml;
  };

  const result = generate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-urls`} className="block text-sm font-medium text-gray-700 mb-1">URLs (one per line)</label>
        <textarea id={`${toolId}-urls`} value={urls} onChange={(e) => setUrls(e.target.value)} rows={6} placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact" aria-label={`URLs for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Change Frequency</label>
          <select id={`${toolId}-freq`} value={changefreq} onChange={(e) => setChangefreq(e.target.value)} aria-label={`Change frequency for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-priority`} className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select id={`${toolId}-priority`} value={priority} onChange={(e) => setPriority(e.target.value)} aria-label={`Priority for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
