'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OhmsLawCalculator - Calculate Voltage, Current, Resistance, and Power using Ohm's Law.
 */
export default function OhmsLawCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('');
  const [power, setPower] = useState('');
  const [results, setResults] = useState<{ V: string; I: string; R: string; P: string } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResults(null);

    const v = voltage ? parseFloat(voltage) : null;
    const i = current ? parseFloat(current) : null;
    const r = resistance ? parseFloat(resistance) : null;
    const p = power ? parseFloat(power) : null;

    const known = [v, i, r, p].filter(x => x !== null).length;
    if (known < 2) {
      setError('Please provide at least 2 values to calculate the others.');
      return;
    }

    let calcV = v, calcI = i, calcR = r, calcP = p;

    // V = IR, P = VI, P = I²R, P = V²/R
    if (calcV !== null && calcI !== null) {
      calcR = calcR ?? calcV / calcI;
      calcP = calcP ?? calcV * calcI;
    } else if (calcV !== null && calcR !== null) {
      calcI = calcI ?? calcV / calcR;
      calcP = calcP ?? (calcV * calcV) / calcR;
    } else if (calcI !== null && calcR !== null) {
      calcV = calcV ?? calcI * calcR;
      calcP = calcP ?? calcI * calcI * calcR;
    } else if (calcP !== null && calcV !== null) {
      calcI = calcI ?? calcP / calcV;
      calcR = calcR ?? (calcV * calcV) / calcP;
    } else if (calcP !== null && calcI !== null) {
      calcV = calcV ?? calcP / calcI;
      calcR = calcR ?? calcP / (calcI * calcI);
    } else if (calcP !== null && calcR !== null) {
      calcV = calcV ?? Math.sqrt(calcP * calcR);
      calcI = calcI ?? Math.sqrt(calcP / calcR);
    }

    setResults({
      V: calcV !== null ? calcV.toFixed(6).replace(/\.?0+$/, '') : 'N/A',
      I: calcI !== null ? calcI.toFixed(6).replace(/\.?0+$/, '') : 'N/A',
      R: calcR !== null ? calcR.toFixed(6).replace(/\.?0+$/, '') : 'N/A',
      P: calcP !== null ? calcP.toFixed(6).replace(/\.?0+$/, '') : 'N/A',
    });
  };

  const resultText = results ? `V = ${results.V} V\nI = ${results.I} A\nR = ${results.R} Ω\nP = ${results.P} W` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Enter at least 2 known values to calculate the rest.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-v`} className="block text-sm font-medium text-gray-700 mb-1">Voltage (V)</label>
              <input id={`${toolId}-v`} type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="Volts" className="input-field" aria-label={`Voltage for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-i`} className="block text-sm font-medium text-gray-700 mb-1">Current (A)</label>
              <input id={`${toolId}-i`} type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Amps" className="input-field" aria-label="Current in amps" />
            </div>
            <div>
              <label htmlFor={`${toolId}-r`} className="block text-sm font-medium text-gray-700 mb-1">Resistance (Ω)</label>
              <input id={`${toolId}-r`} type="number" value={resistance} onChange={(e) => setResistance(e.target.value)} placeholder="Ohms" className="input-field" aria-label="Resistance in ohms" />
            </div>
            <div>
              <label htmlFor={`${toolId}-p`} className="block text-sm font-medium text-gray-700 mb-1">Power (W)</label>
              <input id={`${toolId}-p`} type="number" value={power} onChange={(e) => setPower(e.target.value)} placeholder="Watts" className="input-field" aria-label="Power in watts" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </InputArea>

      <OutputArea hasContent={!!results}>
        {results && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Voltage</div>
                <div className="text-lg font-semibold text-blue-700">{results.V} V</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Current</div>
                <div className="text-lg font-semibold text-green-700">{results.I} A</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Resistance</div>
                <div className="text-lg font-semibold text-yellow-700">{results.R} Ω</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Power</div>
                <div className="text-lg font-semibold text-purple-700">{results.P} W</div>
              </div>
            </div>
            <CopyToClipboard text={resultText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
