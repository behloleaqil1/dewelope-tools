'use client';

import { useState, useEffect } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeZoneMapViewer - Show UTC offsets for all major timezones in a list view.
 * Displays current time in each timezone with search/filter capability.
 */
export default function TimeZoneMapViewer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [search, setSearch] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filter, setFilter] = useState<'all' | 'negative' | 'zero' | 'positive'>('all');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timezones = [
    { name: 'Baker Island (US)', abbr: 'AoE', offset: -12 },
    { name: 'American Samoa', abbr: 'SST', offset: -11 },
    { name: 'Hawaii (US)', abbr: 'HST', offset: -10 },
    { name: 'Alaska (US)', abbr: 'AKST', offset: -9 },
    { name: 'Pacific (US/Canada)', abbr: 'PST', offset: -8 },
    { name: 'Mountain (US/Canada)', abbr: 'MST', offset: -7 },
    { name: 'Central (US/Canada)', abbr: 'CST', offset: -6 },
    { name: 'Eastern (US/Canada)', abbr: 'EST', offset: -5 },
    { name: 'Atlantic (Canada)', abbr: 'AST', offset: -4 },
    { name: 'Argentina, Brazil (São Paulo)', abbr: 'ART', offset: -3 },
    { name: 'South Georgia', abbr: 'GST', offset: -2 },
    { name: 'Azores, Cape Verde', abbr: 'CVT', offset: -1 },
    { name: 'London, Lisbon, Accra', abbr: 'GMT/UTC', offset: 0 },
    { name: 'Paris, Berlin, Lagos', abbr: 'CET', offset: 1 },
    { name: 'Cairo, Johannesburg, Helsinki', abbr: 'EET', offset: 2 },
    { name: 'Moscow, Nairobi, Riyadh', abbr: 'MSK', offset: 3 },
    { name: 'Dubai, Baku', abbr: 'GST', offset: 4 },
    { name: 'Karachi, Tashkent', abbr: 'PKT', offset: 5 },
    { name: 'India (Mumbai, Delhi)', abbr: 'IST', offset: 5.5 },
    { name: 'Dhaka, Almaty', abbr: 'BST', offset: 6 },
    { name: 'Bangkok, Jakarta, Hanoi', abbr: 'ICT', offset: 7 },
    { name: 'Beijing, Singapore, Perth', abbr: 'CST', offset: 8 },
    { name: 'Tokyo, Seoul', abbr: 'JST', offset: 9 },
    { name: 'Sydney, Melbourne', abbr: 'AEST', offset: 10 },
    { name: 'Solomon Islands, Noumea', abbr: 'SBT', offset: 11 },
    { name: 'Auckland, Fiji', abbr: 'NZST', offset: 12 },
    { name: 'Samoa, Tonga', abbr: 'TOT', offset: 13 },
  ];

  const getTimeForOffset = (offset: number) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const target = new Date(utc + offset * 3600000);
    return target.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const formatOffset = (offset: number) => {
    const sign = offset >= 0 ? '+' : '-';
    const abs = Math.abs(offset);
    const hours = Math.floor(abs);
    const minutes = (abs - hours) * 60;
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const filtered = timezones.filter((tz) => {
    const matchesSearch = !search || tz.name.toLowerCase().includes(search.toLowerCase()) || tz.abbr.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'negative' && tz.offset < 0) || (filter === 'zero' && tz.offset === 0) || (filter === 'positive' && tz.offset > 0);
    return matchesSearch && matchesFilter;
  });

  const copyText = filtered.map((tz) => `${formatOffset(tz.offset)} | ${tz.abbr} | ${tz.name} | ${getTimeForOffset(tz.offset)}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor={`${toolId}-search`} className="block text-sm font-medium text-gray-700 mb-1">Search Timezone</label>
          <input id={`${toolId}-search`} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. Tokyo, EST, India..." aria-label={`Search timezone for ${toolName}`} className="input-field" />
        </div>
        <div>
          <label htmlFor={`${toolId}-filter`} className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
          <select id={`${toolId}-filter`} value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="input-field" aria-label="Offset filter">
            <option value="all">All Offsets</option>
            <option value="negative">Negative (West)</option>
            <option value="zero">UTC±0</option>
            <option value="positive">Positive (East)</option>
          </select>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        Your local time: <span className="font-mono font-medium text-gray-800">{currentTime.toLocaleTimeString()}</span>
      </div>

      <OutputArea hasContent={filtered.length > 0}>
        <div className="space-y-2">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 text-left">Offset</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Abbr</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Region</th>
                  <th className="border border-gray-200 px-3 py-2 text-left">Current Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tz) => (
                  <tr key={`${tz.abbr}-${tz.offset}`} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2 font-mono font-medium">{formatOffset(tz.offset)}</td>
                    <td className="border border-gray-200 px-3 py-2 font-medium">{tz.abbr}</td>
                    <td className="border border-gray-200 px-3 py-2 text-gray-600">{tz.name}</td>
                    <td className="border border-gray-200 px-3 py-2 font-mono">{getTimeForOffset(tz.offset)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-500 mt-2">{filtered.length} timezone(s) shown</div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
