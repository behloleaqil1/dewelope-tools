'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageRotateTool - Upload image, set rotation angle, output rotated image.
 */
export default function ImageRotateTool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [angle, setAngle] = useState('90');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const rotate = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const deg = parseFloat(angle) || 0;
      const rad = (deg * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      canvas.width = Math.floor(img.width * cos + img.height * sin);
      canvas.height = Math.floor(img.width * sin + img.height * cos);
      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
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
        <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Angle (degrees)</label>
        <input id={`${toolId}-angle`} type="number" value={angle} onChange={(e) => setAngle(e.target.value)} aria-label={`Rotation angle for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-2 mt-2">
          {[90, 180, 270, 45].map(a => (
            <button key={a} onClick={() => setAngle(String(a))} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">{a}°</button>
          ))}
        </div>
      </div>
      <button onClick={rotate} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Rotate image">Rotate</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Rotated" className="max-w-full rounded-lg border" />
            <a href={result} download="rotated.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
