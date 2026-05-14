'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RegexPatternLibrary - Browse and copy common regex patterns with explanations.
 */
export default function RegexPatternLibrary({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');
  const [testInput, setTestInput] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const patterns = [
    { name: 'Email Address', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', description: 'Matches standard email addresses', example: 'user@example.com' },
    { name: 'URL (HTTP/HTTPS)', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)', description: 'Matches HTTP and HTTPS URLs', example: 'https://example.com/path' },
    { name: 'Phone (US)', pattern: '^(\\+1)?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$', description: 'Matches US phone numbers in various formats', example: '(555) 123-4567' },
    { name: 'IPv4 Address', pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', description: 'Matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255)', example: '192.168.1.1' },
    { name: 'IPv6 Address', pattern: '^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', description: 'Matches full IPv6 addresses', example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
    { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', description: 'Matches ISO 8601 date format', example: '2024-01-15' },
    { name: 'Time (HH:MM:SS)', pattern: '^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$', description: 'Matches 24-hour time format', example: '14:30:00' },
    { name: 'Hex Color', pattern: '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$', description: 'Matches 3 or 6 digit hex color codes', example: '#ff6600' },
    { name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Min 8 chars, uppercase, lowercase, digit, special char', example: 'P@ssw0rd!' },
    { name: 'Credit Card', pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$', description: 'Matches Visa, Mastercard, and Amex card numbers', example: '4111111111111111' },
    { name: 'UUID v4', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', description: 'Matches UUID version 4 format', example: '550e8400-e29b-41d4-a716-446655440000' },
    { name: 'Slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', description: 'Matches URL-safe slugs (lowercase, hyphens)', example: 'my-blog-post' },
    { name: 'HTML Tag', pattern: '<([a-z][a-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>', description: 'Matches opening and closing HTML tags', example: '<div>content</div>' },
    { name: 'Integer', pattern: '^-?\\d+$', description: 'Matches positive and negative integers', example: '-42' },
    { name: 'Decimal Number', pattern: '^-?\\d+\\.\\d+$', description: 'Matches decimal numbers', example: '3.14' },
  ];

  const filtered = patterns.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const testPattern = (pattern: string): boolean => {
    if (!testInput.trim()) return false;
    try {
      return new RegExp(pattern).test(testInput);
    } catch { return false; }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error="">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">Search Patterns</label>
            <input id={`${toolId}-search`} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. email, phone, url" aria-label={`Search patterns for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-test`} className="block text-sm font-medium text-gray-700 mb-1">Test String</label>
            <input id={`${toolId}-test`} type="text" value={testInput} onChange={(e) => setTestInput(e.target.value)} placeholder="Enter text to test against patterns" aria-label={`Test string for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((p, i) => {
            const matches = testInput ? testPattern(p.pattern) : null;
            return (
              <div key={i} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedIdx === i ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`} onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  {matches !== null && (
                    <span className={`text-xs px-2 py-0.5 rounded ${matches ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{matches ? 'Match' : 'No match'}</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">{p.description}</div>
                {selectedIdx === i && (
                  <div className="mt-2 space-y-2">
                    <div className="text-xs font-mono bg-white p-2 rounded border border-gray-300 break-all">{p.pattern}</div>
                    <div className="text-xs text-gray-500">Example: <code className="bg-gray-200 px-1 rounded">{p.example}</code></div>
                    <CopyToClipboard text={p.pattern} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </OutputArea>
    </div>
  );
}
