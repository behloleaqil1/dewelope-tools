'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AirCompressorCfmCalculator - Calculate CFM requirements for air compressors.
 */
export default function AirCompressorCfmCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tools, setTools] = useState<{ name: string; cfm: string; dutyCycle: string }[]>([
    { name: 'Tool 1', cfm: '', dutyCycle: '50' },
  ]);
  const [safetyMargin, setSafetyMargin] = useState('25');
  const [altitude, setAltitude] = useState('0');
  const [results, setResults] = useState<{ totalCfm: string; adjustedCfm: string; withMargin: string; minTankSize: string; details: string[] } | null>(null);
  const [error, setError] = useState('');

  const addTool = () => {
    setTools([...tools, { name: `Tool ${tools.length + 1}`, cfm: '', dutyCycle: '50' }]);
  };

  const removeTool = (idx: number) => {
    if (tools.length > 1) setTools(tools.filter((_, i) => i !== idx));
  };

  const updateTool = (idx: number, field: string, value: string) => {
    const updated = [...tools];
    updated[idx] = { ...updated[idx], [field]: value };
    setTools(updated);
  };

  const calculate = () => {
    setError('');
    setResults(null);

    const margin = parseFloat(safetyMargin) / 100;
    const alt = parseFloat(altitude);

    if (isNaN(margin) || isNaN(alt)) {
      setError('Please enter valid values.');
      return;
    }

    let totalCfm = 0;
    const details: string[] = [];

    for (const tool of tools) {
      const cfm = parseFloat(tool.cfm);
      const duty = parseFloat(tool.dutyCycle) / 100;
      if (isNaN(cfm) || isNaN(duty) || cfm <= 0) {
        setError(`Invalid CFM or duty cycle for ${tool.name}`);
        return;
      }
      const effectiveCfm = cfm * duty;
      totalCfm += effectiveCfm;
      details.push(`${tool.name}: ${cfm} CFM × ${(duty * 100).toFixed(0)}% = ${effectiveCfm.toFixed(2)} CFM`);
    }

    // Altitude correction: ~3% loss per 1000ft
    const altCorrection = 1 + (alt / 1000) * 0.03;
    const adjustedCfm = totalCfm * altCorrection;
    const withMargin = adjustedCfm * (1 + margin);

    // Rule of thumb: tank gallons = CFM × 1.5 to 2
    const minTankSize = withMargin * 1.5;

    setResults({
      totalCfm: totalCfm.toFixed(2),
      adjustedCfm: adjustedCfm.toFixed(2),
      withMargin: withMargin.toFixed(2),
      minTankSize: minTankSize.toFixed(1),
      details,
    });
  };

  const resultText = results ? `Total CFM (duty-adjusted): ${results.totalCfm}\nAltitude-adjusted: ${results.adjustedCfm}\nWith safety margin: ${results.withMargin} CFM\nMin tank size: ${results.minTankSize} gallons\n\n${results.details.join('\n')}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Air Tools</label>
          {tools.map((tool, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <div className="flex-1">
                <input type="text" value={tool.name} onChange={(e) => updateTool(idx, 'name', e.target.value)} placeholder="Tool name" className="input-field text-sm" aria-label={`Tool ${idx + 1} name`} />
              </div>
              <div className="w-24">
                <input type="number" value={tool.cfm} onChange={(e) => updateTool(idx, 'cfm', e.target.value)} placeholder="CFM" className="input-field text-sm" aria-label={`Tool ${idx + 1} CFM`} />
              </div>
              <div className="w-24">
                <input type="number" value={tool.dutyCycle} onChange={(e) => updateTool(idx, 'dutyCycle', e.target.value)} placeholder="Duty %" className="input-field text-sm" aria-label={`Tool ${idx + 1} duty cycle`} />
              </div>
              <button onClick={() => removeTool(idx)} className="text-red-500 text-sm px-2 py-1 hover:bg-red-50 rounded" aria-label={`Remove tool ${idx + 1}`}>✕</button>
            </div>
          ))}
          <button onClick={addTool} className="text-sm text-blue-600 hover:text-blue-800">+ Add Tool</button>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-margin`} className="block text-sm font-medium text-gray-700 mb-1">Safety Margin (%)</label>
              <input id={`${toolId}-margin`} type="number" value={safetyMargin} onChange={(e) => setSafetyMargin(e.target.value)} className="input-field" aria-label={`Safety margin for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-alt`} className="block text-sm font-medium text-gray-700 mb-1">Altitude (ft)</label>
              <input id={`${toolId}-alt`} type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} className="input-field" aria-label="Altitude in feet" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate CFM</button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </InputArea>

      <OutputArea hasContent={!!results}>
        {results && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">CFM Requirements</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Base CFM</div>
                <div className="text-lg font-semibold text-blue-700">{results.totalCfm}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Required CFM</div>
                <div className="text-lg font-semibold text-green-700">{results.withMargin}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Altitude Adjusted</div>
                <div className="text-lg font-semibold text-yellow-700">{results.adjustedCfm}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500">Min Tank (gal)</div>
                <div className="text-lg font-semibold text-purple-700">{results.minTankSize}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs font-medium text-gray-600 mb-1">Breakdown</div>
              {results.details.map((d, i) => (
                <div key={i} className="text-sm font-mono text-gray-700">{d}</div>
              ))}
            </div>
            <CopyToClipboard text={resultText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
