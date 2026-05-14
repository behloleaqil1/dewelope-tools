'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RobotsTxtFileGenerator - Generate robots.txt content from allow/disallow rules.
 */
export default function RobotsTxtFileGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [userAgent, setUserAgent] = useState('*');
  const [allowPaths, setAllowPaths] = useState('/');
  const [disallowPaths, setDisallowPaths] = useState('/admin/\n/private/');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');

  const generate = (): string => {
    const lines: string[] = [];
    lines.push(`User-agent: ${userAgent}`);
    const allows = allowPaths.split('\n').filter(p => p.trim());
    for (const p of allows) lines.push(`Allow: ${p.trim()}`);
    const disallows = disallowPaths.split('\n').filter(p => p.trim());
    for (const p of disallows) lines.push(`Disallow: ${p.trim()}`);
    if (crawlDelay.trim()) lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
    lines.push('');
    if (sitemapUrl.trim()) lines.push(`Sitemap: ${sitemapUrl.trim()}`);
    return lines.join('\n');
  };

  const result = generate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-ua`} className="block text-sm font-medium text-gray-700 mb-1">User-Agent</label>
        <input id={`${toolId}-ua`} type="text" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} placeholder="*" aria-label={`User agent for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-allow`} className="block text-sm font-medium text-gray-700 mb-1">Allow Paths (one per line)</label>
        <textarea id={`${toolId}-allow`} value={allowPaths} onChange={(e) => setAllowPaths(e.target.value)} rows={3} placeholder="/" aria-label={`Allow paths for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
      </div>
      <div>
        <label htmlFor={`${toolId}-disallow`} className="block text-sm font-medium text-gray-700 mb-1">Disallow Paths (one per line)</label>
        <textarea id={`${toolId}-disallow`} value={disallowPaths} onChange={(e) => setDisallowPaths(e.target.value)} rows={3} placeholder="/admin/" aria-label={`Disallow paths for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
      </div>
      <div>
        <label htmlFor={`${toolId}-sitemap`} className="block text-sm font-medium text-gray-700 mb-1">Sitemap URL (optional)</label>
        <input id={`${toolId}-sitemap`} type="text" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} placeholder="https://example.com/sitemap.xml" aria-label={`Sitemap URL for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-delay`} className="block text-sm font-medium text-gray-700 mb-1">Crawl Delay (optional, seconds)</label>
        <input id={`${toolId}-delay`} type="text" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="10" aria-label={`Crawl delay for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
          <CopyToClipboard text={result} />
        </div>
      </OutputArea>
    </div>
  );
}
