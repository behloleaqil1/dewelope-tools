'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerPowerCompressionCalculator - Calculate speaker power compression
 * based on thermal effects on voice coil resistance.
 */
export default function SpeakerPowerCompressionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [ratedPower, setRatedPower] = useState('100');
  const [inputPower, setInputPower] = useState('50');
  const [sensitivity, setSensitivity] = useState('90');
  const [reNominal, setReNominal] = useState('8');
  const [tempRise, setTempRise] = useState('100');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const pRated = parseFloat(ratedPower);
    const pInput = parseFloat(inputPower);
    const sens = parseFloat(sensitivity);
    const re = parseFloat(reNominal);
    const tempR = parseFloat(tempRise);

    if (isNaN(pRated) || isNaN(pInput) || isNaN(sens) || isNaN(re) || isNaN(tempR) || pRated <= 0 || pInput <= 0 || re <= 0) {
      setOutput('Please enter valid positive values.');
      return;
    }

    // Copper temperature coefficient
    const alpha = 0.00393;
    // Resistance increase due to heating
    const reHot = re * (1 + alpha * tempR);
    // Power compression in dB
    const compressionDb = 10 * Math.log10(reHot / re);
    // Actual power delivered to voice coil
    const actualPower = pInput * (re / reHot);
    // Expected SPL without compression
    const expectedSpl = sens + 10 * Math.log10(pInput);
    // Actual SPL with compression
    const actualSpl = expectedSpl - compressionDb;
    // Thermal power handling ratio
    const thermalRatio = (pInput / pRated) * 100;

    let result = `=== Speaker Power Compression ===\n\n`;
    result += `Input Power: ${pInput} W\n`;
    result += `Rated Power: ${pRated} W\n`;
    result += `Sensitivity: ${sens} dB (1W/1m)\n`;
    result += `Nominal Re: ${re} Ω\n`;
    result += `Voice Coil Temp Rise: ${tempR}°C\n\n`;
    result += `--- Results ---\n`;
    result += `Hot Resistance: ${reHot.toFixed(2)} Ω\n`;
    result += `Power Compression: ${compressionDb.toFixed(2)} dB\n`;
    result += `Actual Power Delivered: ${actualPower.toFixed(2)} W\n`;
    result += `Expected SPL (no compression): ${expectedSpl.toFixed(1)} dB\n`;
    result += `Actual SPL (with compression): ${actualSpl.toFixed(1)} dB\n`;
    result += `Thermal Load: ${thermalRatio.toFixed(1)}% of rated\n\n`;
    result += `--- Notes ---\n`;
    result += `Power compression occurs when the voice coil heats up,\n`;
    result += `increasing its DC resistance and reducing power transfer.\n`;
    result += `A ${compressionDb.toFixed(1)} dB loss means ${((1 - Math.pow(10, -compressionDb / 10)) * 100).toFixed(1)}% of input power is lost to heat.\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">{toolName}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-rated`} className="block text-xs text-gray-600 mb-1">Rated Power (W)</label>
            <input id={`${toolId}-rated`} type="number" value={ratedPower} onChange={(e) => setRatedPower(e.target.value)} className="input-field" aria-label="Rated power in watts" />
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-xs text-gray-600 mb-1">Input Power (W)</label>
            <input id={`${toolId}-input`} type="number" value={inputPower} onChange={(e) => setInputPower(e.target.value)} className="input-field" aria-label="Input power in watts" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sens`} className="block text-xs text-gray-600 mb-1">Sensitivity (dB 1W/1m)</label>
            <input id={`${toolId}-sens`} type="number" value={sensitivity} onChange={(e) => setSensitivity(e.target.value)} className="input-field" aria-label="Speaker sensitivity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-re`} className="block text-xs text-gray-600 mb-1">Nominal Re (Ω)</label>
            <input id={`${toolId}-re`} type="number" value={reNominal} onChange={(e) => setReNominal(e.target.value)} className="input-field" aria-label="Nominal resistance in ohms" />
          </div>
          <div>
            <label htmlFor={`${toolId}-temp`} className="block text-xs text-gray-600 mb-1">Temp Rise (°C)</label>
            <input id={`${toolId}-temp`} type="number" value={tempRise} onChange={(e) => setTempRise(e.target.value)} className="input-field" aria-label="Voice coil temperature rise" />
          </div>
        </div>
        <button onClick={calculate} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" aria-label="Calculate power compression">
          Calculate Compression
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
