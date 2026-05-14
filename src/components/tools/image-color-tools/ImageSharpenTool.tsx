'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageSharpenTool - Upload image, apply sharpening filter.
 */
export default function ImageSharpenTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [amount, setAmount] = useState('50');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const sharpen = () => {
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
      const w = canvas.width;
      const strength = parseInt(amount) / 100;

      // Unsharp mask kernel
      const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
      const copy = new Uint8ClampedArray(data);

      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let sum = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = ((y + ky) * w + (x + kx)) * 4 + c;
                sum += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
              }
            }
            const idx = (y * w + x) * 4 + c;
            data[idx] = Math.min(255, Math.max(0, copy[idx] + (sum - copy[idx]) * strength));
          }
        }
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
        <label htmlFor={`${toolId}-amount`} className="block text-sm font-medium text-gray-700 mb-1">Sharpen Amount ({amount}%)</label>
        <input id={`${toolId}-amount`} type="range" min="10" max="100" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label={`Sharpen amount for ${toolName}`} className="w-full" />
      </div>
      <button onClick={sharpen} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Sharpen image">Sharpen</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Sharpened" className="max-w-full rounded-lg border" />
            <a href={result} download="sharpened.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
