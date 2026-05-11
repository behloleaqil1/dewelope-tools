'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BloodTypeCompatibility - Check blood type donation/receiving compatibility.
 */
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

const COMPATIBILITY: Record<string, { canDonateTo: string[]; canReceiveFrom: string[] }> = {
  'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
  'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
  'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
  'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
  'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  'AB-': { canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'] },
  'O+': { canDonateTo: ['A+', 'B+', 'AB+', 'O+'], canReceiveFrom: ['O+', 'O-'] },
  'O-': { canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceiveFrom: ['O-'] },
};

export default function BloodTypeCompatibility({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState<{ type: string; canDonateTo: string[]; canReceiveFrom: string[] } | null>(null);

  function handleCheck() {
    if (!selected) return;
    const compat = COMPATIBILITY[selected];
    setResult({ type: selected, ...compat });
  }

  const copyText = result
    ? `Blood Type: ${result.type}\nCan Donate To: ${result.canDonateTo.join(', ')}\nCan Receive From: ${result.canReceiveFrom.join(', ')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-select`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Blood Type
        </label>
        <select
          id={`${toolId}-select`}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          aria-label={`Blood type selection for ${toolName}`}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        >
          <option value="">-- Select blood type --</option>
          {BLOOD_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </InputArea>

      <button
        onClick={handleCheck}
        aria-label="Check compatibility"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Check Compatibility
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
              <div className="text-3xl font-bold text-red-700">{result.type}</div>
              <div className="text-xs text-red-500 mt-1">Selected Blood Type</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-700 mb-2">Can Donate To</div>
                <div className="flex flex-wrap gap-2">
                  {result.canDonateTo.map((type) => (
                    <span key={type} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-mono">{type}</span>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-700 mb-2">Can Receive From</div>
                <div className="flex flex-wrap gap-2">
                  {result.canReceiveFrom.map((type) => (
                    <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">{type}</span>
                  ))}
                </div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
