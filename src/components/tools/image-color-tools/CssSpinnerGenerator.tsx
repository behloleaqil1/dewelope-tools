'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CssSpinnerGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [size, setSize] = useState('40');
  const [borderWidth, setBorderWidth] = useState('4');
  const [color, setColor] = useState('#3498db');
  const [bgColor, setBgColor] = useState('#f3f3f3');
  const [speed, setSpeed] = useState('1');
  const [spinnerType, setSpinnerType] = useState('border');
  const [output, setOutput] = useState('');

  const generate = () => {
    const s = parseInt(size);
    const bw = parseInt(borderWidth);
    const spd = parseFloat(speed);

    let html = '';
    let css = '';

    if (spinnerType === 'border') {
      html = '<div class="spinner"></div>';
      css = `.spinner {
  width: ${s}px;
  height: ${s}px;
  border: ${bw}px solid ${bgColor};
  border-top: ${bw}px solid ${color};
  border-radius: 50%;
  animation: spin ${spd}s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
    } else if (spinnerType === 'dual-ring') {
      html = '<div class="spinner"></div>';
      css = `.spinner {
  width: ${s}px;
  height: ${s}px;
  border: ${bw}px solid transparent;
  border-top: ${bw}px solid ${color};
  border-bottom: ${bw}px solid ${color};
  border-radius: 50%;
  animation: spin ${spd}s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
    } else if (spinnerType === 'dot') {
      html = '<div class="spinner"></div>';
      css = `.spinner {
  width: ${s}px;
  height: ${s}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, ${color});
  mask: radial-gradient(farthest-side, transparent calc(100% - ${bw}px), #000 calc(100% - ${bw}px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - ${bw}px), #000 calc(100% - ${bw}px));
  animation: spin ${spd}s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
    } else if (spinnerType === 'pulse') {
      html = '<div class="spinner"></div>';
      css = `.spinner {
  width: ${s}px;
  height: ${s}px;
  border-radius: 50%;
  background-color: ${color};
  animation: pulse ${spd}s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1); opacity: 0; }
}`;
    }

    setOutput(`<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Spinner Type</label>
        <select value={spinnerType} onChange={(e) => setSpinnerType(e.target.value)} className="input-field mb-3" aria-label={`Spinner type for ${toolName}`}>
          <option value="border">Border Spinner</option>
          <option value="dual-ring">Dual Ring</option>
          <option value="dot">Conic Gradient</option>
          <option value="pulse">Pulse</option>
        </select>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
            <input type="number" value={size} onChange={(e) => setSize(e.target.value)} className="input-field" aria-label="Spinner size" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Border Width (px)</label>
            <input type="number" value={borderWidth} onChange={(e) => setBorderWidth(e.target.value)} className="input-field" aria-label="Border width" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="input-field h-10" aria-label="Spinner color" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field h-10" aria-label="Background color" />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Speed (seconds)</label>
          <input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} step="0.1" min="0.1" className="input-field" aria-label="Animation speed" />
        </div>

        <button onClick={generate} className="btn-primary">Generate Spinner</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
