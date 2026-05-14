'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';

/**
 * ImageFormatConverter - Upload image, select output format, convert.
 */
export default function ImageFormatConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [format, setFormat] = useState('image/png');
  const [quality, setQuality] = useState('92');
  const [result, setResult] = useState<string | null>(null);
  const [fileName, setFileName] = useState('converted');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formats: Record<string, { mime: string; ext: string }> = {
    'image/png': { mime: 'image/png', ext: 'png' },
    'image/jpeg': { mime: 'image/jpeg', ext: 'jpg' },
    'image/webp': { mime: 'image/webp', ext: 'webp' },
    'image/bmp': { mime: 'image/bmp', ext: 'bmp' },
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const convert = () => {
    if (!imageSrc || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const q = parseInt(quality) / 100;
      setResult(canvas.toDataURL(format, q));
    };
    img.src = imageSrc;
  };

  const ext = formats[format]?.ext || 'png';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-file`} className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input id={`${toolId}-file`} type="file" accept="image/*" onChange={handleFile} aria-label={`Upload image for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      <div>
        <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
        <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value)} aria-label={`Output format for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
          <option value="image/bmp">BMP</option>
        </select>
      </div>
      {(format === 'image/jpeg' || format === 'image/webp') && (
        <div>
          <label htmlFor={`${toolId}-quality`} className="block text-sm font-medium text-gray-700 mb-1">Quality ({quality}%)</label>
          <input id={`${toolId}-quality`} type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(e.target.value)} aria-label={`Quality for ${toolName}`} className="w-full" />
        </div>
      )}
      <button onClick={convert} disabled={!imageSrc} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Convert image">Convert</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <img src={result} alt="Converted" className="max-w-full rounded-lg border" />
            <a href={result} download={`${fileName}.${ext}`} className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download .{ext}</a>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
