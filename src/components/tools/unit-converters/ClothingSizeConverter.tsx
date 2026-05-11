'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ClothingSizeConverter - Convert between US, UK, EU clothing sizes.
 */
export default function ClothingSizeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gender, setGender] = useState<'women' | 'men'>('women');
  const [sourceSystem, setSourceSystem] = useState('us');
  const [sourceSize, setSourceSize] = useState('');

  const womenSizes = [
    { us: '0', uk: '4', eu: '32', label: 'XS' },
    { us: '2', uk: '6', eu: '34', label: 'XS' },
    { us: '4', uk: '8', eu: '36', label: 'S' },
    { us: '6', uk: '10', eu: '38', label: 'S' },
    { us: '8', uk: '12', eu: '40', label: 'M' },
    { us: '10', uk: '14', eu: '42', label: 'M' },
    { us: '12', uk: '16', eu: '44', label: 'L' },
    { us: '14', uk: '18', eu: '46', label: 'L' },
    { us: '16', uk: '20', eu: '48', label: 'XL' },
    { us: '18', uk: '22', eu: '50', label: 'XL' },
    { us: '20', uk: '24', eu: '52', label: 'XXL' },
    { us: '22', uk: '26', eu: '54', label: 'XXL' },
  ];

  const menSizes = [
    { us: '34', uk: '34', eu: '44', label: 'XS' },
    { us: '36', uk: '36', eu: '46', label: 'S' },
    { us: '38', uk: '38', eu: '48', label: 'M' },
    { us: '40', uk: '40', eu: '50', label: 'M' },
    { us: '42', uk: '42', eu: '52', label: 'L' },
    { us: '44', uk: '44', eu: '54', label: 'L' },
    { us: '46', uk: '46', eu: '56', label: 'XL' },
    { us: '48', uk: '48', eu: '58', label: 'XL' },
    { us: '50', uk: '50', eu: '60', label: 'XXL' },
    { us: '52', uk: '52', eu: '62', label: 'XXL' },
  ];

  const sizes = gender === 'women' ? womenSizes : menSizes;

  const findMatch = () => {
    if (!sourceSize.trim()) return null;
    const key = sourceSystem as 'us' | 'uk' | 'eu';
    return sizes.find(s => s[key] === sourceSize.trim());
  };

  const match = findMatch();

  const copyText = match
    ? `${gender === 'women' ? 'Women' : 'Men'}'s Size Conversion:\nUS: ${match.us}\nUK: ${match.uk}\nEU: ${match.eu}\nGeneral: ${match.label}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setGender('women'); setSourceSize(''); }}
            className={`px-4 py-2 text-sm rounded border ${gender === 'women' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            Women
          </button>
          <button
            onClick={() => { setGender('men'); setSourceSize(''); }}
            className={`px-4 py-2 text-sm rounded border ${gender === 'men' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
          >
            Men
          </button>
        </div>

        <InputArea>
          <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">
            Source Sizing System
          </label>
          <select
            id={`${toolId}-system`}
            value={sourceSystem}
            onChange={(e) => { setSourceSystem(e.target.value); setSourceSize(''); }}
            aria-label={`Sizing system for ${toolName}`}
            className="input-field"
          >
            <option value="us">US</option>
            <option value="uk">UK</option>
            <option value="eu">EU</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
            Select Size
          </label>
          <select
            id={`${toolId}-size`}
            value={sourceSize}
            onChange={(e) => setSourceSize(e.target.value)}
            aria-label={`Size value for ${toolName}`}
            className="input-field"
          >
            <option value="">-- Select --</option>
            {sizes.map(s => (
              <option key={s[sourceSystem as 'us' | 'uk' | 'eu']} value={s[sourceSystem as 'us' | 'uk' | 'eu']}>
                {s[sourceSystem as 'us' | 'uk' | 'eu']}
              </option>
            ))}
          </select>
        </InputArea>
      </div>

      <OutputArea hasContent={match !== null && match !== undefined}>
        {match && (
          <div className="space-y-3">
            <div className="text-center text-sm font-medium text-gray-700 mb-2">
              {gender === 'women' ? 'Women' : 'Men'}&apos;s Size Equivalents
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{match.us}</div>
                <div className="text-xs text-gray-500">US</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{match.uk}</div>
                <div className="text-xs text-gray-500">UK</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{match.eu}</div>
                <div className="text-xs text-gray-500">EU</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-gray-800">{match.label}</div>
                <div className="text-xs text-gray-500">General</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              Note: Sizes are approximate and may vary by brand.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
