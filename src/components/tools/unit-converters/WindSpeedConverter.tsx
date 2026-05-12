'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type WindUnit = 'ms' | 'kmh' | 'mph' | 'knots' | 'beaufort';

const unitLabels: Record<WindUnit, string> = {
  ms: 'm/s',
  kmh: 'km/h',
  mph: 'mph',
  knots: 'knots',
  beaufort: 'Beaufort',
};

export default function WindSpeedConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<WindUnit>('ms');
  const [output, setOutput] = useState('');

  const beaufortToMs = (b: number): number => {
    // Approximate: v = 0.836 * B^(3/2)
    return 0.836 * Math.pow(b, 1.5);
  };

  const msToBeaufort = (ms: number): number => {
    if (ms < 0.3) return 0;
    if (ms < 1.6) return 1;
    if (ms < 3.4) return 2;
    if (ms < 5.5) return 3;
    if (ms < 8.0) return 4;
    if (ms < 10.8) return 5;
    if (ms < 13.9) return 6;
    if (ms < 17.2) return 7;
    if (ms < 20.8) return 8;
    if (ms < 24.5) return 9;
    if (ms < 28.5) return 10;
    if (ms < 32.7) return 11;
    return 12;
  };

  const beaufortDescriptions: Record<number, string> = {
    0: 'Calm',
    1: 'Light air',
    2: 'Light breeze',
    3: 'Gentle breeze',
    4: 'Moderate breeze',
    5: 'Fresh breeze',
    6: 'Strong breeze',
    7: 'Near gale',
    8: 'Gale',
    9: 'Strong gale',
    10: 'Storm',
    11: 'Violent storm',
    12: 'Hurricane force',
  };

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setOutput('Please enter a valid number.');
      return;
    }

    // Convert to m/s first
    let ms: number;
    switch (fromUnit) {
      case 'ms': ms = val; break;
      case 'kmh': ms = val / 3.6; break;
      case 'mph': ms = val * 0.44704; break;
      case 'knots': ms = val * 0.514444; break;
      case 'beaufort': ms = beaufortToMs(val); break;
    }

    const kmh = ms * 3.6;
    const mph = ms / 0.44704;
    const knots = ms / 0.514444;
    const beaufort = msToBeaufort(ms);

    const results = [
      `Wind Speed Conversion`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `Input: ${val} ${unitLabels[fromUnit]}`,
      ``,
      `Conversions:`,
      `  ${ms.toFixed(2)} m/s`,
      `  ${kmh.toFixed(2)} km/h`,
      `  ${mph.toFixed(2)} mph`,
      `  ${knots.toFixed(2)} knots`,
      `  Beaufort ${beaufort} - ${beaufortDescriptions[beaufort] || 'Unknown'}`,
      ``,
      `Description: ${beaufortDescriptions[beaufort] || 'Unknown'}`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Wind Speed</label>
              <input id={`${toolId}-value`} type="number" value={value} onChange={(e) => setValue(e.target.value)} className="input-field" placeholder="10" aria-label={`Wind speed value for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value as WindUnit)} className="input-field" aria-label="Wind speed unit">
                <option value="ms">m/s</option>
                <option value="kmh">km/h</option>
                <option value="mph">mph</option>
                <option value="knots">knots</option>
                <option value="beaufort">Beaufort</option>
              </select>
            </div>
          </div>
          <button onClick={convert} className="btn-primary">Convert</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
