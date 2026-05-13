'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BluetoothRangeCalculator - Calculate Bluetooth effective range based on power class and environment.
 */
export default function BluetoothRangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [powerClass, setPowerClass] = useState('2');
  const [btVersion, setBtVersion] = useState('5.0');
  const [environment, setEnvironment] = useState('indoor');
  const [obstacles, setObstacles] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const classSpecs: Record<string, { power: number; maxRange: number }> = {
      '1': { power: 20, maxRange: 100 },
      '1.5': { power: 10, maxRange: 30 },
      '2': { power: 4, maxRange: 10 },
      '3': { power: 0, maxRange: 1 },
    };

    const versionMultiplier: Record<string, number> = {
      '4.0': 1.0,
      '4.2': 1.1,
      '5.0': 4.0,
      '5.1': 4.0,
      '5.2': 4.0,
      '5.3': 4.0,
    };

    const envFactor: Record<string, number> = {
      'outdoor': 1.0,
      'indoor': 0.5,
      'urban': 0.3,
      'industrial': 0.2,
    };

    const spec = classSpecs[powerClass] || classSpecs['2'];
    const verMult = versionMultiplier[btVersion] || 1.0;
    const envMult = envFactor[environment] || 0.5;
    const obstacleCount = parseInt(obstacles) || 0;
    const obstacleLoss = Math.pow(0.7, obstacleCount);

    const theoreticalRange = spec.maxRange * verMult;
    const effectiveRange = theoreticalRange * envMult * obstacleLoss;

    const result = `Bluetooth Range Estimation
═══════════════════════════════════
Power Class:           Class ${powerClass} (${spec.power} dBm)
Bluetooth Version:     ${btVersion}
Environment:           ${environment}
Obstacles:             ${obstacleCount} wall(s)/barrier(s)

Results
───────────────────────────────────
Theoretical Max Range: ${theoreticalRange.toFixed(1)} m
Environment Factor:    ${(envMult * 100).toFixed(0)}%
Obstacle Attenuation:  ${(obstacleLoss * 100).toFixed(1)}%
Effective Range:       ${effectiveRange.toFixed(1)} m

Classification:
${effectiveRange > 50 ? '✓ Long Range - suitable for outdoor/warehouse' : effectiveRange > 10 ? '✓ Medium Range - suitable for home/office' : '✓ Short Range - suitable for personal area network'}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-class`} className="block text-sm font-medium text-gray-700 mb-1">Power Class</label>
              <select id={`${toolId}-class`} value={powerClass} onChange={(e) => setPowerClass(e.target.value)} className="input-field" aria-label={`Power class for ${toolName}`}>
                <option value="1">Class 1 (100m, 20 dBm)</option>
                <option value="1.5">Class 1.5 (30m, 10 dBm)</option>
                <option value="2">Class 2 (10m, 4 dBm)</option>
                <option value="3">Class 3 (1m, 0 dBm)</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-version`} className="block text-sm font-medium text-gray-700 mb-1">Bluetooth Version</label>
              <select id={`${toolId}-version`} value={btVersion} onChange={(e) => setBtVersion(e.target.value)} className="input-field" aria-label="Bluetooth version">
                <option value="4.0">4.0</option>
                <option value="4.2">4.2</option>
                <option value="5.0">5.0</option>
                <option value="5.1">5.1</option>
                <option value="5.2">5.2</option>
                <option value="5.3">5.3</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-env`} className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
              <select id={`${toolId}-env`} value={environment} onChange={(e) => setEnvironment(e.target.value)} className="input-field" aria-label="Operating environment">
                <option value="outdoor">Outdoor (open)</option>
                <option value="indoor">Indoor (office/home)</option>
                <option value="urban">Urban (dense)</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-obstacles`} className="block text-sm font-medium text-gray-700 mb-1">Walls/Obstacles</label>
              <input id={`${toolId}-obstacles`} type="number" min="0" max="10" value={obstacles} onChange={(e) => setObstacles(e.target.value)} className="input-field" aria-label="Number of obstacles" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Bluetooth Range</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Range Estimation</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
