'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageFlipTool - Upload image, flip horizontally or vertically.
 */
export default function ImageFlipTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const flip = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      if (direction === 'horizontal') {
        ctx.translate(img.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
      }
      ctx.drawImage(img, 0, 0);
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
        <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
        <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value as 'horizontal' | 'vertical')} aria-label={`Flip direction for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="horizontal">Horizontal (Mirror)</option>
          <option value="vertical">Vertical (Upside Down)</option>
        </select>
      </div>
      <button onClick={flip} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Flip image">Flip</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Flipped" className="max-w-full rounded-lg border" />
            <a href={result} download="flipped.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
