'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EirpCalculator - Calculate Effective Isotropic Radiated Power.
 * EIRP = Pt + Gt - Lc (in dB scale)
 * Where Pt = transmitter power, Gt = antenna gain, Lc = cable/connector losses.
 */
export default function EirpCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [txPower, setTxPower] = useState('');
  const [txPowerUnit, setTxPowerUnit] = useState<'dBm' | 'dBW' | 'W' | 'mW'>('dBm');
  const [antennaGain, setAntennaGain] = useState('');
  const [cableLoss, setCableLoss] = useState('0');
  const [connectorLoss, setConnectorLoss] = useState('0');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const power = parseFloat(txPower);
    const gain = parseFloat(antennaGain);
    const cable = parseFloat(cableLoss) || 0;
    const connector = parseFloat(connectorLoss) || 0;

    if (isNaN(power) || isNaN(gain)) {
      setOutput('Error: Please enter valid transmitter power and antenna gain.');
      return;
    }

    // Convert power to dBm
    let powerDbm: number;
    switch (txPowerUnit) {
      case 'dBm':
        powerDbm = power;
        break;
      case 'dBW':
        powerDbm = power + 30;
        break;
      case 'W':
        if (power <= 0) { setOutput('Error: Power in Watts must be positive.'); return; }
        powerDbm = 10 * Math.log10(power * 1000);
        break;
      case 'mW':
        if (power <= 0) { setOutput('Error: Power in mW must be positive.'); return; }
        powerDbm = 10 * Math.log10(power);
        break;
    }

    const totalLoss = cable + connector;
    const eirpDbm = powerDbm + gain - totalLoss;
    const eirpDbW = eirpDbm - 30;
    const eirpW = Math.pow(10, eirpDbW / 10);
    const eirpMw = Math.pow(10, eirpDbm / 10);

    let result = `=== EIRP Calculation ===\n\n`;
    result += `Input Parameters:\n`;
    result += `  Transmitter Power: ${power} ${txPowerUnit} (${powerDbm.toFixed(2)} dBm)\n`;
    result += `  Antenna Gain: ${gain} dBi\n`;
    result += `  Cable Loss: ${cable} dB\n`;
    result += `  Connector Loss: ${connector} dB\n`;
    result += `  Total System Loss: ${totalLoss.toFixed(2)} dB\n\n`;
    result += `Results:\n`;
    result += `  EIRP: ${eirpDbm.toFixed(2)} dBm\n`;
    result += `  EIRP: ${eirpDbW.toFixed(2)} dBW\n`;
    if (eirpW >= 1) {
      result += `  EIRP: ${eirpW.toFixed(4)} W\n`;
    } else {
      result += `  EIRP: ${eirpMw.toFixed(4)} mW\n`;
    }
    if (eirpW >= 1000) {
      result += `  EIRP: ${(eirpW / 1000).toFixed(4)} kW\n`;
    }
    result += `\nFormula:\n`;
    result += `  EIRP (dBm) = Pt (dBm) + Gt (dBi) - Losses (dB)\n`;
    result += `  EIRP = ${powerDbm.toFixed(2)} + ${gain} - ${totalLoss.toFixed(2)}\n`;
    result += `  EIRP = ${eirpDbm.toFixed(2)} dBm\n`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">
              Transmitter Power
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-power`}
                type="number"
                value={txPower}
                onChange={(e) => setTxPower(e.target.value)}
                placeholder="20"
                aria-label={`Transmitter power for ${toolName}`}
                className="input-field flex-1"
              />
              <select
                value={txPowerUnit}
                onChange={(e) => setTxPowerUnit(e.target.value as 'dBm' | 'dBW' | 'W' | 'mW')}
                aria-label="Power unit"
                className="input-field w-24"
              >
                <option value="dBm">dBm</option>
                <option value="dBW">dBW</option>
                <option value="W">W</option>
                <option value="mW">mW</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-gain`} className="block text-sm font-medium text-gray-700 mb-1">
              Antenna Gain (dBi)
            </label>
            <input
              id={`${toolId}-gain`}
              type="number"
              value={antennaGain}
              onChange={(e) => setAntennaGain(e.target.value)}
              placeholder="6"
              aria-label="Antenna gain in dBi"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-cable`} className="block text-sm font-medium text-gray-700 mb-1">
              Cable Loss (dB)
            </label>
            <input
              id={`${toolId}-cable`}
              type="number"
              value={cableLoss}
              onChange={(e) => setCableLoss(e.target.value)}
              placeholder="2"
              aria-label="Cable loss in dB"
              className="input-field"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-connector`} className="block text-sm font-medium text-gray-700 mb-1">
              Connector Loss (dB)
            </label>
            <input
              id={`${toolId}-connector`}
              type="number"
              value={connectorLoss}
              onChange={(e) => setConnectorLoss(e.target.value)}
              placeholder="0.5"
              aria-label="Connector loss in dB"
              className="input-field"
              step="0.1"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate EIRP
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
