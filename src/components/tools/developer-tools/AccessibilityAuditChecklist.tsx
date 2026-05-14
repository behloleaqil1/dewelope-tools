'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface CheckItem { id: string; criterion: string; level: 'A' | 'AA' | 'AAA'; category: string; }

const CHECKLIST: CheckItem[] = [
  { id: '1.1.1', criterion: 'Non-text content has text alternatives', level: 'A', category: 'Perceivable' },
  { id: '1.2.1', criterion: 'Audio/video has captions or transcripts', level: 'A', category: 'Perceivable' },
  { id: '1.3.1', criterion: 'Info and relationships conveyed through structure', level: 'A', category: 'Perceivable' },
  { id: '1.3.2', criterion: 'Meaningful reading sequence preserved', level: 'A', category: 'Perceivable' },
  { id: '1.4.1', criterion: 'Color is not the only means of conveying info', level: 'A', category: 'Perceivable' },
  { id: '1.4.3', criterion: 'Text contrast ratio at least 4.5:1', level: 'AA', category: 'Perceivable' },
  { id: '1.4.4', criterion: 'Text can be resized up to 200% without loss', level: 'AA', category: 'Perceivable' },
  { id: '1.4.11', criterion: 'Non-text contrast ratio at least 3:1', level: 'AA', category: 'Perceivable' },
  { id: '2.1.1', criterion: 'All functionality available via keyboard', level: 'A', category: 'Operable' },
  { id: '2.1.2', criterion: 'No keyboard traps', level: 'A', category: 'Operable' },
  { id: '2.2.1', criterion: 'Timing is adjustable for time limits', level: 'A', category: 'Operable' },
  { id: '2.4.1', criterion: 'Skip navigation mechanism provided', level: 'A', category: 'Operable' },
  { id: '2.4.2', criterion: 'Pages have descriptive titles', level: 'A', category: 'Operable' },
  { id: '2.4.3', criterion: 'Focus order is logical and meaningful', level: 'A', category: 'Operable' },
  { id: '2.4.6', criterion: 'Headings and labels are descriptive', level: 'AA', category: 'Operable' },
  { id: '2.4.7', criterion: 'Focus indicator is visible', level: 'AA', category: 'Operable' },
  { id: '3.1.1', criterion: 'Page language is identified in HTML', level: 'A', category: 'Understandable' },
  { id: '3.2.1', criterion: 'No unexpected context changes on focus', level: 'A', category: 'Understandable' },
  { id: '3.3.1', criterion: 'Input errors are identified and described', level: 'A', category: 'Understandable' },
  { id: '3.3.2', criterion: 'Labels or instructions provided for inputs', level: 'A', category: 'Understandable' },
  { id: '4.1.1', criterion: 'HTML is well-formed (no duplicate IDs)', level: 'A', category: 'Robust' },
  { id: '4.1.2', criterion: 'Custom controls have name, role, value', level: 'A', category: 'Robust' },
  { id: '4.1.3', criterion: 'Status messages use ARIA live regions', level: 'AA', category: 'Robust' },
];

/**
 * AccessibilityAuditChecklist - Interactive WCAG checklist for accessibility audits.
 */
export default function AccessibilityAuditChecklist({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [filterLevel, setFilterLevel] = useState<'all' | 'A' | 'AA' | 'AAA'>('all');

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setChecked(next);
  };

  const filtered = CHECKLIST.filter(item => filterLevel === 'all' || item.level === filterLevel);
  const progress = filtered.length > 0 ? Math.round((filtered.filter(i => checked.has(i.id)).length / filtered.length) * 100) : 0;

  const copyText = filtered.map(i => `[${checked.has(i.id) ? 'x' : ' '}] ${i.id} (${i.level}) ${i.criterion}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex items-center gap-3">
        <label htmlFor={`${toolId}-level`} className="text-sm font-medium text-gray-700">Filter Level:</label>
        <select id={`${toolId}-level`} value={filterLevel} onChange={(e) => setFilterLevel(e.target.value as typeof filterLevel)} aria-label={`WCAG level filter for ${toolName}`} className="input-field w-auto">
          <option value="all">All Levels</option>
          <option value="A">Level A</option>
          <option value="AA">Level AA</option>
          <option value="AAA">Level AAA</option>
        </select>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-800">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <OutputArea hasContent={true}>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map(item => (
            <label key={item.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked.has(item.id) ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <input type="checkbox" checked={checked.has(item.id)} onChange={() => toggle(item.id)} aria-label={`${item.id} ${item.criterion}`} className="mt-0.5 rounded" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500">{item.id}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${item.level === 'A' ? 'bg-blue-100 text-blue-700' : item.level === 'AA' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{item.level}</span>
                  <span className="text-xs text-gray-400">{item.category}</span>
                </div>
                <div className="text-sm text-gray-800 mt-0.5">{item.criterion}</div>
              </div>
            </label>
          ))}
        </div>
        <CopyToClipboard text={copyText} />
      </OutputArea>
    </div>
  );
}
