'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * DuotoneImageGenerator - Upload image, pick 2 colors, output duotone effect.
 */
export default function DuotoneImageGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [color1, setColor1] = useState('#001f3f');
  const [color2, setColor2] = useState('#ff6600');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const applyDuotone = () => {
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
      const c1 = hexToRgb(color1);
      const c2 = hexToRgb(color2);

      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale first
        const gray = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        // Interpolate between the two colors
        data[i] = c1.r + (c2.r - c1.r) * gray;
        data[i + 1] = c1.g + (c2.g - c1.g) * gray;
        data[i + 2] = c1.b + (c2.b - c1.b) * gray;
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-c1`} className="block text-sm font-medium text-gray-700 mb-1">Shadow Color</label>
          <div className="flex gap-2 items-center">
            <input id={`${toolId}-c1`} type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label={`Shadow color for ${toolName}`} className="w-10 h-10 rounded border cursor-pointer" />
            <code className="text-sm font-mono">{color1}</code>
          </div>
        </div>
        <div>
          <label htmlFor={`${toolId}-c2`} className="block text-sm font-medium text-gray-700 mb-1">Highlight Color</label>
          <div className="flex gap-2 items-center">
            <input id={`${toolId}-c2`} type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label={`Highlight color for ${toolName}`} className="w-10 h-10 rounded border cursor-pointer" />
            <code className="text-sm font-mono">{color2}</code>
          </div>
        </div>
      </div>
      <button onClick={applyDuotone} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Apply duotone">Apply Duotone</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Duotone" className="max-w-full rounded-lg border" />
            <a href={result} download="duotone.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
