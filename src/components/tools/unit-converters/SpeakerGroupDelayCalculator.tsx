'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerGroupDelayCalculator - Calculate speaker group delay from crossover parameters.
 * Computes group delay, phase shift, and wavelength at crossover frequency.
 */
export default function SpeakerGroupDelayCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [crossoverFreq, setCrossoverFreq] = useState('2000');
  const [filterOrder, setFilterOrder] = useState('2');
  const [filterType, setFilterType] = useState('butterworth');
  const [driverDistance, setDriverDistance] = useState('0');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const freq = parseFloat(crossoverFreq);
    const order = parseInt(filterOrder);
    const distance = parseFloat(driverDistance);

    if (isNaN(freq) || isNaN(order) || isNaN(distance) || freq <= 0) {
      setOutput('Please enter valid numeric values. Frequency must be positive.');
      return;
    }

    const speedOfSound = 343; // m/s at 20°C
    const wavelength = speedOfSound / freq;

    // Phase shift per order depends on filter type
    const phasePerOrder: Record<string, number> = {
      butterworth: 90,
      'linkwitz-riley': 180,
      bessel: 90,
    };

    const totalPhase = order * (phasePerOrder[filterType] || 90);
    
    // Group delay = -dφ/dω ≈ phase / (2π * freq) for a given filter
    // Simplified: group delay at crossover for Butterworth = order / (2π * fc)
    const groupDelay = (order / (2 * Math.PI * freq)) * 1000; // in ms
    
    // Distance-based delay
    const distanceDelay = (distance / 1000) / speedOfSound * 1000; // mm to m, then to ms
    const totalDelay = groupDelay + distanceDelay;

    // Wavelength fractions
    const delayAsWavelength = (totalDelay / 1000) * freq;

    const lines = [
      '=== Speaker Group Delay Calculation ===',
      '',
      '--- Input Parameters ---',
      `Crossover Frequency: ${freq} Hz`,
      `Filter Order: ${order}${order === 2 ? 'nd' : order === 1 ? 'st' : order === 3 ? 'rd' : 'th'}`,
      `Filter Type: ${filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('-', ' ')}`,
      `Driver Offset Distance: ${distance} mm`,
      '',
      '--- Delay Results ---',
      `Filter Group Delay: ${groupDelay.toFixed(3)} ms`,
      `Distance Delay: ${distanceDelay.toFixed(3)} ms`,
      `Total Group Delay: ${totalDelay.toFixed(3)} ms`,
      '',
      '--- Phase & Wavelength ---',
      `Total Phase Shift: ${totalPhase}°`,
      `Wavelength at ${freq} Hz: ${(wavelength * 100).toFixed(1)} cm`,
      `Delay as Wavelength Fraction: ${delayAsWavelength.toFixed(3)}λ`,
      '',
      '--- Audibility Assessment ---',
      `Group delay: ${totalDelay < 1 ? '✓ Below audibility threshold (<1ms above 2kHz)' : totalDelay < 2 ? '⚠ Marginal (1-2ms)' : '✗ Likely audible (>2ms)'}`,
      '',
      '--- Design Notes ---',
      `• ${filterType === 'linkwitz-riley' ? 'Linkwitz-Riley: flat summed response, 360° phase at crossover' : filterType === 'butterworth' ? 'Butterworth: +3dB at crossover, 90° phase per order' : 'Bessel: maximally flat group delay, gentle rolloff'}`,
      `• Higher order = steeper rolloff but more group delay`,
      `• Physical offset of ${distance}mm adds ${distanceDelay.toFixed(3)}ms delay`,
      `• Consider time-aligning drivers if total delay > 1ms`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Crossover Frequency (Hz)</label>
            <input id={`${toolId}-freq`} type="number" value={crossoverFreq} onChange={(e) => setCrossoverFreq(e.target.value)} className="input-field" aria-label={`Crossover frequency for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-order`} className="block text-sm font-medium text-gray-700 mb-1">Filter Order</label>
            <select id={`${toolId}-order`} value={filterOrder} onChange={(e) => setFilterOrder(e.target.value)} className="input-field" aria-label="Filter order">
              <option value="1">1st Order (6 dB/oct)</option>
              <option value="2">2nd Order (12 dB/oct)</option>
              <option value="3">3rd Order (18 dB/oct)</option>
              <option value="4">4th Order (24 dB/oct)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
            <select id={`${toolId}-type`} value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field" aria-label="Filter type">
              <option value="butterworth">Butterworth</option>
              <option value="linkwitz-riley">Linkwitz-Riley</option>
              <option value="bessel">Bessel</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-distance`} className="block text-sm font-medium text-gray-700 mb-1">Driver Offset (mm)</label>
            <input id={`${toolId}-distance`} type="number" value={driverDistance} onChange={(e) => setDriverDistance(e.target.value)} className="input-field" aria-label="Driver offset distance" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Group Delay</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Group Delay Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
