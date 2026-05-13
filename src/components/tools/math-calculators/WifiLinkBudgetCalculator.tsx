'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WifiLinkBudgetCalculator - Calculate WiFi link budget and estimated range.
 */
export default function WifiLinkBudgetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [txPower, setTxPower] = useState('20');
  const [txAntennaGain, setTxAntennaGain] = useState('2');
  const [rxAntennaGain, setRxAntennaGain] = useState('2');
  const [rxSensitivity, setRxSensitivity] = useState('-70');
  const [cableLoss, setCableLoss] = useState('1');
  const [frequency, setFrequency] = useState('2400');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const tx = parseFloat(txPower);
    const txGain = parseFloat(txAntennaGain);
    const rxGain = parseFloat(rxAntennaGain);
    const rxSens = parseFloat(rxSensitivity);
    const cable = parseFloat(cableLoss);
    const freq = parseFloat(frequency);

    if (isNaN(tx) || isNaN(txGain) || isNaN(rxGain) || isNaN(rxSens) || isNaN(cable) || isNaN(freq)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    const linkBudget = tx + txGain + rxGain - cable - rxSens;
    // Free Space Path Loss: FSPL = 20*log10(d) + 20*log10(f) + 32.44 (d in km, f in MHz)
    // Rearranged: d = 10^((FSPL - 20*log10(f) - 32.44) / 20)
    const maxFSPL = linkBudget;
    const distanceKm = Math.pow(10, (maxFSPL - 20 * Math.log10(freq) - 32.44) / 20);
    const distanceM = distanceKm * 1000;

    const result = `WiFi Link Budget Analysis
═══════════════════════════════════
Transmit Power:        ${tx} dBm
TX Antenna Gain:       ${txGain} dBi
RX Antenna Gain:       ${rxGain} dBi
Cable/Connector Loss:  ${cable} dB
Receiver Sensitivity:  ${rxSens} dBm
Frequency:             ${freq} MHz

Results
───────────────────────────────────
Total Link Budget:     ${linkBudget.toFixed(2)} dB
Max Allowable FSPL:    ${maxFSPL.toFixed(2)} dB
Estimated Range:       ${distanceM.toFixed(1)} m (${distanceKm.toFixed(3)} km)

Note: Free-space estimate. Real-world range is
typically 30-50% less due to obstacles and interference.`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-txpower`} className="block text-sm font-medium text-gray-700 mb-1">TX Power (dBm)</label>
              <input id={`${toolId}-txpower`} type="number" value={txPower} onChange={(e) => setTxPower(e.target.value)} className="input-field" aria-label={`Transmit power for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency (MHz)</label>
              <input id={`${toolId}-freq`} type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="input-field" aria-label="Operating frequency" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-txgain`} className="block text-sm font-medium text-gray-700 mb-1">TX Antenna Gain (dBi)</label>
              <input id={`${toolId}-txgain`} type="number" value={txAntennaGain} onChange={(e) => setTxAntennaGain(e.target.value)} className="input-field" aria-label="TX antenna gain" />
            </div>
            <div>
              <label htmlFor={`${toolId}-rxgain`} className="block text-sm font-medium text-gray-700 mb-1">RX Antenna Gain (dBi)</label>
              <input id={`${toolId}-rxgain`} type="number" value={rxAntennaGain} onChange={(e) => setRxAntennaGain(e.target.value)} className="input-field" aria-label="RX antenna gain" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-rxsens`} className="block text-sm font-medium text-gray-700 mb-1">RX Sensitivity (dBm)</label>
              <input id={`${toolId}-rxsens`} type="number" value={rxSensitivity} onChange={(e) => setRxSensitivity(e.target.value)} className="input-field" aria-label="Receiver sensitivity" />
            </div>
            <div>
              <label htmlFor={`${toolId}-cable`} className="block text-sm font-medium text-gray-700 mb-1">Cable Loss (dB)</label>
              <input id={`${toolId}-cable`} type="number" value={cableLoss} onChange={(e) => setCableLoss(e.target.value)} className="input-field" aria-label="Cable and connector loss" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Link Budget</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Link Budget Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
