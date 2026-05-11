'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SitemapGenerator - Generate XML sitemap from a list of URLs.
 * Supports priority and changefreq settings per URL.
 */
export default function SitemapGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [urls, setUrls] = useState('');
  const [priority, setPriority] = useState('0.8');
  const [changefreq, setChangefreq] = useState('weekly');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    const lines = urls.split('\n').map((l) => l.trim()).filter(Boolean);

    if (lines.length === 0) {
      setError('Please enter at least one URL');
      setOutput('');
      return;
    }

    const invalidUrls = lines.filter((url) => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      setError(`Invalid URL(s): ${invalidUrls.slice(0, 3).join(', ')}${invalidUrls.length > 3 ? '...' : ''}`);
      setOutput('');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const urlEntries = lines
      .map(
        (url) =>
          `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
    setOutput(xml);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-urls`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter URLs (one per line)
        </label>
        <textarea
          id={`${toolId}-urls`}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact"
          aria-label={`URL list for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-priority`} className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id={`${toolId}-priority`}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Sitemap priority"
            className="input-field"
          >
            {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-changefreq`} className="block text-sm font-medium text-gray-700 mb-1">
            Change Frequency
          </label>
          <select
            id={`${toolId}-changefreq`}
            value={changefreq}
            onChange={(e) => setChangefreq(e.target.value)}
            aria-label="Sitemap change frequency"
            className="input-field"
          >
            {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={generate} aria-label="Generate XML sitemap" className="btn-primary">
        Generate Sitemap
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">XML Sitemap</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
