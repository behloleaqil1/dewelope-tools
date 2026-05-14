'use client';

import { useState, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NoiseTextureGenerator - Perlin/simplex noise texture generator using canvas.
 */
export default function NoiseTextureGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [scale, setScale] = useState('50');
  const [opacity, setOpacity] = useState('0.3');
  const [color, setColor] = useState('#000000');
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple value noise
  function noise2D(x: number, y: number): number {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  function smoothNoise(x: number, y: number): number {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const a = noise2D(ix, iy);
    const b = noise2D(ix + 1, iy);
    const c = noise2D(ix, iy + 1);
    const d = noise2D(ix + 1, iy + 1);
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }

  function generate() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 256, h = 256;
    canvas.width = w;
    canvas.height = h;
    const s = parseFloat(scale) || 50;
    const op = parseFloat(opacity) || 0.3;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const imageData = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const val = smoothNoise(x / s, y / s);
        const idx = (y * w + x) * 4;
        imageData.data[idx] = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = Math.round(val * op * 255);
      }
    }
    ctx.putImageData(imageData, 0, 0);
    setGenerated(true);
  }

  const cssSnippet = `background-image: url('data:image/svg+xml,...'); /* Use canvas export */\nopacity: ${opacity};`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label htmlFor={`${toolId}-scale`} className="block text-sm font-medium text-gray-700 mb-1">Scale</label>
            <input id={`${toolId}-scale`} type="number" min="5" max="200" value={scale} onChange={(e) => setScale(e.target.value)} aria-label={`Noise scale for ${toolName}`} className="input-field w-20" />
          </div>
          <div>
            <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
            <input id={`${toolId}-opacity`} type="number" min="0.05" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(e.target.value)} aria-label="Noise opacity" className="input-field w-20" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Noise color" className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate noise texture" className="btn-primary">Generate Texture</button>

      <OutputArea hasContent={generated}>
        <div className="space-y-3">
          <canvas ref={canvasRef} className="w-64 h-64 rounded-lg border border-gray-200 bg-white" />
          {generated && <CopyToClipboard text={cssSnippet} />}
        </div>
      </OutputArea>
    </div>
  );
}
