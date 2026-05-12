'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ClothingMeasurementConverter - Convert body measurements between cm and inches.
 */
export default function ClothingMeasurementConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [inseam, setInseam] = useState('');
  const [shoulder, setShoulder] = useState('');
  const [result, setResult] = useState<{ chest: string; waist: string; hips: string; inseam: string; shoulder: string; targetUnit: string } | null>(null);
  const [error, setError] = useState('');

  const cmToIn = (cm: number) => (cm / 2.54).toFixed(2);
  const inToCm = (inches: number) => (inches * 2.54).toFixed(2);

  const convert = () => {
    setError('');
    setResult(null);

    const values = { chest, waist, hips, inseam, shoulder };
    const hasAny = Object.values(values).some((v) => v.trim() !== '');

    if (!hasAny) {
      setError('Please enter at least one measurement');
      return;
    }

    const convertFn = unit === 'cm' ? cmToIn : inToCm;
    const targetUnit = unit === 'cm' ? 'inches' : 'cm';

    setResult({
      chest: chest.trim() ? `${convertFn(parseFloat(chest))} ${targetUnit}` : '—',
      waist: waist.trim() ? `${convertFn(parseFloat(waist))} ${targetUnit}` : '—',
      hips: hips.trim() ? `${convertFn(parseFloat(hips))} ${targetUnit}` : '—',
      inseam: inseam.trim() ? `${convertFn(parseFloat(inseam))} ${targetUnit}` : '—',
      shoulder: shoulder.trim() ? `${convertFn(parseFloat(shoulder))} ${targetUnit}` : '—',
      targetUnit,
    });
  };

  const copyText = result ? `Body Measurements (converted to ${result.targetUnit}):\nChest: ${result.chest}\nWaist: ${result.waist}\nHips: ${result.hips}\nInseam: ${result.inseam}\nShoulder: ${result.shoulder}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Input Unit</label>
            <select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as 'cm' | 'in')} aria-label={`Input unit for ${toolName}`} className="input-field w-48">
              <option value="cm">Centimeters (cm)</option>
              <option value="in">Inches (in)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-chest`} className="block text-sm font-medium text-gray-700 mb-1">Chest ({unit})</label>
              <input id={`${toolId}-chest`} type="number" step="0.1" value={chest} onChange={(e) => setChest(e.target.value)} placeholder="e.g. 96" aria-label="Chest measurement" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-waist`} className="block text-sm font-medium text-gray-700 mb-1">Waist ({unit})</label>
              <input id={`${toolId}-waist`} type="number" step="0.1" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="e.g. 80" aria-label="Waist measurement" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-hips`} className="block text-sm font-medium text-gray-700 mb-1">Hips ({unit})</label>
              <input id={`${toolId}-hips`} type="number" step="0.1" value={hips} onChange={(e) => setHips(e.target.value)} placeholder="e.g. 100" aria-label="Hips measurement" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-inseam`} className="block text-sm font-medium text-gray-700 mb-1">Inseam ({unit})</label>
              <input id={`${toolId}-inseam`} type="number" step="0.1" value={inseam} onChange={(e) => setInseam(e.target.value)} placeholder="e.g. 76" aria-label="Inseam measurement" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-shoulder`} className="block text-sm font-medium text-gray-700 mb-1">Shoulder ({unit})</label>
              <input id={`${toolId}-shoulder`} type="number" step="0.1" value={shoulder} onChange={(e) => setShoulder(e.target.value)} placeholder="e.g. 44" aria-label="Shoulder measurement" className="input-field" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert measurements">Convert Measurements</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Converted to {result.targetUnit}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Chest', value: result.chest },
                { label: 'Waist', value: result.waist },
                { label: 'Hips', value: result.hips },
                { label: 'Inseam', value: result.inseam },
                { label: 'Shoulder', value: result.shoulder },
              ].filter((m) => m.value !== '—').map((m, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-blue-600">{m.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
              1 inch = 2.54 cm. Measurements are approximate — always check specific brand size charts.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
