'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EarthquakeMagnitudeConverter - Convert between Richter, moment magnitude, and energy.
 */
export default function EarthquakeMagnitudeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [magnitude, setMagnitude] = useState('');
  const [scaleType, setScaleType] = useState<'richter' | 'moment' | 'energy'>('richter');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const val = parseFloat(magnitude);
    if (isNaN(val)) {
      setOutput('Error: Please enter a valid numeric value.');
      return;
    }

    let mw: number;
    let energyJoules: number;

    if (scaleType === 'richter' || scaleType === 'moment') {
      // For practical purposes, Richter (ML) ≈ Moment Magnitude (Mw) for moderate quakes
      mw = val;
      // Energy in Joules: log10(E) = 1.5*M + 4.8 (E in Joules)
      energyJoules = Math.pow(10, 1.5 * mw + 4.8);
    } else {
      // Energy given in Joules, find magnitude
      energyJoules = val;
      if (val <= 0) {
        setOutput('Error: Energy must be positive.');
        return;
      }
      mw = (Math.log10(val) - 4.8) / 1.5;
    }

    const energyTNT = energyJoules / 4.184e9; // kg of TNT
    const energyTNTTons = energyTNT / 1000;

    // Intensity description
    let description = '';
    if (mw < 2) description = 'Micro - Not felt, recorded by instruments only';
    else if (mw < 3) description = 'Minor - Rarely felt by people';
    else if (mw < 4) description = 'Light - Often felt, rarely causes damage';
    else if (mw < 5) description = 'Moderate - Noticeable shaking, minor damage';
    else if (mw < 6) description = 'Strong - Can cause damage to weak structures';
    else if (mw < 7) description = 'Major - Can cause serious damage in populated areas';
    else if (mw < 8) description = 'Great - Can cause serious damage over large areas';
    else description = 'Massive - Devastating, can destroy communities near epicenter';

    // Frequency
    let frequency = '';
    if (mw < 2) frequency = '~1,000,000+ per year';
    else if (mw < 3) frequency = '~100,000 per year';
    else if (mw < 4) frequency = '~10,000-15,000 per year';
    else if (mw < 5) frequency = '~1,000-1,500 per year';
    else if (mw < 6) frequency = '~100-150 per year';
    else if (mw < 7) frequency = '~10-20 per year';
    else if (mw < 8) frequency = '~1-2 per year';
    else frequency = '~1 every 5-10 years';

    const result = `Earthquake Magnitude Conversion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input: ${magnitude} (${scaleType === 'energy' ? 'Joules' : scaleType === 'richter' ? 'Richter ML' : 'Moment Magnitude Mw'})

Moment Magnitude (Mw): ${mw.toFixed(2)}
Richter Scale (ML): ~${mw.toFixed(2)} (approx. equivalent)

Energy Released:
  ${energyJoules.toExponential(4)} Joules
  ${energyTNT.toFixed(2)} kg TNT equivalent
  ${energyTNTTons.toFixed(4)} tons TNT equivalent

Classification: ${description}
Estimated Frequency: ${frequency}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Comparison:
  +1 magnitude = ~31.6× more energy
  +2 magnitude = ~1000× more energy

Formula: log₁₀(E) = 1.5M + 4.8 (E in Joules)`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-mag`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input id={`${toolId}-mag`} type="number" value={magnitude} onChange={(e) => setMagnitude(e.target.value)} placeholder={scaleType === 'energy' ? '1e15' : '5.0'} step="any" aria-label={`Magnitude value for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-scale`} className="block text-sm font-medium text-gray-700 mb-1">Input Scale</label>
            <select id={`${toolId}-scale`} value={scaleType} onChange={(e) => setScaleType(e.target.value as 'richter' | 'moment' | 'energy')} aria-label="Scale type" className="input-field">
              <option value="richter">Richter Scale (ML)</option>
              <option value="moment">Moment Magnitude (Mw)</option>
              <option value="energy">Energy (Joules)</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Convert</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
