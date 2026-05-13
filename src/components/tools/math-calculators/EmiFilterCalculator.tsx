'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EmiFilterCalculator - Calculate EMI filter component values.
 * Computes LC filter values for given cutoff frequency and impedance requirements.
 */
export default function EmiFilterCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filterType, setFilterType] = useState<'lc-lowpass' | 'pi' | 'tee'>('lc-lowpass');
  const [cutoffFreq, setCutoffFreq] = useState('1000');
  const [freqUnit, setFreqUnit] = useState<'Hz' | 'kHz' | 'MHz'>('kHz');
  const [impedance, setImpedance] = useState('50');
  const [attenuation, setAttenuation] = useState('40');
  const [output, setOutput] = useState('');

  const calculate = () => {
    let fc = parseFloat(cutoffFreq);
    const z = parseFloat(impedance);
    const atten = parseFloat(attenuation);

    if (isNaN(fc) || isNaN(z) || isNaN(atten) || fc <= 0 || z <= 0 || atten <= 0) {
      setOutput('Error: All values must be positive numbers.');
      return;
    }

    // Convert to Hz
    if (freqUnit === 'kHz') fc *= 1e3;
    else if (freqUnit === 'MHz') fc *= 1e6;

    const omega = 2 * Math.PI * fc;
    let results = '';

    if (filterType === 'lc-lowpass') {
      // Simple LC low-pass filter
      const L = z / omega;
      const C = 1 / (omega * z);

      // Attenuation at 10x cutoff
      const f10x = fc * 10;
      const omega10x = 2 * Math.PI * f10x;
      const attenAt10x = 20 * Math.log10(omega10x * omega10x * L * C);

      results = `=== LC Low-Pass EMI Filter ===\n\n`;
      results += `Input Parameters:\n`;
      results += `  Cutoff Frequency: ${cutoffFreq} ${freqUnit} (${fc.toExponential(2)} Hz)\n`;
      results += `  Source/Load Impedance: ${z} Ω\n`;
      results += `  Desired Attenuation: ${atten} dB\n\n`;
      results += `Component Values:\n`;
      results += `  Inductor (L): ${formatValue(L, 'H')}\n`;
      results += `  Capacitor (C): ${formatValue(C, 'F')}\n\n`;
      results += `Performance:\n`;
      results += `  -3dB Cutoff: ${formatFreq(fc)}\n`;
      results += `  Rolloff: -40 dB/decade (2nd order)\n`;
      results += `  Attenuation at 10× fc: ${attenAt10x.toFixed(1)} dB\n\n`;
      results += `Notes:\n`;
      results += `  • Place inductor in series, capacitor to ground\n`;
      results += `  • Use ferrite core inductor for high-frequency EMI\n`;
      results += `  • Add X/Y safety capacitors for mains filtering\n`;
    } else if (filterType === 'pi') {
      // Pi filter (C-L-C)
      const L = z / omega;
      const C = 1 / (omega * z);
      const C1 = C / 2;
      const C2 = C / 2;

      const f10x = fc * 10;
      const omega10x = 2 * Math.PI * f10x;
      const attenAt10x = 20 * Math.log10(omega10x * omega10x * omega10x * L * C1 * C2 * z);

      results = `=== Pi (C-L-C) EMI Filter ===\n\n`;
      results += `Input Parameters:\n`;
      results += `  Cutoff Frequency: ${cutoffFreq} ${freqUnit} (${fc.toExponential(2)} Hz)\n`;
      results += `  Source/Load Impedance: ${z} Ω\n\n`;
      results += `Component Values:\n`;
      results += `  Input Capacitor (C1): ${formatValue(C1, 'F')}\n`;
      results += `  Inductor (L): ${formatValue(L, 'H')}\n`;
      results += `  Output Capacitor (C2): ${formatValue(C2, 'F')}\n\n`;
      results += `Performance:\n`;
      results += `  -3dB Cutoff: ${formatFreq(fc)}\n`;
      results += `  Rolloff: -60 dB/decade (3rd order)\n`;
      results += `  Estimated attenuation at 10× fc: ${attenAt10x.toFixed(1)} dB\n\n`;
      results += `Notes:\n`;
      results += `  • Best for low-impedance source and load\n`;
      results += `  • Higher attenuation than simple LC\n`;
      results += `  • C1 faces the noise source\n`;
    } else {
      // T filter (L-C-L)
      const L = z / omega;
      const C = 1 / (omega * z);
      const L1 = L / 2;
      const L2 = L / 2;

      results = `=== T (L-C-L) EMI Filter ===\n\n`;
      results += `Input Parameters:\n`;
      results += `  Cutoff Frequency: ${cutoffFreq} ${freqUnit} (${fc.toExponential(2)} Hz)\n`;
      results += `  Source/Load Impedance: ${z} Ω\n\n`;
      results += `Component Values:\n`;
      results += `  Input Inductor (L1): ${formatValue(L1, 'H')}\n`;
      results += `  Capacitor (C): ${formatValue(C, 'F')}\n`;
      results += `  Output Inductor (L2): ${formatValue(L2, 'H')}\n\n`;
      results += `Performance:\n`;
      results += `  -3dB Cutoff: ${formatFreq(fc)}\n`;
      results += `  Rolloff: -60 dB/decade (3rd order)\n\n`;
      results += `Notes:\n`;
      results += `  • Best for high-impedance source and load\n`;
      results += `  • Good for current-mode noise suppression\n`;
      results += `  • Use common-mode choke for CM noise\n`;
    }

    setOutput(results);
  };

  const formatValue = (value: number, unit: string): string => {
    if (value >= 1) return `${value.toFixed(3)} ${unit}`;
    if (value >= 1e-3) return `${(value * 1e3).toFixed(3)} m${unit}`;
    if (value >= 1e-6) return `${(value * 1e6).toFixed(3)} μ${unit}`;
    if (value >= 1e-9) return `${(value * 1e9).toFixed(3)} n${unit}`;
    return `${(value * 1e12).toFixed(3)} p${unit}`;
  };

  const formatFreq = (hz: number): string => {
    if (hz >= 1e9) return `${(hz / 1e9).toFixed(2)} GHz`;
    if (hz >= 1e6) return `${(hz / 1e6).toFixed(2)} MHz`;
    if (hz >= 1e3) return `${(hz / 1e3).toFixed(2)} kHz`;
    return `${hz.toFixed(2)} Hz`;
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Filter Topology</label>
            <select id={`${toolId}-type`} value={filterType} onChange={(e) => setFilterType(e.target.value as 'lc-lowpass' | 'pi' | 'tee')} className="input-field" aria-label={`Filter type for ${toolName}`}>
              <option value="lc-lowpass">LC Low-Pass (2nd order)</option>
              <option value="pi">Pi Filter C-L-C (3rd order)</option>
              <option value="tee">T Filter L-C-L (3rd order)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Cutoff Frequency</label>
            <div className="flex gap-2">
              <input id={`${toolId}-freq`} type="number" value={cutoffFreq} onChange={(e) => setCutoffFreq(e.target.value)} className="input-field flex-1" aria-label="Cutoff frequency" />
              <select value={freqUnit} onChange={(e) => setFreqUnit(e.target.value as 'Hz' | 'kHz' | 'MHz')} className="input-field w-24" aria-label="Frequency unit">
                <option value="Hz">Hz</option>
                <option value="kHz">kHz</option>
                <option value="MHz">MHz</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-z`} className="block text-sm font-medium text-gray-700 mb-1">Impedance (Ω)</label>
            <input id={`${toolId}-z`} type="number" value={impedance} onChange={(e) => setImpedance(e.target.value)} className="input-field" aria-label="Impedance in ohms" />
          </div>
          <div>
            <label htmlFor={`${toolId}-atten`} className="block text-sm font-medium text-gray-700 mb-1">Desired Attenuation (dB)</label>
            <input id={`${toolId}-atten`} type="number" value={attenuation} onChange={(e) => setAttenuation(e.target.value)} className="input-field" aria-label="Desired attenuation in dB" />
          </div>
        </div>
        <button onClick={calculate} className="mt-4 btn-primary">Calculate Filter</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">EMI Filter Design</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
