'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FaviconSizeReference - Reference for all favicon sizes needed for modern browsers/devices.
 * Shows required sizes, formats, and HTML link tags for each.
 */
export default function FaviconSizeReference({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [filter, setFilter] = useState<'all' | 'essential' | 'apple' | 'android' | 'windows'>('all');

  const faviconSizes = [
    { size: '16×16', file: 'favicon-16x16.png', format: 'PNG', category: 'essential', usage: 'Browser tab (standard)', html: '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">' },
    { size: '32×32', file: 'favicon-32x32.png', format: 'PNG', category: 'essential', usage: 'Browser tab (retina)', html: '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">' },
    { size: '48×48', file: 'favicon.ico', format: 'ICO', category: 'essential', usage: 'Legacy browsers, Windows shortcuts', html: '<link rel="icon" href="/favicon.ico">' },
    { size: '180×180', file: 'apple-touch-icon.png', format: 'PNG', category: 'apple', usage: 'iOS home screen', html: '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">' },
    { size: '120×120', file: 'apple-touch-icon-120x120.png', format: 'PNG', category: 'apple', usage: 'iOS (iPhone retina)', html: '<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">' },
    { size: '152×152', file: 'apple-touch-icon-152x152.png', format: 'PNG', category: 'apple', usage: 'iOS (iPad retina)', html: '<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">' },
    { size: '167×167', file: 'apple-touch-icon-167x167.png', format: 'PNG', category: 'apple', usage: 'iOS (iPad Pro)', html: '<link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png">' },
    { size: '192×192', file: 'android-chrome-192x192.png', format: 'PNG', category: 'android', usage: 'Android Chrome (home screen)', html: '{"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"}' },
    { size: '512×512', file: 'android-chrome-512x512.png', format: 'PNG', category: 'android', usage: 'Android Chrome (splash screen)', html: '{"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"}' },
    { size: '150×150', file: 'mstile-150x150.png', format: 'PNG', category: 'windows', usage: 'Windows tile (medium)', html: '<meta name="msapplication-TileImage" content="/mstile-150x150.png">' },
    { size: '270×270', file: 'mstile-270x270.png', format: 'PNG', category: 'windows', usage: 'Windows tile (large)', html: '' },
    { size: 'any', file: 'favicon.svg', format: 'SVG', category: 'essential', usage: 'Modern browsers (scalable)', html: '<link rel="icon" type="image/svg+xml" href="/favicon.svg">' },
  ];

  const filtered = filter === 'all' ? faviconSizes : faviconSizes.filter((f) => f.category === filter);

  const essentialHtml = faviconSizes
    .filter((f) => f.category === 'essential' && f.html)
    .map((f) => f.html)
    .join('\n');

  const fullHtml = faviconSizes
    .filter((f) => f.html && !f.html.startsWith('{'))
    .map((f) => f.html)
    .join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex flex-wrap gap-2">
        {(['all', 'essential', 'apple', 'android', 'windows'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${filter === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            aria-label={`Filter by ${cat}`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 text-left">Size</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Filename</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Format</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Usage</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.file} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2 font-mono font-medium">{item.size}</td>
                    <td className="border border-gray-200 px-3 py-2 font-mono text-xs">{item.file}</td>
                    <td className="border border-gray-200 px-3 py-2">{item.format}</td>
                    <td className="border border-gray-200 px-3 py-2 text-gray-600">{item.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium text-gray-700">Essential HTML (minimum recommended)</h3>
            <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{essentialHtml}</pre>
            <CopyToClipboard text={essentialHtml} />
          </div>

          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium text-gray-700">Full HTML (all platforms)</h3>
            <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{fullHtml}</pre>
            <CopyToClipboard text={fullHtml} />
          </div>
        </div>
      </OutputArea>
    </div>
  );
}
