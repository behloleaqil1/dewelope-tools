'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ResistorColorCodeCalculator - Calculate resistance from color bands.
 * Supports 4-band and 5-band resistors with tolerance calculation.
 */
export default function ResistorColorCodeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bandCount, setBandCount] = useState<4 | 5>(4);
  const [band1, setBand1] = useState('brown');
  const [band2, setBand2] = useState('black');
  const [band3, setBand3] = useState('red');
  const [band4, setBand4] = useState('gold');
  const [band5, setBand5] = useState('brown');
  const [output, setOutput] = useState('');

  const colorValues: Record<string, number> = {
    black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
    green: 5, blue: 6, violet: 7, grey: 8, white: 9,
  };

  const multiplierValues: Record<string, number> = {
    black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000,
    green: 100000, blue: 1000000, violet: 10000000, grey: 100000000, white: 1000000000,
    gold: 0.1, silver: 0.01,
  };

  const toleranceValues: Record<string, string> = {
    brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%',
    violet: '±0.1%', grey: '±0.05%', gold: '±5%', silver: '±10%',
  };

  const colorOptions = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];
  const multiplierOptions = [...colorOptions, 'gold', 'silver'];
  const toleranceOptions = ['brown', 'red', 'green', 'blue', 'violet', 'grey', 'gold', 'silver'];

  const colorHex: Record<string, string> = {
    black: '#000000', brown: '#8B4513', red: '#FF0000', orange: '#FF8C00',
    yellow: '#FFD700', green: '#008000', blue: '#0000FF', violet: '#8B00FF',
    grey: '#808080', white: '#FFFFFF', gold: '#FFD700', silver: '#C0C0C0',
  };

  const formatResistance = (ohms: number): string => {
    if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(2)} MΩ`;
    if (ohms >= 1000) return `${(ohms / 1000).toFixed(2)} kΩ`;
    return `${ohms.toFixed(2)} Ω`;
  };

  const calculate = () => {
    let resistance: number;
    let toleranceBand: string;
    let multiplierBand: string;

    if (bandCount === 4) {
      const digit1 = colorValues[band1];
      const digit2 = colorValues[band2];
      multiplierBand = band3;
      toleranceBand = band4;
      resistance = (digit1 * 10 + digit2) * multiplierValues[multiplierBand];
    } else {
      const digit1 = colorValues[band1];
      const digit2 = colorValues[band2];
      const digit3 = colorValues[band3];
      multiplierBand = band4;
      toleranceBand = band5;
      resistance = (digit1 * 100 + digit2 * 10 + digit3) * multiplierValues[multiplierBand];
    }

    const tolerance = toleranceValues[toleranceBand] || '±20%';
    const tolPercent = parseFloat(tolerance.replace(/[±%]/g, ''));
    const minR = resistance * (1 - tolPercent / 100);
    const maxR = resistance * (1 + tolPercent / 100);

    const lines = [
      `Resistance: ${formatResistance(resistance)}`,
      `Tolerance: ${tolerance}`,
      `Range: ${formatResistance(minR)} to ${formatResistance(maxR)}`,
      `Raw value: ${resistance} Ω`,
    ];

    setOutput(lines.join('\n'));
  };

  const renderSelect = (label: string, value: string, onChange: (v: string) => void, options: string[], id: string) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded border" style={{ backgroundColor: colorHex[value] || '#ccc' }} />
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="input-field flex-1">
          {options.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-4">
          <label htmlFor={`${toolId}-bands`} className="block text-sm font-medium text-gray-700 mb-1">Number of Bands</label>
          <select id={`${toolId}-bands`} value={bandCount} onChange={(e) => setBandCount(Number(e.target.value) as 4 | 5)} aria-label={`Band count for ${toolName}`} className="input-field w-32">
            <option value={4}>4 Bands</option>
            <option value={5}>5 Bands</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSelect('Band 1 (1st digit)', band1, setBand1, colorOptions, `${toolId}-b1`)}
          {renderSelect('Band 2 (2nd digit)', band2, setBand2, colorOptions, `${toolId}-b2`)}
          {bandCount === 5 && renderSelect('Band 3 (3rd digit)', band3, setBand3, colorOptions, `${toolId}-b3`)}
          {renderSelect(bandCount === 4 ? 'Band 3 (Multiplier)' : 'Band 4 (Multiplier)', bandCount === 4 ? band3 : band4, bandCount === 4 ? setBand3 : setBand4, multiplierOptions, `${toolId}-mult`)}
          {renderSelect(bandCount === 4 ? 'Band 4 (Tolerance)' : 'Band 5 (Tolerance)', bandCount === 4 ? band4 : band5, bandCount === 4 ? setBand4 : setBand5, toleranceOptions, `${toolId}-tol`)}
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Resistance</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
