'use client';

import { useState, useRef } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpriteSheetGenerator - Upload multiple images, combine into a sprite sheet.
 */
export default function SpriteSheetGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [columns, setColumns] = useState('4');
  const [cellSize, setCellSize] = useState('64');
  const [result, setResult] = useState<string | null>(null);
  const [css, setCss] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const promises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(setImages);
  };

  const generate = () => {
    if (images.length === 0 || !canvasRef.current) return;
    const cols = parseInt(columns) || 4;
    const size = parseInt(cellSize) || 64;
    const rows = Math.ceil(images.length / cols);
    const canvas = canvasRef.current;
    canvas.width = cols * size;
    canvas.height = rows * size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'transparent';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let loaded = 0;
    images.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        ctx.drawImage(img, col * size, row * size, size, size);
        loaded++;
        if (loaded === images.length) {
          setResult(canvas.toDataURL('image/png'));
          // Generate CSS
          const cssLines = images.map((_, idx) => {
            const c = idx % cols;
            const r = Math.floor(idx / cols);
            return `.sprite-${idx} { width: ${size}px; height: ${size}px; background-position: -${c * size}px -${r * size}px; }`;
          });
          setCss(`.sprite { display: inline-block; background-image: url('sprite.png'); background-repeat: no-repeat; }\n${cssLines.join('\n')}`);
        }
      };
      img.src = src;
    });
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-files`} className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
        <input id={`${toolId}-files`} type="file" accept="image/*" multiple onChange={handleFiles} aria-label={`Upload images for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        {images.length > 0 && <p className="text-xs text-gray-500 mt-1">{images.length} images loaded</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
          <input id={`${toolId}-cols`} type="number" value={columns} onChange={(e) => setColumns(e.target.value)} min="1" max="20" aria-label={`Columns for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Cell Size (px)</label>
          <input id={`${toolId}-size`} type="number" value={cellSize} onChange={(e) => setCellSize(e.target.value)} min="16" max="512" aria-label={`Cell size for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
        </div>
      </div>
      <button onClick={generate} disabled={images.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50" aria-label="Generate sprite sheet">Generate</button>
      <canvas ref={canvasRef} className="hidden" />
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-3">
            <img src={result} alt="Sprite sheet" className="max-w-full rounded-lg border bg-gray-100" />
            <a href={result} download="sprite.png" className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm">Download PNG</a>
            {css && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">CSS:</p>
                <pre className="text-xs font-mono bg-gray-50 p-2 rounded-lg overflow-x-auto">{css}</pre>
                <CopyToClipboard text={css} />
              </div>
            )}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
