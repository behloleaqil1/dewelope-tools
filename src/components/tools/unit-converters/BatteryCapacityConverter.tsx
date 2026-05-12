'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BatteryCapacityConverter - Convert between mAh, Wh, and Ah for batteries.
 * Uses the formula: Wh = Ah × V, mAh = Ah × 1000.
 */
export default function BatteryCapacityConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('mah');
  const [voltage, setVoltage] = useState('3.7');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleConvert() {
    setError('');
    setOutput('');

    const val = parseFloat(value);
    const volt = parseFloat(voltage);

    if (isNaN(val) || val <= 0) { setError('Please enter a valid positive value.'); return; }
    if (isNaN(volt) || volt <= 0) { setError('Please enter a valid positive voltage.'); return; }

    let mah: number;
    let ah: number;
    let wh: number;

    switch (fromUnit) {
      case 'mah':
        mah = val;
        ah = val / 1000;
        wh = ah * volt;
        break;
      case 'ah':
        ah = val;
        mah = val * 1000;
        wh = val * volt;
        break;
      case 'wh':
        wh = val;
        ah = val / volt;
        mah = ah * 1000;
        break;
      default:
        mah = val;
        ah = val / 1000;
        wh = ah * volt;
    }

    const results = [
      `Input: ${val} ${fromUnit.toUpperCase()} at ${volt}V`,
      ``,
      `--- Conversions ---`,
      `Milliamp-hours (mAh): ${mah!.toFixed(2)}`,
      `Amp-hours (Ah): ${ah!.toFixed(4)}`,
      `Watt-hours (Wh): ${wh!.toFixed(4)}`,
      ``,
      `--- Additional Info ---`,
      `Energy in Joules: ${(wh! * 3600).toFixed(2)} J`,
      `Approximate charge cycles (80% DoD): varies by chemistry`,
    ];

    setOutput(results.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Capacity Value</label>
            <input id={`${toolId}-value`} type="number" min={0} step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 5000" className="input-field" aria-label={`Capacity value for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
              <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field" aria-label="Source unit">
                <option value="mah">mAh (milliamp-hours)</option>
                <option value="ah">Ah (amp-hours)</option>
                <option value="wh">Wh (watt-hours)</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-voltage`} className="block text-sm font-medium text-gray-700 mb-1">Voltage (V)</label>
              <input id={`${toolId}-voltage`} type="number" min={0} step="0.1" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="3.7" className="input-field" aria-label="Battery voltage" />
            </div>
          </div>
        </div>
        <button onClick={handleConvert} className="btn-primary mt-3">
          Convert
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
