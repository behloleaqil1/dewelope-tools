'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NfcRangeCalculator - Calculate NFC communication range based on antenna size,
 * power output, frequency, and environment factors.
 */
export default function NfcRangeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [antennaSize, setAntennaSize] = useState('50');
  const [readerPower, setReaderPower] = useState('200');
  const [tagType, setTagType] = useState('type2');
  const [environment, setEnvironment] = useState('free-space');
  const [output, setOutput] = useState('');

  const tagTypes = [
    { value: 'type1', label: 'NFC Type 1 (Topaz)', sensitivity: -14 },
    { value: 'type2', label: 'NFC Type 2 (NTAG)', sensitivity: -12 },
    { value: 'type3', label: 'NFC Type 3 (FeliCa)', sensitivity: -10 },
    { value: 'type4', label: 'NFC Type 4 (DESFire)', sensitivity: -11 },
    { value: 'type5', label: 'NFC Type 5 (ICODE)', sensitivity: -8 },
  ];

  const environments = [
    { value: 'free-space', label: 'Free Space (ideal)', factor: 1.0 },
    { value: 'office', label: 'Office Environment', factor: 0.7 },
    { value: 'industrial', label: 'Industrial', factor: 0.5 },
    { value: 'metal-nearby', label: 'Metal Nearby', factor: 0.3 },
  ];

  const calculate = () => {
    const antennaMm = parseFloat(antennaSize);
    const powerMw = parseFloat(readerPower);

    if (isNaN(antennaMm) || isNaN(powerMw) || antennaMm <= 0 || powerMw <= 0) {
      setOutput('Please enter valid positive values.');
      return;
    }

    const tag = tagTypes.find(t => t.value === tagType);
    const env = environments.find(e => e.value === environment);
    if (!tag || !env) return;

    // NFC operates at 13.56 MHz, range is primarily limited by magnetic coupling
    const frequency = 13.56e6;
    const wavelength = (3e8 / frequency) * 1000; // mm
    const antennaRadius = antennaMm / 2;

    // Simplified magnetic coupling range estimation
    // Effective range ≈ antenna_radius * (power_factor) * environment_factor
    const powerFactor = Math.sqrt(powerMw / 100);
    const sensitivityFactor = 1 + (tag.sensitivity + 14) * 0.05;
    const baseRange = antennaRadius * 0.8 * powerFactor * sensitivityFactor * env.factor;
    const maxRange = Math.min(baseRange, 100); // NFC max is ~10cm by spec

    const results = [
      `=== NFC Range Calculation ===`,
      ``,
      `Input Parameters:`,
      `  Antenna Size: ${antennaMm} mm`,
      `  Reader Power: ${powerMw} mW`,
      `  Tag Type: ${tag.label}`,
      `  Environment: ${env.label}`,
      ``,
      `NFC Parameters:`,
      `  Frequency: 13.56 MHz`,
      `  Wavelength: ${wavelength.toFixed(1)} mm`,
      `  Antenna Radius: ${antennaRadius.toFixed(1)} mm`,
      ``,
      `Results:`,
      `  Estimated Max Range: ${maxRange.toFixed(1)} mm (${(maxRange / 10).toFixed(2)} cm)`,
      `  Power Factor: ${powerFactor.toFixed(3)}`,
      `  Sensitivity Factor: ${sensitivityFactor.toFixed(3)}`,
      `  Environment Factor: ${env.factor}`,
      ``,
      `Notes:`,
      `  - NFC standard max range is ~10 cm`,
      `  - Actual range depends on tag orientation and alignment`,
      `  - Metal objects significantly reduce range`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-antenna`} className="block text-sm font-medium text-gray-700 mb-1">Antenna Size (mm)</label>
            <input id={`${toolId}-antenna`} type="number" min="10" max="200" value={antennaSize} onChange={(e) => setAntennaSize(e.target.value)} aria-label={`Antenna size for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-power`} className="block text-sm font-medium text-gray-700 mb-1">Reader Power (mW)</label>
            <input id={`${toolId}-power`} type="number" min="10" max="1000" value={readerPower} onChange={(e) => setReaderPower(e.target.value)} aria-label="Reader power output" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tag`} className="block text-sm font-medium text-gray-700 mb-1">Tag Type</label>
            <select id={`${toolId}-tag`} value={tagType} onChange={(e) => setTagType(e.target.value)} aria-label="NFC tag type" className="input-field">
              {tagTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-env`} className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
            <select id={`${toolId}-env`} value={environment} onChange={(e) => setEnvironment(e.target.value)} aria-label="Operating environment" className="input-field">
              {environments.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate NFC Range</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">NFC Range Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
