'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageResizeTool - Upload image, set dimensions, output resized image.
 */
export default function ImageResizeTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [width, setWidth] = useState('400');
  const [height, setHeight] = useState('300');
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ w: img.width, h: img.height });
        setWidth(String(img.width));
        setHeight(String(img.height));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (maintainRatio && originalSize.w > 0) {
      const ratio = originalSize.h / originalSize.w;
      setHeight(String(Math.round(parseInt(val) * ratio) || 0));
    }
  };

  const resize = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const w = parseInt(width) || 400;
      const h = parseInt(height) || 300;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
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
      {originalSize.w > 0 && <p className="text-xs text-gray-500">Original: {originalSize.w} × {originalSize.h}px</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-w`} className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
          <input id={`${toolId}-w`} type="number" value={width} onChange={(e) => handleWidthChange(e.target.value)} aria-label={`Width for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label htmlFor={`${toolId}-h`} className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
          <input id={`${toolId}-h`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} aria-label={`Height for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={maintainRatio} onChange={(e) => setMaintainRatio(e.target.checked)} aria-label={`Maintain aspect ratio for ${toolName}`} />
        Maintain aspect ratio
      </label>
      <button onClick={resize} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Resize image">Resize</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Resized" className="max-w-full rounded-lg border" />
            <a href={result} download="resized.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
