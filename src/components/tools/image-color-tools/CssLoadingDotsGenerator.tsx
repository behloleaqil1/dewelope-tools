'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssLoadingDotsGenerator - Generate CSS animated loading dots with customizable options.
 */
export default function CssLoadingDotsGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dotCount, setDotCount] = useState('3');
  const [dotSize, setDotSize] = useState('12');
  const [color, setColor] = useState('#3498db');
  const [animationType, setAnimationType] = useState<'bounce' | 'fade' | 'scale' | 'pulse'>('bounce');
  const [speed, setSpeed] = useState('1.4');
  const [gap, setGap] = useState('8');
  const [output, setOutput] = useState('');

  const generate = () => {
    const count = parseInt(dotCount) || 3;
    const size = parseInt(dotSize) || 12;
    const gapVal = parseInt(gap) || 8;
    const speedVal = parseFloat(speed) || 1.4;

    let keyframes = '';
    let dotStyles = '';

    switch (animationType) {
      case 'bounce':
        keyframes = `@keyframes loading-bounce {\n  0%, 80%, 100% { transform: translateY(0); }\n  40% { transform: translateY(-${size}px); }\n}`;
        dotStyles = `  animation: loading-bounce ${speedVal}s infinite ease-in-out both;`;
        break;
      case 'fade':
        keyframes = `@keyframes loading-fade {\n  0%, 80%, 100% { opacity: 0.3; }\n  40% { opacity: 1; }\n}`;
        dotStyles = `  animation: loading-fade ${speedVal}s infinite ease-in-out both;`;
        break;
      case 'scale':
        keyframes = `@keyframes loading-scale {\n  0%, 80%, 100% { transform: scale(0.6); }\n  40% { transform: scale(1); }\n}`;
        dotStyles = `  animation: loading-scale ${speedVal}s infinite ease-in-out both;`;
        break;
      case 'pulse':
        keyframes = `@keyframes loading-pulse {\n  0%, 100% { transform: scale(1); opacity: 1; }\n  50% { transform: scale(0.5); opacity: 0.5; }\n}`;
        dotStyles = `  animation: loading-pulse ${speedVal}s infinite ease-in-out both;`;
        break;
    }

    const delayIncrement = speedVal / (count + 1);
    const nthChildRules = Array.from({ length: count }, (_, i) =>
      `.loading-dots span:nth-child(${i + 1}) {\n  animation-delay: ${(i * delayIncrement).toFixed(2)}s;\n}`
    ).join('\n\n');

    const css = `/* Loading Dots Animation */
.loading-dots {
  display: inline-flex;
  align-items: center;
  gap: ${gapVal}px;
}

.loading-dots span {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background-color: ${color};
${dotStyles}
}

${nthChildRules}

${keyframes}`;

    const html = `<div class="loading-dots">\n${Array.from({ length: count }, () => '  <span></span>').join('\n')}\n</div>`;

    setOutput(`<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Dots</label>
              <input id={`${toolId}-count`} type="number" min="2" max="8" value={dotCount} onChange={(e) => setDotCount(e.target.value)} className="input-field" aria-label={`Dot count for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Dot Size (px)</label>
              <input id={`${toolId}-size`} type="number" min="4" max="40" value={dotSize} onChange={(e) => setDotSize(e.target.value)} className="input-field" aria-label="Dot size" />
            </div>
            <div>
              <label htmlFor={`${toolId}-gap`} className="block text-sm font-medium text-gray-700 mb-1">Gap (px)</label>
              <input id={`${toolId}-gap`} type="number" min="2" max="30" value={gap} onChange={(e) => setGap(e.target.value)} className="input-field" aria-label="Gap between dots" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex gap-2">
                <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer" aria-label="Dot color" />
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="input-field flex-1" aria-label="Color hex value" />
              </div>
            </div>
            <div>
              <label htmlFor={`${toolId}-animation`} className="block text-sm font-medium text-gray-700 mb-1">Animation</label>
              <select id={`${toolId}-animation`} value={animationType} onChange={(e) => setAnimationType(e.target.value as 'bounce' | 'fade' | 'scale' | 'pulse')} className="input-field" aria-label="Animation type">
                <option value="bounce">Bounce</option>
                <option value="fade">Fade</option>
                <option value="scale">Scale</option>
                <option value="pulse">Pulse</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-speed`} className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
              <input id={`${toolId}-speed`} type="number" min="0.5" max="5" step="0.1" value={speed} onChange={(e) => setSpeed(e.target.value)} className="input-field" aria-label="Animation duration" />
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate Loading Dots</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
