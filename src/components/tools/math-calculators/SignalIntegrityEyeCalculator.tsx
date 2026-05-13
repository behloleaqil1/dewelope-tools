'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SignalIntegrityEyeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dataRate, setDataRate] = useState('10');
  const [riseTime, setRiseTime] = useState('35');
  const [jitterRms, setJitterRms] = useState('5');
  const [noiseRms, setNoiseRms] = useState('20');
  const [signalAmplitude, setSignalAmplitude] = useState('800');
  const [ber, setBer] = useState('1e-12');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dr = parseFloat(dataRate);
    const rt = parseFloat(riseTime);
    const jRms = parseFloat(jitterRms);
    const nRms = parseFloat(noiseRms);
    const amp = parseFloat(signalAmplitude);
    const berVal = parseFloat(ber);

    if (isNaN(dr) || isNaN(rt) || isNaN(jRms) || isNaN(nRms) || isNaN(amp) || isNaN(berVal)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    const unitInterval = 1000 / dr; // ps (data rate in Gbps)
    const berFactor = Math.sqrt(2) * Math.abs(Math.log10(berVal)); // approximation for Q-factor
    const qFactor = berFactor / 2.5; // simplified Q from BER

    // Eye width calculation
    const deterministicJitter = rt * 0.3; // approximate DJ from rise time
    const totalJitter = deterministicJitter + 2 * qFactor * jRms;
    const eyeWidth = unitInterval - totalJitter;

    // Eye height calculation
    const totalNoise = 2 * qFactor * nRms;
    const eyeHeight = amp - totalNoise;

    // Eye opening ratio
    const eyeWidthRatio = (eyeWidth / unitInterval) * 100;
    const eyeHeightRatio = (eyeHeight / amp) * 100;

    // Bandwidth estimate
    const bandwidth3dB = 0.35 / (rt / 1000); // GHz

    const results = `Signal Integrity Eye Diagram Analysis
═══════════════════════════════════════

Input Parameters:
  Data Rate:          ${dr} Gbps
  Rise Time:          ${rt} ps
  RMS Jitter:         ${jRms} ps
  RMS Noise:          ${nRms} mV
  Signal Amplitude:   ${amp} mV (peak-to-peak)
  Target BER:         ${ber}

Timing Analysis:
  Unit Interval (UI): ${unitInterval.toFixed(2)} ps
  Deterministic Jitter (DJ): ${deterministicJitter.toFixed(2)} ps
  Total Jitter (TJ @ BER):   ${totalJitter.toFixed(2)} ps
  Eye Width:          ${eyeWidth.toFixed(2)} ps (${eyeWidthRatio.toFixed(1)}% of UI)

Voltage Analysis:
  Q-Factor:           ${qFactor.toFixed(2)}
  Total Noise Margin: ${totalNoise.toFixed(2)} mV
  Eye Height:         ${eyeHeight.toFixed(2)} mV (${eyeHeightRatio.toFixed(1)}% of amplitude)

Channel Characteristics:
  3dB Bandwidth:      ${bandwidth3dB.toFixed(2)} GHz
  Nyquist Frequency:  ${(dr / 2).toFixed(2)} GHz

Assessment:
  Eye Width:  ${eyeWidth > 0 ? '✓ OPEN' : '✗ CLOSED'} ${eyeWidth > unitInterval * 0.3 ? '(Good margin)' : eyeWidth > 0 ? '(Marginal)' : '(Link fails)'}
  Eye Height: ${eyeHeight > 0 ? '✓ OPEN' : '✗ CLOSED'} ${eyeHeight > amp * 0.3 ? '(Good margin)' : eyeHeight > 0 ? '(Marginal)' : '(Link fails)'}`;

    setOutput(results);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Data Rate (Gbps)</label>
            <input id={`${toolId}-rate`} type="number" value={dataRate} onChange={(e) => setDataRate(e.target.value)} className="input-field" aria-label={`Data rate for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-rise`} className="block text-sm font-medium text-gray-700 mb-1">Rise Time (ps)</label>
            <input id={`${toolId}-rise`} type="number" value={riseTime} onChange={(e) => setRiseTime(e.target.value)} className="input-field" aria-label="Rise time" />
          </div>
          <div>
            <label htmlFor={`${toolId}-jitter`} className="block text-sm font-medium text-gray-700 mb-1">RMS Jitter (ps)</label>
            <input id={`${toolId}-jitter`} type="number" value={jitterRms} onChange={(e) => setJitterRms(e.target.value)} className="input-field" aria-label="RMS jitter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-noise`} className="block text-sm font-medium text-gray-700 mb-1">RMS Noise (mV)</label>
            <input id={`${toolId}-noise`} type="number" value={noiseRms} onChange={(e) => setNoiseRms(e.target.value)} className="input-field" aria-label="RMS noise" />
          </div>
          <div>
            <label htmlFor={`${toolId}-amp`} className="block text-sm font-medium text-gray-700 mb-1">Signal Amplitude (mV p-p)</label>
            <input id={`${toolId}-amp`} type="number" value={signalAmplitude} onChange={(e) => setSignalAmplitude(e.target.value)} className="input-field" aria-label="Signal amplitude" />
          </div>
          <div>
            <label htmlFor={`${toolId}-ber`} className="block text-sm font-medium text-gray-700 mb-1">Target BER</label>
            <select id={`${toolId}-ber`} value={ber} onChange={(e) => setBer(e.target.value)} className="input-field" aria-label="Target BER">
              <option value="1e-9">1e-9</option>
              <option value="1e-10">1e-10</option>
              <option value="1e-12">1e-12</option>
              <option value="1e-15">1e-15</option>
            </select>
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Eye Parameters</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Eye Diagram Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
