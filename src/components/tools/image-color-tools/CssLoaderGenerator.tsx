'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type LoaderType = 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';

export default function CssLoaderGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [loaderType, setLoaderType] = useState<LoaderType>('spinner');
  const [color, setColor] = useState('#3498db');
  const [size, setSize] = useState(40);
  const [output, setOutput] = useState('');

  const generate = () => {
    let css = '';
    let html = '';

    switch (loaderType) {
      case 'spinner':
        html = `<div class="loader-spinner"></div>`;
        css = `.loader-spinner {\n  width: ${size}px;\n  height: ${size}px;\n  border: ${Math.max(3, size / 10)}px solid #f3f3f3;\n  border-top: ${Math.max(3, size / 10)}px solid ${color};\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}`;
        break;
      case 'dots':
        html = `<div class="loader-dots">\n  <span></span>\n  <span></span>\n  <span></span>\n</div>`;
        css = `.loader-dots {\n  display: flex;\n  gap: ${size / 5}px;\n}\n\n.loader-dots span {\n  width: ${size / 3}px;\n  height: ${size / 3}px;\n  background: ${color};\n  border-radius: 50%;\n  animation: bounce 1.4s ease-in-out infinite both;\n}\n\n.loader-dots span:nth-child(1) { animation-delay: -0.32s; }\n.loader-dots span:nth-child(2) { animation-delay: -0.16s; }\n\n@keyframes bounce {\n  0%, 80%, 100% { transform: scale(0); }\n  40% { transform: scale(1); }\n}`;
        break;
      case 'pulse':
        html = `<div class="loader-pulse"></div>`;
        css = `.loader-pulse {\n  width: ${size}px;\n  height: ${size}px;\n  background: ${color};\n  border-radius: 50%;\n  animation: pulse 1.5s ease-in-out infinite;\n}\n\n@keyframes pulse {\n  0% { transform: scale(0); opacity: 1; }\n  100% { transform: scale(1.3); opacity: 0; }\n}`;
        break;
      case 'bars':
        html = `<div class="loader-bars">\n  <span></span>\n  <span></span>\n  <span></span>\n  <span></span>\n</div>`;
        css = `.loader-bars {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n  height: ${size}px;\n}\n\n.loader-bars span {\n  width: ${Math.max(4, size / 8)}px;\n  height: 100%;\n  background: ${color};\n  animation: bars 1.2s ease-in-out infinite;\n}\n\n.loader-bars span:nth-child(1) { animation-delay: 0s; }\n.loader-bars span:nth-child(2) { animation-delay: 0.1s; }\n.loader-bars span:nth-child(3) { animation-delay: 0.2s; }\n.loader-bars span:nth-child(4) { animation-delay: 0.3s; }\n\n@keyframes bars {\n  0%, 40%, 100% { transform: scaleY(0.4); }\n  20% { transform: scaleY(1); }\n}`;
        break;
      case 'ring':
        html = `<div class="loader-ring"></div>`;
        css = `.loader-ring {\n  width: ${size}px;\n  height: ${size}px;\n  border: ${Math.max(3, size / 10)}px solid transparent;\n  border-top-color: ${color};\n  border-bottom-color: ${color};\n  border-radius: 50%;\n  animation: ring-spin 1.2s linear infinite;\n}\n\n@keyframes ring-spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}`;
        break;
    }

    setOutput(`<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Loader Type</label>
            <select id={`${toolId}-type`} value={loaderType} onChange={(e) => setLoaderType(e.target.value as LoaderType)} className="input-field" aria-label={`Loader type for ${toolName}`}>
              <option value="spinner">Spinner</option>
              <option value="dots">Bouncing Dots</option>
              <option value="pulse">Pulse</option>
              <option value="bars">Bars</option>
              <option value="ring">Ring</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="input-field h-10" aria-label="Loader color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
            <input id={`${toolId}-size`} type="number" min={16} max={120} value={size} onChange={(e) => setSize(Number(e.target.value))} className="input-field" aria-label="Loader size" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-3">Generate Loader CSS</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
