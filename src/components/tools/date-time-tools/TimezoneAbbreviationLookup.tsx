'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface TimezoneInfo {
  abbreviation: string;
  name: string;
  utcOffset: string;
  region: string;
}

const TIMEZONES: TimezoneInfo[] = [
  { abbreviation: 'UTC', name: 'Coordinated Universal Time', utcOffset: '+00:00', region: 'Worldwide' },
  { abbreviation: 'GMT', name: 'Greenwich Mean Time', utcOffset: '+00:00', region: 'Europe/Africa' },
  { abbreviation: 'EST', name: 'Eastern Standard Time', utcOffset: '-05:00', region: 'North America' },
  { abbreviation: 'EDT', name: 'Eastern Daylight Time', utcOffset: '-04:00', region: 'North America' },
  { abbreviation: 'CST', name: 'Central Standard Time', utcOffset: '-06:00', region: 'North America' },
  { abbreviation: 'CDT', name: 'Central Daylight Time', utcOffset: '-05:00', region: 'North America' },
  { abbreviation: 'MST', name: 'Mountain Standard Time', utcOffset: '-07:00', region: 'North America' },
  { abbreviation: 'MDT', name: 'Mountain Daylight Time', utcOffset: '-06:00', region: 'North America' },
  { abbreviation: 'PST', name: 'Pacific Standard Time', utcOffset: '-08:00', region: 'North America' },
  { abbreviation: 'PDT', name: 'Pacific Daylight Time', utcOffset: '-07:00', region: 'North America' },
  { abbreviation: 'AKST', name: 'Alaska Standard Time', utcOffset: '-09:00', region: 'North America' },
  { abbreviation: 'AKDT', name: 'Alaska Daylight Time', utcOffset: '-08:00', region: 'North America' },
  { abbreviation: 'HST', name: 'Hawaii Standard Time', utcOffset: '-10:00', region: 'North America' },
  { abbreviation: 'AST', name: 'Atlantic Standard Time', utcOffset: '-04:00', region: 'North America' },
  { abbreviation: 'NST', name: 'Newfoundland Standard Time', utcOffset: '-03:30', region: 'North America' },
  { abbreviation: 'CET', name: 'Central European Time', utcOffset: '+01:00', region: 'Europe' },
  { abbreviation: 'CEST', name: 'Central European Summer Time', utcOffset: '+02:00', region: 'Europe' },
  { abbreviation: 'EET', name: 'Eastern European Time', utcOffset: '+02:00', region: 'Europe' },
  { abbreviation: 'EEST', name: 'Eastern European Summer Time', utcOffset: '+03:00', region: 'Europe' },
  { abbreviation: 'WET', name: 'Western European Time', utcOffset: '+00:00', region: 'Europe' },
  { abbreviation: 'WEST', name: 'Western European Summer Time', utcOffset: '+01:00', region: 'Europe' },
  { abbreviation: 'BST', name: 'British Summer Time', utcOffset: '+01:00', region: 'Europe' },
  { abbreviation: 'IST', name: 'India Standard Time', utcOffset: '+05:30', region: 'Asia' },
  { abbreviation: 'CST (China)', name: 'China Standard Time', utcOffset: '+08:00', region: 'Asia' },
  { abbreviation: 'JST', name: 'Japan Standard Time', utcOffset: '+09:00', region: 'Asia' },
  { abbreviation: 'KST', name: 'Korea Standard Time', utcOffset: '+09:00', region: 'Asia' },
  { abbreviation: 'SGT', name: 'Singapore Time', utcOffset: '+08:00', region: 'Asia' },
  { abbreviation: 'HKT', name: 'Hong Kong Time', utcOffset: '+08:00', region: 'Asia' },
  { abbreviation: 'ICT', name: 'Indochina Time', utcOffset: '+07:00', region: 'Asia' },
  { abbreviation: 'WIB', name: 'Western Indonesian Time', utcOffset: '+07:00', region: 'Asia' },
  { abbreviation: 'PKT', name: 'Pakistan Standard Time', utcOffset: '+05:00', region: 'Asia' },
  { abbreviation: 'AEST', name: 'Australian Eastern Standard Time', utcOffset: '+10:00', region: 'Australia' },
  { abbreviation: 'AEDT', name: 'Australian Eastern Daylight Time', utcOffset: '+11:00', region: 'Australia' },
  { abbreviation: 'ACST', name: 'Australian Central Standard Time', utcOffset: '+09:30', region: 'Australia' },
  { abbreviation: 'AWST', name: 'Australian Western Standard Time', utcOffset: '+08:00', region: 'Australia' },
  { abbreviation: 'NZST', name: 'New Zealand Standard Time', utcOffset: '+12:00', region: 'Pacific' },
  { abbreviation: 'NZDT', name: 'New Zealand Daylight Time', utcOffset: '+13:00', region: 'Pacific' },
  { abbreviation: 'BRT', name: 'Brasilia Time', utcOffset: '-03:00', region: 'South America' },
  { abbreviation: 'ART', name: 'Argentina Time', utcOffset: '-03:00', region: 'South America' },
  { abbreviation: 'CLT', name: 'Chile Standard Time', utcOffset: '-04:00', region: 'South America' },
  { abbreviation: 'WAT', name: 'West Africa Time', utcOffset: '+01:00', region: 'Africa' },
  { abbreviation: 'CAT', name: 'Central Africa Time', utcOffset: '+02:00', region: 'Africa' },
  { abbreviation: 'EAT', name: 'East Africa Time', utcOffset: '+03:00', region: 'Africa' },
  { abbreviation: 'SAST', name: 'South Africa Standard Time', utcOffset: '+02:00', region: 'Africa' },
  { abbreviation: 'MSK', name: 'Moscow Standard Time', utcOffset: '+03:00', region: 'Europe/Asia' },
  { abbreviation: 'GST', name: 'Gulf Standard Time', utcOffset: '+04:00', region: 'Middle East' },
  { abbreviation: 'AST (Arabia)', name: 'Arabia Standard Time', utcOffset: '+03:00', region: 'Middle East' },
];

/**
 * TimezoneAbbreviationLookup - Look up timezone abbreviations with UTC offsets.
 */
export default function TimezoneAbbreviationLookup({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<TimezoneInfo[]>(TIMEZONES);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!search.trim()) {
        setFiltered(TIMEZONES);
        return;
      }

      const query = search.toLowerCase();
      setFiltered(
        TIMEZONES.filter(
          (tz) =>
            tz.abbreviation.toLowerCase().includes(query) ||
            tz.name.toLowerCase().includes(query) ||
            tz.region.toLowerCase().includes(query) ||
            tz.utcOffset.includes(query)
        )
      );
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const copyText = filtered
    .map((tz) => `${tz.abbreviation} - ${tz.name} (UTC${tz.utcOffset}) - ${tz.region}`)
    .join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">
          Search timezone abbreviation, name, or region
        </label>
        <input
          id={`${toolId}-search`}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. PST, Eastern, Asia, +05:30"
          aria-label={`Search input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{filtered.length} timezone{filtered.length !== 1 ? 's' : ''} found</span>
            <CopyToClipboard text={copyText} />
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border border-gray-200 font-medium">Abbreviation</th>
                  <th className="text-left p-2 border border-gray-200 font-medium">Full Name</th>
                  <th className="text-left p-2 border border-gray-200 font-medium">UTC Offset</th>
                  <th className="text-left p-2 border border-gray-200 font-medium">Region</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tz, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-200 font-mono font-bold text-blue-600">{tz.abbreviation}</td>
                    <td className="p-2 border border-gray-200 text-gray-800">{tz.name}</td>
                    <td className="p-2 border border-gray-200 font-mono text-gray-700">UTC{tz.utcOffset}</td>
                    <td className="p-2 border border-gray-200 text-gray-600">{tz.region}</td>
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
