'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ZigbeeRangeCalculator - Calculate Zigbee mesh network range based on
 * transmit power, environment, and number of hops.
 */
export default function ZigbeeRangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [txPower, setTxPower] = useState('4');
  const [environment, setEnvironment] = useState('indoor');
  const [frequency, setFrequency] = useState('2400');
  const [hops, setHops] = useState('3');
  const [obstacles, setObstacles] = useState('2');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const txPowerNum = parseFloat(txPower);
    const freqNum = parseFloat(frequency);
    const hopsNum = parseInt(hops);
    const obstaclesNum = parseInt(obstacles);

    if (isNaN(txPowerNum) || isNaN(freqNum) || isNaN(hopsNum) || isNaN(obstaclesNum)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    // Zigbee receiver sensitivity typically -100 dBm
    const rxSensitivity = -100;
    const linkBudget = txPowerNum - rxSensitivity;

    // Free-space path loss formula: FSPL = 20*log10(d) + 20*log10(f) + 32.44
    // Solving for d: d = 10^((FSPL - 20*log10(f) - 32.44) / 20)
    const envFactor = environment === 'outdoor' ? 1.0 : environment === 'indoor' ? 0.35 : 0.2;
    const obstacleAttenuation = obstaclesNum * 4; // ~4 dB per wall/obstacle
    const effectiveLinkBudget = linkBudget - obstacleAttenuation;

    const fspl = effectiveLinkBudget;
    const singleHopRange = Math.pow(10, (fspl - 20 * Math.log10(freqNum) - 32.44) / 20) * 1000 * envFactor;
    const totalRange = singleHopRange * hopsNum;

    const results = [
      `=== Zigbee Range Calculation ===`,
      ``,
      `Input Parameters:`,
      `  TX Power: ${txPowerNum} dBm`,
      `  Frequency: ${freqNum} MHz`,
      `  Environment: ${environment}`,
      `  Obstacles: ${obstaclesNum}`,
      `  Mesh Hops: ${hopsNum}`,
      ``,
      `Results:`,
      `  Link Budget: ${linkBudget.toFixed(1)} dB`,
      `  Obstacle Attenuation: ${obstacleAttenuation.toFixed(1)} dB`,
      `  Effective Link Budget: ${effectiveLinkBudget.toFixed(1)} dB`,
      `  Single Hop Range: ${singleHopRange.toFixed(1)} m`,
      `  Total Mesh Range (${hopsNum} hops): ${totalRange.toFixed(1)} m`,
      ``,
      `Notes:`,
      `  - Typical Zigbee indoor range: 10-30 m per hop`,
      `  - Typical Zigbee outdoor range: 75-100 m per hop`,
      `  - Mesh networking extends effective range`,
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
              <option value="868">868 MHz (EU)</option>
              <option value="915">915 MHz (US)</option>
              <option value="2400">2400 MHz (Global)</option>
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
              <option value="outdoor">Outdoor (Line of Sight)</option>
              <option value="indoor">Indoor (Office/Home)</option>
              <option value="industrial">Industrial (Dense)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-hops`} className="block text-sm font-medium text-gray-700 mb-1">
              Mesh Hops
            </label>
            <input
              id={`${toolId}-hops`}
              type="number"
              min="1"
              max="30"
              value={hops}
              onChange={(e) => setHops(e.target.value)}
              className="input-field"
              aria-label="Number of mesh hops"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-obstacles`} className="block text-sm font-medium text-gray-700 mb-1">
              Obstacles (walls)
            </label>
            <input
              id={`${toolId}-obstacles`}
              type="number"
              min="0"
              max="10"
              value={obstacles}
              onChange={(e) => setObstacles(e.target.value)}
              className="input-field"
              aria-label="Number of obstacles"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate Zigbee Range
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
