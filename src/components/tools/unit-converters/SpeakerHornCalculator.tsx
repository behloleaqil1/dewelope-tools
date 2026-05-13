'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerHornCalculator - Calculate horn speaker flare rate and cutoff frequency.
 * Supports exponential, conical, and hyperbolic horn profiles.
 */
export default function SpeakerHornCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [throatArea, setThroatArea] = useState('');
  const [mouthArea, setMouthArea] = useState('');
  const [hornLength, setHornLength] = useState('');
  const [hornType, setHornType] = useState('exponential');
  const [speedOfSound, setSpeedOfSound] = useState('343');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const St = parseFloat(throatArea) * 1e-4; // cm² to m²
    const Sm = parseFloat(mouthArea) * 1e-4;
    const L = parseFloat(hornLength) * 1e-2; // cm to m
    const c = parseFloat(speedOfSound);

    if (isNaN(St) || isNaN(Sm) || isNaN(L) || St <= 0 || Sm <= 0 || L <= 0) {
      setOutput('Please enter valid positive values for all dimensions.');
      return;
    }

    const results: string[] = [];
    results.push('=== Horn Speaker Calculator ===');
    results.push(`  Horn Type: ${hornType.charAt(0).toUpperCase() + hornType.slice(1)}`);
    results.push('');

    // Flare constant (m) for exponential horn
    const m = Math.log(Sm / St) / L;
    results.push(`Flare Constant (m): ${m.toFixed(4)} /m`);
    results.push('');

    // Cutoff frequency
    let fc: number;
    if (hornType === 'exponential') {
      fc = (m * c) / (4 * Math.PI);
    } else if (hornType === 'hyperbolic') {
      fc = (m * c) / (2 * Math.PI);
    } else {
      // Conical - approximate
      fc = c / (2 * Math.PI * L) * Math.sqrt(Sm / St - 1);
    }

    results.push(`Cutoff Frequency (fc): ${fc.toFixed(1)} Hz`);
    results.push('');

    // Mouth circumference for low-frequency loading
    const mouthDiameter = 2 * Math.sqrt(Sm / Math.PI);
    const mouthCircumference = Math.PI * mouthDiameter;
    const wavelengthAtCutoff = c / fc;
    const loadingFreq = c / mouthCircumference;

    results.push('Mouth Dimensions:');
    results.push(`  Mouth Diameter: ${(mouthDiameter * 100).toFixed(2)} cm`);
    results.push(`  Mouth Circumference: ${(mouthCircumference * 100).toFixed(2)} cm`);
    results.push(`  Wavelength at Cutoff: ${(wavelengthAtCutoff * 100).toFixed(1)} cm`);
    results.push(`  Mouth Loading Frequency: ${loadingFreq.toFixed(1)} Hz`);
    results.push('');

    // Throat diameter
    const throatDiameter = 2 * Math.sqrt(St / Math.PI);
    results.push('Throat Dimensions:');
    results.push(`  Throat Diameter: ${(throatDiameter * 100).toFixed(2)} cm`);
    results.push('');

    // Expansion ratio
    const expansionRatio = Sm / St;
    results.push(`Expansion Ratio (Sm/St): ${expansionRatio.toFixed(2)}:1`);
    results.push('');

    results.push('--- Formulas ---');
    if (hornType === 'exponential') {
      results.push('  S(x) = St × e^(m×x)');
      results.push('  fc = (m × c) / (4π)');
    } else if (hornType === 'hyperbolic') {
      results.push('  S(x) = St × cosh²(m×x)');
      results.push('  fc = (m × c) / (2π)');
    } else {
      results.push('  S(x) = St × (1 + x/x0)²');
      results.push('  fc ≈ c/(2πL) × √(Sm/St - 1)');
    }

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-throat`} className="block text-sm font-medium text-gray-700 mb-1">Throat Area (cm²)</label>
            <input id={`${toolId}-throat`} type="number" value={throatArea} onChange={(e) => setThroatArea(e.target.value)} placeholder="e.g. 25" className="input-field" aria-label={`Throat area for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-mouth`} className="block text-sm font-medium text-gray-700 mb-1">Mouth Area (cm²)</label>
            <input id={`${toolId}-mouth`} type="number" value={mouthArea} onChange={(e) => setMouthArea(e.target.value)} placeholder="e.g. 5000" className="input-field" aria-label="Mouth area" />
          </div>
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Horn Length (cm)</label>
            <input id={`${toolId}-length`} type="number" value={hornLength} onChange={(e) => setHornLength(e.target.value)} placeholder="e.g. 100" className="input-field" aria-label="Horn length" />
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Horn Profile</label>
            <select id={`${toolId}-type`} value={hornType} onChange={(e) => setHornType(e.target.value)} className="input-field" aria-label="Horn type">
              <option value="exponential">Exponential</option>
              <option value="hyperbolic">Hyperbolic (Hypex)</option>
              <option value="conical">Conical</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-speed`} className="block text-sm font-medium text-gray-700 mb-1">Speed of Sound (m/s)</label>
            <input id={`${toolId}-speed`} type="number" value={speedOfSound} onChange={(e) => setSpeedOfSound(e.target.value)} className="input-field" aria-label="Speed of sound" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Calculate Horn Parameters</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Horn Speaker Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
