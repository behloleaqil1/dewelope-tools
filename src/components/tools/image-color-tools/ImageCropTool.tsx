'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageCropTool - Upload image, select crop area, output cropped image.
 */
export default function ImageCropTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropX, setCropX] = useState('0');
  const [cropY, setCropY] = useState('0');
  const [cropW, setCropW] = useState('200');
  const [cropH, setCropH] = useState('200');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const cropImage = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const x = parseInt(cropX) || 0;
      const y = parseInt(cropY) || 0;
      const w = parseInt(cropW) || 200;
      const h = parseInt(cropH) || 200;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
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
      <div className="grid grid-cols-4 gap-2">
        <div>
          <label htmlFor={`${toolId}-x`} className="block text-xs text-gray-600">X</label>
          <input id={`${toolId}-x`} type="number" value={cropX} onChange={(e) => setCropX(e.target.value)} aria-label={`Crop X for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label htmlFor={`${toolId}-y`} className="block text-xs text-gray-600">Y</label>
          <input id={`${toolId}-y`} type="number" value={cropY} onChange={(e) => setCropY(e.target.value)} aria-label={`Crop Y for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label htmlFor={`${toolId}-w`} className="block text-xs text-gray-600">Width</label>
          <input id={`${toolId}-w`} type="number" value={cropW} onChange={(e) => setCropW(e.target.value)} aria-label={`Crop width for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label htmlFor={`${toolId}-h`} className="block text-xs text-gray-600">Height</label>
          <input id={`${toolId}-h`} type="number" value={cropH} onChange={(e) => setCropH(e.target.value)} aria-label={`Crop height for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>
      <button onClick={cropImage} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Crop image">Crop</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Cropped" className="max-w-full rounded-lg border" />
            <a href={result} download="cropped.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
