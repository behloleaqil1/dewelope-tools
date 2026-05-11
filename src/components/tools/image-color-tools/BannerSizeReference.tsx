'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BannerSizeReference - Reference for common web banner/ad sizes (IAB standards).
 * Displays standard banner dimensions with filtering and search.
 */
export default function BannerSizeReference({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const bannerSizes = [
    { name: 'Medium Rectangle', width: 300, height: 250, category: 'rectangle', popular: true },
    { name: 'Large Rectangle', width: 336, height: 280, category: 'rectangle', popular: true },
    { name: 'Leaderboard', width: 728, height: 90, category: 'leaderboard', popular: true },
    { name: 'Large Leaderboard', width: 970, height: 90, category: 'leaderboard', popular: false },
    { name: 'Billboard', width: 970, height: 250, category: 'leaderboard', popular: true },
    { name: 'Mobile Leaderboard', width: 320, height: 50, category: 'mobile', popular: true },
    { name: 'Large Mobile Banner', width: 320, height: 100, category: 'mobile', popular: true },
    { name: 'Mobile Interstitial', width: 320, height: 480, category: 'mobile', popular: false },
    { name: 'Wide Skyscraper', width: 160, height: 600, category: 'skyscraper', popular: true },
    { name: 'Skyscraper', width: 120, height: 600, category: 'skyscraper', popular: false },
    { name: 'Half Page', width: 300, height: 600, category: 'skyscraper', popular: true },
    { name: 'Portrait', width: 300, height: 1050, category: 'skyscraper', popular: false },
    { name: 'Full Banner', width: 468, height: 60, category: 'banner', popular: false },
    { name: 'Half Banner', width: 234, height: 60, category: 'banner', popular: false },
    { name: 'Square', width: 250, height: 250, category: 'rectangle', popular: false },
    { name: 'Small Square', width: 200, height: 200, category: 'rectangle', popular: false },
    { name: 'Button', width: 125, height: 125, category: 'button', popular: false },
    { name: 'Vertical Banner', width: 120, height: 240, category: 'banner', popular: false },
    { name: 'Large Leaderboard (Desktop)', width: 970, height: 90, category: 'leaderboard', popular: false },
    { name: 'Smartphone Banner', width: 300, height: 50, category: 'mobile', popular: false },
    // Social media sizes
    { name: 'Facebook Cover', width: 820, height: 312, category: 'social', popular: true },
    { name: 'Twitter Header', width: 1500, height: 500, category: 'social', popular: true },
    { name: 'YouTube Thumbnail', width: 1280, height: 720, category: 'social', popular: true },
    { name: 'Instagram Post', width: 1080, height: 1080, category: 'social', popular: true },
    { name: 'Instagram Story', width: 1080, height: 1920, category: 'social', popular: true },
    { name: 'LinkedIn Cover', width: 1584, height: 396, category: 'social', popular: false },
  ];

  const categories = [
    { value: 'all', label: 'All Sizes' },
    { value: 'rectangle', label: 'Rectangles' },
    { value: 'leaderboard', label: 'Leaderboards' },
    { value: 'skyscraper', label: 'Skyscrapers' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'banner', label: 'Banners' },
    { value: 'social', label: 'Social Media' },
    { value: 'button', label: 'Buttons' },
  ];

  const filtered = bannerSizes.filter((b) => {
    const matchesCategory = filter === 'all' || b.category === filter;
    const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || `${b.width}x${b.height}`.includes(search);
    return matchesCategory && matchesSearch;
  });

  const allText = filtered.map((b) => `${b.name}: ${b.width}×${b.height}px`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-filter`} className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select id={`${toolId}-filter`} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label={`Category filter for ${toolName}`} className="input-field">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input id={`${toolId}-search`} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. 300x250 or Leaderboard" aria-label={`Search for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              {filtered.length} size{filtered.length !== 1 ? 's' : ''} found
            </label>
            <CopyToClipboard text={allText} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Name</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-700">Width</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-700">Height</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-700">Preview</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2">
                      {b.name}
                      {b.popular && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Popular</span>}
                    </td>
                    <td className="text-center py-2 px-2 font-mono">{b.width}</td>
                    <td className="text-center py-2 px-2 font-mono">{b.height}</td>
                    <td className="text-center py-2 px-2">
                      <div
                        className="inline-block bg-blue-100 border border-blue-300"
                        style={{
                          width: `${Math.min(b.width / 10, 60)}px`,
                          height: `${Math.min(b.height / 10, 40)}px`,
                          minWidth: '8px',
                          minHeight: '4px',
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </OutputArea>
    </div>
  );
}
