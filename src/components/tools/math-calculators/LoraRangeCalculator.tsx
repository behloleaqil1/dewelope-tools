'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LoraRangeCalculator - Calculate LoRa/LoRaWAN communication range based on
 * spreading factor, bandwidth, TX power, and environment.
 */
export default function LoraRangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [txPower, setTxPower] = useState('14');
  const [spreadingFactor, setSpreadingFactor] = useState('7');
  const [bandwidth, setBandwidth] = useState('125');
  const [frequency, setFrequency] = useState('868');
  const [environment, setEnvironment] = useState('suburban');
  const [antennaGain, setAntennaGain] = useState('2');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const txPowerNum = parseFloat(txPower);
    const sfNum = parseInt(spreadingFactor);
    const bwNum = parseFloat(bandwidth);
    const freqNum = parseFloat(frequency);
    const gainNum = parseFloat(antennaGain);

    if (isNaN(txPowerNum) || isNaN(sfNum) || isNaN(bwNum) || isNaN(freqNum) || isNaN(gainNum)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // LoRa receiver sensitivity calculation
    // Sensitivity = -174 + 10*log10(BW) + NF + SNR_required
    const noiseFigure = 6; // dB typical
    const snrRequired: Record<number, number> = {
      7: -7.5, 8: -10, 9: -12.5, 10: -15, 11: -17.5, 12: -20
    };
    const snr = snrRequired[sfNum] || -7.5;
    const sensitivity = -174 + 10 * Math.log10(bwNum * 1000) + noiseFigure + snr;

    // Link budget
    const linkBudget = txPowerNum + gainNum - sensitivity;

    // Environment path loss exponent
    const pathLossExponents: Record<string, number> = {
      'urban': 3.5,
      'suburban': 3.0,
      'rural': 2.5,
      'los': 2.0,
    };
    const n = pathLossExponents[environment] || 3.0;

    // Range calculation using log-distance path loss model
    // PL(d) = PL(d0) + 10*n*log10(d/d0)
    // PL(d0) at 1m = 20*log10(freq_MHz) + 32.44 - 20*log10(1000)
    const plRef = 20 * Math.log10(freqNum) + 32.44 - 20 * Math.log10(1000); // at 1km
    const rangeKm = Math.pow(10, (linkBudget - plRef) / (10 * n));
    const rangeM = rangeKm * 1000;

    // Data rate estimation
    const dataRate = sfNum * (bwNum / Math.pow(2, sfNum)) * 1000; // bits per second

    const results = [
      `=== LoRa Range Calculation ===`,
      ``,
      `Input Parameters:`,
      `  TX Power: ${txPowerNum} dBm`,
      `  Spreading Factor: SF${sfNum}`,
      `  Bandwidth: ${bwNum} kHz`,
      `  Frequency: ${freqNum} MHz`,
      `  Antenna Gain: ${gainNum} dBi`,
      `  Environment: ${environment}`,
      ``,
      `Radio Parameters:`,
      `  Receiver Sensitivity: ${sensitivity.toFixed(1)} dBm`,
      `  Link Budget: ${linkBudget.toFixed(1)} dB`,
      `  Path Loss Exponent: ${n}`,
      `  Estimated Data Rate: ${dataRate.toFixed(0)} bps`,
      ``,
      `Range Estimate:`,
      `  Distance: ${rangeKm >= 1 ? rangeKm.toFixed(2) + ' km' : rangeM.toFixed(0) + ' m'}`,
      `  (${(rangeKm * 0.621371).toFixed(2)} miles)`,
      ``,
      `Notes:`,
      `  - Higher SF = longer range but lower data rate`,
      `  - Actual range varies with terrain and interference`,
      `  - LoRaWAN typical: 2-5 km urban, 15+ km rural`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-txpower`} className="block text-sm font-medium text-gray-700 mb-1">
              TX Power (dBm)
            </label>
            <input
              id={`${toolId}-txpower`}
              type="number"
              value={txPower}
              onChange={(e) => setTxPower(e.target.value)}
              className="input-field"
              aria-label={`Transmit power for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-sf`} className="block text-sm font-medium text-gray-700 mb-1">
              Spreading Factor
            </label>
            <select
              id={`${toolId}-sf`}
              value={spreadingFactor}
              onChange={(e) => setSpreadingFactor(e.target.value)}
              className="input-field"
              aria-label="Spreading factor"
            >
              <option value="7">SF7 (fastest)</option>
              <option value="8">SF8</option>
              <option value="9">SF9</option>
              <option value="10">SF10</option>
              <option value="11">SF11</option>
              <option value="12">SF12 (longest range)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-bw`} className="block text-sm font-medium text-gray-700 mb-1">
              Bandwidth (kHz)
            </label>
            <select
              id={`${toolId}-bw`}
              value={bandwidth}
              onChange={(e) => setBandwidth(e.target.value)}
              className="input-field"
              aria-label="Bandwidth"
            >
              <option value="125">125 kHz</option>
              <option value="250">250 kHz</option>
              <option value="500">500 kHz</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
              Frequency (MHz)
            </label>
            <select
              id={`${toolId}-freq`}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="input-field"
              aria-label="Operating frequency"
            >
              <option value="433">433 MHz</option>
              <option value="868">868 MHz (EU)</option>
              <option value="915">915 MHz (US)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-env`} className="block text-sm font-medium text-gray-700 mb-1">
              Environment
            </label>
            <select
              id={`${toolId}-env`}
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="input-field"
              aria-label="Environment type"
            >
              <option value="los">Line of Sight</option>
              <option value="rural">Rural</option>
              <option value="suburban">Suburban</option>
              <option value="urban">Urban</option>
            </select>
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
              className="input-field"
              aria-label="Antenna gain"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate LoRa Range
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
