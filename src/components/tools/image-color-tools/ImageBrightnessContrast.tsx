'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageBrightnessContrast - Upload image, adjust brightness and contrast.
 */
export default function ImageBrightnessContrast({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [brightness, setBrightness] = useState('0');
  const [contrast, setContrast] = useState('0');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const adjust = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const b = parseInt(brightness);
      const c = parseInt(contrast);
      const factor = (259 * (c + 255)) / (255 * (259 - c));

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128 + b));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128 + b));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128 + b));
      }
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-file`} className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input id={`${toolId}-file`} type="file" accept="image/*" onChange={handleFile} aria-label={`Upload image for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label htmlFor={`${toolId}-bright`} className="block text-sm font-medium text-gray-700 mb-1">Brightness ({brightness})</label>
        <input id={`${toolId}-bright`} type="range" min="-100" max="100" value={brightness} onChange={(e) => setBrightness(e.target.value)} aria-label={`Brightness for ${toolName}`} className="w-full" />
      </div>
      <div>
        <label htmlFor={`${toolId}-contrast`} className="block text-sm font-medium text-gray-700 mb-1">Contrast ({contrast})</label>
        <input id={`${toolId}-contrast`} type="range" min="-100" max="100" value={contrast} onChange={(e) => setContrast(e.target.value)} aria-label={`Contrast for ${toolName}`} className="w-full" />
      </div>
      <button onClick={adjust} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Apply adjustments">Apply</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Adjusted" className="max-w-full rounded-lg border" />
            <a href={result} download="adjusted.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
