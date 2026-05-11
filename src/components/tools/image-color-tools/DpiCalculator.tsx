'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DpiCalculator - Calculates DPI/PPI from print size and pixel dimensions.
 * Also calculates required pixels for a target DPI and print size.
 */
export default function DpiCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'fromPixels' | 'fromDpi'>('fromPixels');
  const [widthPx, setWidthPx] = useState('');
  const [heightPx, setHeightPx] = useState('');
  const [widthIn, setWidthIn] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [targetDpi, setTargetDpi] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ dpiW: number; dpiH: number; avgDpi: number; totalPixels: number } | null>(null);
  const [result2, setResult2] = useState<{ neededW: number; neededH: number; totalPixels: number } | null>(null);

  const calculateFromPixels = () => {
    const newErrors: Record<string, string> = {};
    const wPx = parseFloat(widthPx);
    const hPx = parseFloat(heightPx);
    const wIn = parseFloat(widthIn);
    const hIn = parseFloat(heightIn);

    if (!widthPx.trim() || isNaN(wPx) || wPx <= 0) newErrors.widthPx = 'Enter valid width in pixels';
    if (!heightPx.trim() || isNaN(hPx) || hPx <= 0) newErrors.heightPx = 'Enter valid height in pixels';
    if (!widthIn.trim() || isNaN(wIn) || wIn <= 0) newErrors.widthIn = 'Enter valid width in inches';
    if (!heightIn.trim() || isNaN(hIn) || hIn <= 0) newErrors.heightIn = 'Enter valid height in inches';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const dpiW = wPx / wIn;
    const dpiH = hPx / hIn;
    setResult({ dpiW, dpiH, avgDpi: (dpiW + dpiH) / 2, totalPixels: wPx * hPx });
  };

  const calculateFromDpi = () => {
    const newErrors: Record<string, string> = {};
    const wIn = parseFloat(widthIn);
    const hIn = parseFloat(heightIn);
    const dpi = parseFloat(targetDpi);

    if (!widthIn.trim() || isNaN(wIn) || wIn <= 0) newErrors.widthIn = 'Enter valid width in inches';
    if (!heightIn.trim() || isNaN(hIn) || hIn <= 0) newErrors.heightIn = 'Enter valid height in inches';
    if (!targetDpi.trim() || isNaN(dpi) || dpi <= 0) newErrors.targetDpi = 'Enter valid DPI';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult2(null);
      return;
    }

    setErrors({});
    const neededW = Math.ceil(wIn * dpi);
    const neededH = Math.ceil(hIn * dpi);
    setResult2({ neededW, neededH, totalPixels: neededW * neededH });
  };

  const copyText = mode === 'fromPixels' && result
    ? `DPI (horizontal): ${result.dpiW.toFixed(1)}\nDPI (vertical): ${result.dpiH.toFixed(1)}\nAverage DPI: ${result.avgDpi.toFixed(1)}\nTotal Pixels: ${result.totalPixels.toLocaleString()}`
    : mode === 'fromDpi' && result2
    ? `Required Width: ${result2.neededW} px\nRequired Height: ${result2.neededH} px\nTotal Pixels: ${result2.totalPixels.toLocaleString()}\nTarget DPI: ${targetDpi}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={`${toolId}-mode`} value="fromPixels" checked={mode === 'fromPixels'} onChange={() => { setMode('fromPixels'); setResult(null); setResult2(null); }} />
            <span className="text-sm">Calculate DPI from pixels</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={`${toolId}-mode`} value="fromDpi" checked={mode === 'fromDpi'} onChange={() => { setMode('fromDpi'); setResult(null); setResult2(null); }} />
            <span className="text-sm">Calculate pixels from DPI</span>
          </label>
        </div>
      </div>

      {mode === 'fromPixels' && (
        <div className="grid grid-cols-2 gap-4">
          <InputArea error={errors.widthPx}>
            <label htmlFor={`${toolId}-wpx`} className="block text-sm font-medium text-gray-700 mb-1">Width (pixels)</label>
            <input id={`${toolId}-wpx`} type="text" inputMode="numeric" value={widthPx} onChange={(e) => { setWidthPx(e.target.value); if (errors.widthPx) setErrors((p) => ({ ...p, widthPx: '' })); }} placeholder="e.g. 3000" aria-label={`Width pixels for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea error={errors.heightPx}>
            <label htmlFor={`${toolId}-hpx`} className="block text-sm font-medium text-gray-700 mb-1">Height (pixels)</label>
            <input id={`${toolId}-hpx`} type="text" inputMode="numeric" value={heightPx} onChange={(e) => { setHeightPx(e.target.value); if (errors.heightPx) setErrors((p) => ({ ...p, heightPx: '' })); }} placeholder="e.g. 2000" aria-label={`Height pixels for ${toolName}`} className="input-field" />
          </InputArea>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.widthIn}>
          <label htmlFor={`${toolId}-win`} className="block text-sm font-medium text-gray-700 mb-1">Print Width (inches)</label>
          <input id={`${toolId}-win`} type="text" inputMode="decimal" value={widthIn} onChange={(e) => { setWidthIn(e.target.value); if (errors.widthIn) setErrors((p) => ({ ...p, widthIn: '' })); }} placeholder="e.g. 10" aria-label={`Print width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.heightIn}>
          <label htmlFor={`${toolId}-hin`} className="block text-sm font-medium text-gray-700 mb-1">Print Height (inches)</label>
          <input id={`${toolId}-hin`} type="text" inputMode="decimal" value={heightIn} onChange={(e) => { setHeightIn(e.target.value); if (errors.heightIn) setErrors((p) => ({ ...p, heightIn: '' })); }} placeholder="e.g. 8" aria-label={`Print height for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      {mode === 'fromDpi' && (
        <InputArea error={errors.targetDpi}>
          <label htmlFor={`${toolId}-dpi`} className="block text-sm font-medium text-gray-700 mb-1">Target DPI</label>
          <input id={`${toolId}-dpi`} type="text" inputMode="numeric" value={targetDpi} onChange={(e) => { setTargetDpi(e.target.value); if (errors.targetDpi) setErrors((p) => ({ ...p, targetDpi: '' })); }} placeholder="e.g. 300" aria-label={`Target DPI for ${toolName}`} className="input-field" />
        </InputArea>
      )}

      <button onClick={mode === 'fromPixels' ? calculateFromPixels : calculateFromDpi} aria-label="Calculate DPI" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={mode === 'fromPixels' ? result !== null : result2 !== null}>
        {mode === 'fromPixels' && result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.dpiW.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">Horizontal DPI</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.dpiH.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">Vertical DPI</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Average DPI: <strong>{result.avgDpi.toFixed(1)}</strong></p>
              <p>Total Pixels: <strong>{result.totalPixels.toLocaleString()}</strong> ({(result.totalPixels / 1000000).toFixed(1)} MP)</p>
              <p className="text-xs mt-1 text-gray-500">300 DPI = print quality | 150 DPI = acceptable | 72 DPI = screen only</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
        {mode === 'fromDpi' && result2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result2.neededW.toLocaleString()} px</div>
                <div className="text-xs text-gray-500 mt-1">Required Width</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result2.neededH.toLocaleString()} px</div>
                <div className="text-xs text-gray-500 mt-1">Required Height</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Total Pixels: <strong>{result2.totalPixels.toLocaleString()}</strong> ({(result2.totalPixels / 1000000).toFixed(1)} MP)</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
