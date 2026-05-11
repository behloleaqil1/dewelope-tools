'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SocialMediaImageSizes - Reference for social media image dimensions.
 * Covers Facebook, Instagram, Twitter/X, LinkedIn, YouTube, TikTok, and Pinterest.
 */
export default function SocialMediaImageSizes({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [platform, setPlatform] = useState('all');
  const [search, setSearch] = useState('');

  const sizes = [
    // Facebook
    { platform: 'facebook', name: 'Profile Photo', width: 170, height: 170, aspect: '1:1' },
    { platform: 'facebook', name: 'Cover Photo', width: 820, height: 312, aspect: '2.63:1' },
    { platform: 'facebook', name: 'Feed Post (Square)', width: 1080, height: 1080, aspect: '1:1' },
    { platform: 'facebook', name: 'Feed Post (Landscape)', width: 1200, height: 630, aspect: '1.91:1' },
    { platform: 'facebook', name: 'Story', width: 1080, height: 1920, aspect: '9:16' },
    { platform: 'facebook', name: 'Event Cover', width: 1920, height: 1005, aspect: '1.91:1' },
    // Instagram
    { platform: 'instagram', name: 'Profile Photo', width: 320, height: 320, aspect: '1:1' },
    { platform: 'instagram', name: 'Feed Post (Square)', width: 1080, height: 1080, aspect: '1:1' },
    { platform: 'instagram', name: 'Feed Post (Portrait)', width: 1080, height: 1350, aspect: '4:5' },
    { platform: 'instagram', name: 'Feed Post (Landscape)', width: 1080, height: 566, aspect: '1.91:1' },
    { platform: 'instagram', name: 'Story / Reel', width: 1080, height: 1920, aspect: '9:16' },
    { platform: 'instagram', name: 'Carousel', width: 1080, height: 1080, aspect: '1:1' },
    // Twitter/X
    { platform: 'twitter', name: 'Profile Photo', width: 400, height: 400, aspect: '1:1' },
    { platform: 'twitter', name: 'Header Image', width: 1500, height: 500, aspect: '3:1' },
    { platform: 'twitter', name: 'In-Stream Photo', width: 1600, height: 900, aspect: '16:9' },
    { platform: 'twitter', name: 'Card Image', width: 1200, height: 628, aspect: '1.91:1' },
    // LinkedIn
    { platform: 'linkedin', name: 'Profile Photo', width: 400, height: 400, aspect: '1:1' },
    { platform: 'linkedin', name: 'Cover Photo', width: 1584, height: 396, aspect: '4:1' },
    { platform: 'linkedin', name: 'Feed Post', width: 1200, height: 627, aspect: '1.91:1' },
    { platform: 'linkedin', name: 'Company Logo', width: 300, height: 300, aspect: '1:1' },
    // YouTube
    { platform: 'youtube', name: 'Thumbnail', width: 1280, height: 720, aspect: '16:9' },
    { platform: 'youtube', name: 'Channel Banner', width: 2560, height: 1440, aspect: '16:9' },
    { platform: 'youtube', name: 'Profile Photo', width: 800, height: 800, aspect: '1:1' },
    // TikTok
    { platform: 'tiktok', name: 'Video', width: 1080, height: 1920, aspect: '9:16' },
    { platform: 'tiktok', name: 'Profile Photo', width: 200, height: 200, aspect: '1:1' },
    // Pinterest
    { platform: 'pinterest', name: 'Pin (Standard)', width: 1000, height: 1500, aspect: '2:3' },
    { platform: 'pinterest', name: 'Pin (Square)', width: 1000, height: 1000, aspect: '1:1' },
    { platform: 'pinterest', name: 'Profile Photo', width: 165, height: 165, aspect: '1:1' },
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'pinterest', label: 'Pinterest' },
  ];

  const filtered = sizes.filter((s) => {
    const matchesPlatform = platform === 'all' || s.platform === platform;
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.platform.includes(search.toLowerCase()) || `${s.width}x${s.height}`.includes(search);
    return matchesPlatform && matchesSearch;
  });

  const allText = filtered.map((s) => `${s.platform.charAt(0).toUpperCase() + s.platform.slice(1)} - ${s.name}: ${s.width}×${s.height}px (${s.aspect})`).join('\n');

  const platformColors: Record<string, string> = {
    facebook: 'bg-blue-100 text-blue-700',
    instagram: 'bg-pink-100 text-pink-700',
    twitter: 'bg-sky-100 text-sky-700',
    linkedin: 'bg-indigo-100 text-indigo-700',
    youtube: 'bg-red-100 text-red-700',
    tiktok: 'bg-gray-100 text-gray-700',
    pinterest: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-platform`} className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select id={`${toolId}-platform`} value={platform} onChange={(e) => setPlatform(e.target.value)} aria-label={`Platform filter for ${toolName}`} className="input-field">
              {platforms.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input id={`${toolId}-search`} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. 1080x1080 or Story" aria-label={`Search for ${toolName}`} className="input-field" />
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
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Platform</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-700">Type</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-700">Width</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-700">Height</th>
                  <th className="text-center py-2 px-2 font-medium text-gray-700">Aspect</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${platformColors[s.platform] || 'bg-gray-100 text-gray-700'}`}>
                        {s.platform.charAt(0).toUpperCase() + s.platform.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-2">{s.name}</td>
                    <td className="text-center py-2 px-2 font-mono">{s.width}</td>
                    <td className="text-center py-2 px-2 font-mono">{s.height}</td>
                    <td className="text-center py-2 px-2 font-mono text-gray-500">{s.aspect}</td>
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
