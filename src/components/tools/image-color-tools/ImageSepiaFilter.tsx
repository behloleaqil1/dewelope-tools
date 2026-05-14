'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageSepiaFilter - Upload image, apply sepia tone filter.
 */
export default function ImageSepiaFilter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [intensity, setIntensity] = useState('100');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const applySepia = () => {
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
      const factor = parseInt(intensity) / 100;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const tr = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
        const tg = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
        const tb = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
        data[i] = r + (tr - r) * factor;
        data[i + 1] = g + (tg - g) * factor;
        data[i + 2] = b + (tb - b) * factor;
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
        <label htmlFor={`${toolId}-intensity`} className="block text-sm font-medium text-gray-700 mb-1">Intensity ({intensity}%)</label>
        <input id={`${toolId}-intensity`} type="range" min="0" max="100" value={intensity} onChange={(e) => setIntensity(e.target.value)} aria-label={`Sepia intensity for ${toolName}`} className="w-full" />
      </div>
      <button onClick={applySepia} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Apply sepia">Apply Sepia</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Sepia" className="max-w-full rounded-lg border" />
            <a href={result} download="sepia.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
