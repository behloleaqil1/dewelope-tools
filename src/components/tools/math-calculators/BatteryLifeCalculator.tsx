'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BatteryLifeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [capacity, setCapacity] = useState('');
  const [capacityUnit, setCapacityUnit] = useState<'mAh' | 'Ah'>('mAh');
  const [current, setCurrent] = useState('');
  const [currentUnit, setCurrentUnit] = useState<'mA' | 'A'>('mA');
  const [efficiency, setEfficiency] = useState('80');
  const [output, setOutput] = useState('');

  const calculate = () => {
    let cap = parseFloat(capacity);
    let cur = parseFloat(current);
    const eff = parseFloat(efficiency) / 100;

    if (isNaN(cap) || isNaN(cur) || isNaN(eff)) {
      setOutput('Please enter valid numbers.');
      return;
    }

    if (cur === 0) {
      setOutput('Current draw cannot be zero.');
      return;
    }

    // Normalize to mAh and mA
    if (capacityUnit === 'Ah') cap *= 1000;
    if (currentUnit === 'A') cur *= 1000;

    const hoursRaw = cap / cur;
    const hoursEffective = hoursRaw * eff;

    const days = Math.floor(hoursEffective / 24);
    const hours = Math.floor(hoursEffective % 24);
    const minutes = Math.round((hoursEffective % 1) * 60);

    const results = [
      `Battery Life Calculator`,
      `━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `Battery Capacity: ${capacity} ${capacityUnit} (${cap} mAh)`,
      `Current Draw: ${current} ${currentUnit} (${cur} mA)`,
      `Efficiency: ${efficiency}%`,
      ``,
      `Theoretical Life: ${hoursRaw.toFixed(2)} hours`,
      `Effective Life: ${hoursEffective.toFixed(2)} hours`,
      ``,
      `Duration: ${days > 0 ? days + ' days, ' : ''}${hours} hours, ${minutes} minutes`,
      ``,
      `Energy Stored: ${(cap * 3.7 / 1000).toFixed(2)} Wh (assuming 3.7V Li-ion)`,
      `Power Consumption: ${(cur * 3.7 / 1000).toFixed(4)} W`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-cap`} className="block text-sm font-medium text-gray-700 mb-1">Battery Capacity</label>
              <input id={`${toolId}-cap`} type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="input-field" placeholder="3000" aria-label={`Battery capacity for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-cap-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-cap-unit`} value={capacityUnit} onChange={(e) => setCapacityUnit(e.target.value as 'mAh' | 'Ah')} className="input-field" aria-label="Capacity unit">
                <option value="mAh">mAh</option>
                <option value="Ah">Ah</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-cur`} className="block text-sm font-medium text-gray-700 mb-1">Current Draw</label>
              <input id={`${toolId}-cur`} type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="input-field" placeholder="150" aria-label="Current draw" />
            </div>
            <div>
              <label htmlFor={`${toolId}-cur-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select id={`${toolId}-cur-unit`} value={currentUnit} onChange={(e) => setCurrentUnit(e.target.value as 'mA' | 'A')} className="input-field" aria-label="Current unit">
                <option value="mA">mA</option>
                <option value="A">A</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-eff`} className="block text-sm font-medium text-gray-700 mb-1">Efficiency (%)</label>
            <input id={`${toolId}-eff`} type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} min={1} max={100} className="input-field" placeholder="80" aria-label="Efficiency percentage" />
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Battery Life</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
