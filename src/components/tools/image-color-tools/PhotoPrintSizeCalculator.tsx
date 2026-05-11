'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PhotoPrintSizeCalculator - Calculates maximum print size at given DPI from image dimensions.
 */
export default function PhotoPrintSizeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const [dpi, setDpi] = useState('300');
  const [result, setResult] = useState<{ widthIn: number; heightIn: number; widthCm: number; heightCm: number; megapixels: number; quality: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const w = parseInt(imageWidth);
    const h = parseInt(imageHeight);
    const d = parseInt(dpi);

    if (!imageWidth.trim() || isNaN(w) || w <= 0) newErrors.width = 'Enter valid width in pixels';
    if (!imageHeight.trim() || isNaN(h) || h <= 0) newErrors.height = 'Enter valid height in pixels';
    if (!dpi.trim() || isNaN(d) || d <= 0) newErrors.dpi = 'Enter valid DPI';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const widthIn = w / d;
    const heightIn = h / d;
    const widthCm = widthIn * 2.54;
    const heightCm = heightIn * 2.54;
    const megapixels = (w * h) / 1000000;

    let quality = 'Excellent';
    if (d < 150) quality = 'Low (visible pixels)';
    else if (d < 200) quality = 'Acceptable (viewing distance)';
    else if (d < 300) quality = 'Good';

    setResult({
      widthIn: Math.round(widthIn * 100) / 100,
      heightIn: Math.round(heightIn * 100) / 100,
      widthCm: Math.round(widthCm * 100) / 100,
      heightCm: Math.round(heightCm * 100) / 100,
      megapixels: Math.round(megapixels * 10) / 10,
      quality,
    });
  };

  const commonDpi = [72, 150, 200, 300, 600];

  const copyText = result
    ? `Photo Print Size:\nImage: ${imageWidth} × ${imageHeight} px (${result.megapixels} MP)\nAt ${dpi} DPI:\n  ${result.widthIn}" × ${result.heightIn}" (inches)\n  ${result.widthCm} × ${result.heightCm} cm\nQuality: ${result.quality}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputArea error={errors.width}>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Image Width (px)</label>
            <input id={`${toolId}-width`} type="text" inputMode="numeric" value={imageWidth} onChange={(e) => setImageWidth(e.target.value)} placeholder="e.g. 4032" aria-label={`Image width for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea error={errors.height}>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Image Height (px)</label>
            <input id={`${toolId}-height`} type="text" inputMode="numeric" value={imageHeight} onChange={(e) => setImageHeight(e.target.value)} placeholder="e.g. 3024" aria-label={`Image height for ${toolName}`} className="input-field" />
          </InputArea>
        </div>

        <InputArea error={errors.dpi}>
          <label htmlFor={`${toolId}-dpi`} className="block text-sm font-medium text-gray-700 mb-1">Print DPI</label>
          <input id={`${toolId}-dpi`} type="text" inputMode="numeric" value={dpi} onChange={(e) => setDpi(e.target.value)} placeholder="300" aria-label={`DPI for ${toolName}`} className="input-field" />
          <div className="flex gap-2 mt-2">
            {commonDpi.map((d) => (
              <button key={d} onClick={() => setDpi(d.toString())} className={`px-2 py-1 text-xs rounded border ${dpi === d.toString() ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                {d}
              </button>
            ))}
          </div>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate print size" className="btn-primary">
        Calculate Print Size
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.widthIn}&quot; × {result.heightIn}&quot;</div>
                <div className="text-xs text-gray-500 mt-1">Inches</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.widthCm} × {result.heightCm}</div>
                <div className="text-xs text-gray-500 mt-1">Centimeters</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">{result.megapixels} MP</div>
                <div className="text-xs text-gray-500 mt-1">Megapixels</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Print Quality at {dpi} DPI: </span>
              <span className={`text-sm font-bold ${result.quality === 'Excellent' ? 'text-green-600' : result.quality === 'Good' ? 'text-blue-600' : result.quality.includes('Acceptable') ? 'text-yellow-600' : 'text-red-600'}`}>
                {result.quality}
              </span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
