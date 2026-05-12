'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ShoeSizeWidthConverter - Convert shoe widths between US/UK/EU systems.
 */
export default function ShoeSizeWidthConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [system, setSystem] = useState<'us' | 'uk' | 'eu'>('us');
  const [width, setWidth] = useState('D');
  const [result, setResult] = useState<{ us: string; uk: string; eu: string; mm: string; description: string } | null>(null);
  const [error, setError] = useState('');

  const widthData: Record<string, { us: string; uk: string; eu: string; mmMen: number; mmWomen: number; description: string }> = {
    'AAA': { us: 'AAA', uk: 'Extra Narrow', eu: 'N/A', mmMen: 85, mmWomen: 75, description: 'Extra Extra Narrow' },
    'AA': { us: 'AA', uk: 'Narrow', eu: 'B', mmMen: 90, mmWomen: 80, description: 'Extra Narrow' },
    'A': { us: 'A', uk: 'Narrow', eu: 'C', mmMen: 92, mmWomen: 82, description: 'Narrow' },
    'B': { us: 'B', uk: 'Narrow/Standard', eu: 'D/E', mmMen: 95, mmWomen: 85, description: 'Narrow (Men) / Standard (Women)' },
    'C': { us: 'C', uk: 'Standard', eu: 'E', mmMen: 97, mmWomen: 87, description: 'Slightly Narrow' },
    'D': { us: 'D', uk: 'Standard', eu: 'F', mmMen: 100, mmWomen: 90, description: 'Standard (Men) / Wide (Women)' },
    'E': { us: 'E', uk: 'Wide', eu: 'G', mmMen: 103, mmWomen: 93, description: 'Wide (Men) / Extra Wide (Women)' },
    'EE': { us: 'EE/2E', uk: 'Wide', eu: 'H', mmMen: 108, mmWomen: 98, description: 'Extra Wide' },
    'EEE': { us: 'EEE/3E', uk: 'Extra Wide', eu: 'J', mmMen: 113, mmWomen: 103, description: 'Extra Extra Wide' },
    'EEEE': { us: 'EEEE/4E', uk: 'Extra Wide', eu: 'K', mmMen: 118, mmWomen: 108, description: 'Ultra Wide' },
  };

  const usWidths = ['AAA', 'AA', 'A', 'B', 'C', 'D', 'E', 'EE', 'EEE', 'EEEE'];
  const ukWidths = ['Extra Narrow', 'Narrow', 'Narrow/Standard', 'Standard', 'Wide', 'Extra Wide'];
  const euWidths = ['N/A', 'B', 'C', 'D/E', 'E', 'F', 'G', 'H', 'J', 'K'];

  const getWidthOptions = () => {
    if (system === 'us') return usWidths;
    if (system === 'uk') return [...new Set(ukWidths)];
    return [...new Set(euWidths)];
  };

  const convert = () => {
    setError('');
    setResult(null);

    let match: typeof widthData[string] | undefined;

    if (system === 'us') {
      match = widthData[width];
    } else if (system === 'uk') {
      const entry = Object.entries(widthData).find(([, v]) => v.uk === width);
      match = entry ? entry[1] : undefined;
    } else {
      const entry = Object.entries(widthData).find(([, v]) => v.eu === width);
      match = entry ? entry[1] : undefined;
    }

    if (!match) {
      setError('Width not found in conversion table.');
      return;
    }

    setResult({
      us: match.us,
      uk: match.uk,
      eu: match.eu,
      mm: `Men: ~${match.mmMen}mm / Women: ~${match.mmWomen}mm`,
      description: match.description,
    });
  };

  const copyText = result ? `Shoe Width Conversion:\nUS: ${result.us}\nUK: ${result.uk}\nEU: ${result.eu}\nApprox. Width: ${result.mm}\nDescription: ${result.description}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">Width System</label>
              <select id={`${toolId}-system`} value={system} onChange={(e) => { setSystem(e.target.value as 'us' | 'uk' | 'eu'); setWidth(getWidthOptions()[0] || ''); }} aria-label={`Width system for ${toolName}`} className="input-field">
                <option value="us">US</option>
                <option value="uk">UK</option>
                <option value="eu">EU</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Width</label>
              <select id={`${toolId}-width`} value={width} onChange={(e) => setWidth(e.target.value)} aria-label="Shoe width" className="input-field">
                {getWidthOptions().map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert shoe width">Convert Width</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800">{result.description}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.us}</div>
                <div className="text-xs text-gray-500 mt-1">US Width</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.uk}</div>
                <div className="text-xs text-gray-500 mt-1">UK Width</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.eu}</div>
                <div className="text-xs text-gray-500 mt-1">EU Width</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-bold text-orange-600">{result.mm}</div>
                <div className="text-xs text-gray-500 mt-1">Approx. Width</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              Note: Width measurements are approximate and vary by manufacturer. US D = standard men&apos;s width, US B = standard women&apos;s width.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
