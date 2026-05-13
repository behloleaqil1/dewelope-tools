'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ClockJitterCalculator - Calculate clock jitter impact on ADC performance.
 * Computes SNR degradation, ENOB loss, and aperture jitter effects on ADC sampling.
 */
export default function ClockJitterCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [adcBits, setAdcBits] = useState('14');
  const [sampleRate, setSampleRate] = useState('100');
  const [inputFreq, setInputFreq] = useState('50');
  const [rmsJitter, setRmsJitter] = useState('0.5');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const bits = parseFloat(adcBits);
    const fs = parseFloat(sampleRate);
    const fin = parseFloat(inputFreq);
    const jitter = parseFloat(rmsJitter);

    if ([bits, fs, fin, jitter].some(isNaN) || bits <= 0 || jitter <= 0) {
      setOutput('Error: Please enter valid positive values.');
      return;
    }

    // Convert jitter from ps to seconds
    const jitterSec = jitter * 1e-12;
    const finHz = fin * 1e6; // MHz to Hz

    // SNR limited by jitter: SNR_j = -20*log10(2*pi*fin*tj)
    const snrJitter = -20 * Math.log10(2 * Math.PI * finHz * jitterSec);

    // Ideal SNR of ADC: 6.02*N + 1.76
    const snrIdeal = 6.02 * bits + 1.76;

    // Combined SNR
    const snrCombined = -10 * Math.log10(Math.pow(10, -snrIdeal / 10) + Math.pow(10, -snrJitter / 10));

    // ENOB from combined SNR
    const enobCombined = (snrCombined - 1.76) / 6.02;
    const enobLoss = bits - enobCombined;

    // Maximum input frequency for given jitter and bits
    const maxFreqHz = 1 / (2 * Math.PI * jitterSec * Math.pow(2, bits));
    const maxFreqMHz = maxFreqHz / 1e6;

    // Aperture uncertainty voltage error
    const fullScale = 2; // 2Vpp assumed
    const slewRate = 2 * Math.PI * finHz * (fullScale / 2);
    const voltageError = slewRate * jitterSec * 1000; // in mV

    const results = [
      `=== Clock Jitter Impact on ADC Performance ===`,
      ``,
      `--- Input Parameters ---`,
      `ADC Resolution: ${bits} bits`,
      `Sample Rate: ${fs} MSPS`,
      `Input Frequency: ${fin} MHz`,
      `RMS Clock Jitter: ${jitter} ps`,
      ``,
      `--- SNR Analysis ---`,
      `Ideal ADC SNR: ${snrIdeal.toFixed(2)} dB`,
      `Jitter-Limited SNR: ${snrJitter.toFixed(2)} dB`,
      `Combined SNR: ${snrCombined.toFixed(2)} dB`,
      `SNR Degradation: ${(snrIdeal - snrCombined).toFixed(2)} dB`,
      ``,
      `--- ENOB Analysis ---`,
      `Ideal ENOB: ${bits.toFixed(1)} bits`,
      `Effective ENOB: ${enobCombined.toFixed(2)} bits`,
      `ENOB Loss: ${enobLoss.toFixed(2)} bits`,
      ``,
      `--- Limits ---`,
      `Max Input Freq for ${bits}-bit: ${maxFreqMHz.toFixed(2)} MHz`,
      `Aperture Voltage Error: ${voltageError.toFixed(3)} mV`,
      ``,
      `--- Assessment ---`,
      enobLoss < 0.5 ? `✓ Jitter impact is minimal (< 0.5 bit loss)` :
      enobLoss < 1.0 ? `⚠ Moderate jitter impact (${enobLoss.toFixed(1)} bit loss)` :
      `✗ Severe jitter impact (${enobLoss.toFixed(1)} bit loss) - consider lower-jitter clock`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-bits`} className="block text-sm font-medium text-gray-700 mb-1">ADC Resolution (bits)</label>
              <input id={`${toolId}-bits`} type="number" value={adcBits} onChange={e => setAdcBits(e.target.value)} className="input-field" aria-label={`ADC bits for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-fs`} className="block text-sm font-medium text-gray-700 mb-1">Sample Rate (MSPS)</label>
              <input id={`${toolId}-fs`} type="number" value={sampleRate} onChange={e => setSampleRate(e.target.value)} className="input-field" aria-label="Sample rate" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-fin`} className="block text-sm font-medium text-gray-700 mb-1">Input Frequency (MHz)</label>
              <input id={`${toolId}-fin`} type="number" value={inputFreq} onChange={e => setInputFreq(e.target.value)} className="input-field" aria-label="Input frequency" />
            </div>
            <div>
              <label htmlFor={`${toolId}-jitter`} className="block text-sm font-medium text-gray-700 mb-1">RMS Jitter (ps)</label>
              <input id={`${toolId}-jitter`} type="number" value={rmsJitter} onChange={e => setRmsJitter(e.target.value)} className="input-field" aria-label="RMS jitter" />
            </div>
          </div>
          <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]">Calculate Jitter Impact</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Jitter Analysis Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
