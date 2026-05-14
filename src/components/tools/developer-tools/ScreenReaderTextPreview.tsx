'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ScreenReaderTextPreview - Shows how a screen reader would announce HTML content.
 */
export default function ScreenReaderTextPreview({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [html, setHtml] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const process = () => {
    setError(undefined);
    setAnnouncements([]);
    if (!html.trim()) { setError('Please enter HTML to preview'); return; }

    const results: string[] = [];
    const lower = html;

    // Process headings
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    let match;
    while ((match = headingRegex.exec(lower)) !== null) {
      const text = stripTags(match[2]);
      if (text) results.push(`Heading level ${match[1]}: "${text}"`);
    }

    // Process links
    const linkRegex = /<a[^>]*(?:href="([^"]*)")?[^>]*>(.*?)<\/a>/gi;
    while ((match = linkRegex.exec(lower)) !== null) {
      const text = stripTags(match[2]);
      if (text) results.push(`Link: "${text}"${match[1] ? ` (goes to ${match[1]})` : ''}`);
    }

    // Process images
    const imgRegex = /<img[^>]*alt="([^"]*)"[^>]*>/gi;
    while ((match = imgRegex.exec(lower)) !== null) {
      results.push(match[1] ? `Image: "${match[1]}"` : 'Image (no alt text - inaccessible)');
    }
    const imgNoAlt = /<img(?![^>]*alt=)[^>]*>/gi;
    while ((match = imgNoAlt.exec(lower)) !== null) {
      results.push('Image (no alt text - inaccessible)');
    }

    // Process buttons
    const btnRegex = /<button[^>]*(?:aria-label="([^"]*)")?[^>]*>(.*?)<\/button>/gi;
    while ((match = btnRegex.exec(lower)) !== null) {
      const label = match[1] || stripTags(match[2]);
      if (label) results.push(`Button: "${label}"`);
    }

    // Process inputs
    const inputRegex = /<input[^>]*(?:aria-label="([^"]*)")?[^>]*type="([^"]*)"[^>]*>/gi;
    while ((match = inputRegex.exec(lower)) !== null) {
      const label = match[1] || `${match[2]} input`;
      results.push(`Form control: "${label}" (${match[2]})`);
    }

    // Process lists
    const ulMatch = lower.match(/<ul[^>]*>/gi);
    const olMatch = lower.match(/<ol[^>]*>/gi);
    const liMatches = lower.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
    if (ulMatch) results.push(`List with ${liMatches.length} items`);
    if (olMatch) results.push(`Numbered list with ${liMatches.length} items`);

    // Process ARIA landmarks
    if (lower.includes('role="navigation"') || lower.includes('<nav')) results.push('Navigation landmark');
    if (lower.includes('role="main"') || lower.includes('<main')) results.push('Main content landmark');
    if (lower.includes('role="banner"') || lower.includes('<header')) results.push('Banner landmark');
    if (lower.includes('role="contentinfo"') || lower.includes('<footer')) results.push('Content info landmark');

    // Process aria-hidden
    if (lower.includes('aria-hidden="true"')) results.push('(Some content hidden from screen readers via aria-hidden)');

    // Plain text content
    const plainText = stripTags(html).trim();
    if (plainText && results.length === 0) {
      results.push(`Text: "${plainText.substring(0, 200)}${plainText.length > 200 ? '...' : ''}"`);
    }

    if (results.length === 0) results.push('No accessible content detected');
    setAnnouncements(results);
  };

  const stripTags = (str: string): string => str.replace(/<[^>]*>/g, '').trim();

  const copyText = announcements.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">HTML Content</label>
        <textarea id={`${toolId}-input`} value={html} onChange={(e) => setHtml(e.target.value)} placeholder='<h1>Welcome</h1>\n<nav><a href="/about">About</a></nav>\n<img src="photo.jpg" alt="Team photo">' aria-label={`HTML input for ${toolName}`} className="input-field font-mono min-h-[120px] text-sm" />
      </InputArea>
      <button onClick={process} aria-label="Preview screen reader output" className="btn-primary">Preview Announcements</button>
      <OutputArea hasContent={announcements.length > 0}>
        {announcements.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 mb-2">Screen reader would announce (approximate):</div>
            {announcements.map((a, i) => (
              <div key={i} className="bg-gray-50 p-2 rounded border border-gray-200 text-sm text-gray-800 font-mono">{a}</div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
