'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssPulseAnimationGenerator - Generate CSS pulse/heartbeat animations.
 * Supports various pulse styles with customizable size, color, speed, and timing.
 */
export default function CssPulseAnimationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pulseType, setPulseType] = useState('scale');
  const [color, setColor] = useState('#3b82f6');
  const [size, setSize] = useState('60');
  const [duration, setDuration] = useState('1.5');
  const [scaleAmount, setScaleAmount] = useState('1.3');
  const [borderRadius, setBorderRadius] = useState('50');
  const [output, setOutput] = useState('');
  const [cssCode, setCssCode] = useState('');

  const generate = () => {
    let keyframes = '';
    let animationProp = '';
    const sizeNum = parseInt(size);
    const dur = parseFloat(duration);

    switch (pulseType) {
      case 'scale':
        keyframes = `@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(${scaleAmount}); }
}`;
        animationProp = `animation: pulse-scale ${dur}s ease-in-out infinite;`;
        break;
      case 'heartbeat':
        keyframes = `@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}`;
        animationProp = `animation: heartbeat ${dur}s ease-in-out infinite;`;
        break;
      case 'ring':
        keyframes = `@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 ${color}80; }
  70% { box-shadow: 0 0 0 ${Math.round(sizeNum * 0.3)}px ${color}00; }
  100% { box-shadow: 0 0 0 0 ${color}00; }
}`;
        animationProp = `animation: pulse-ring ${dur}s cubic-bezier(0.4, 0, 0.6, 1) infinite;`;
        break;
      case 'glow':
        keyframes = `@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px ${color}40; }
  50% { box-shadow: 0 0 20px ${color}80, 0 0 40px ${color}40; }
}`;
        animationProp = `animation: pulse-glow ${dur}s ease-in-out infinite;`;
        break;
      case 'opacity':
        keyframes = `@keyframes pulse-opacity {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}`;
        animationProp = `animation: pulse-opacity ${dur}s ease-in-out infinite;`;
        break;
      case 'bounce':
        keyframes = `@keyframes pulse-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${Math.round(sizeNum * 0.2)}px); }
}`;
        animationProp = `animation: pulse-bounce ${dur}s ease-in-out infinite;`;
        break;
    }

    const css = `.pulse-element {
  width: ${sizeNum}px;
  height: ${sizeNum}px;
  background-color: ${color};
  border-radius: ${borderRadius}%;
  ${animationProp}
}

${keyframes}`;

    const html = `<div class="pulse-element"></div>`;

    setCssCode(css);
    setOutput(`<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Pulse Type</label>
              <select id={`${toolId}-type`} value={pulseType} onChange={(e) => setPulseType(e.target.value)} className="input-field" aria-label={`Pulse type for ${toolName}`}>
                <option value="scale">Scale Pulse</option>
                <option value="heartbeat">Heartbeat</option>
                <option value="ring">Ring / Ripple</option>
                <option value="glow">Glow</option>
                <option value="opacity">Opacity Fade</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex gap-2">
                <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-14 rounded cursor-pointer" aria-label="Pulse color" />
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="input-field flex-1 font-mono" aria-label="Color hex value" />
              </div>
            </div>
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
              <input id={`${toolId}-size`} type="number" value={size} onChange={(e) => setSize(e.target.value)} className="input-field" aria-label="Element size" />
            </div>
            <div>
              <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
              <input id={`${toolId}-duration`} type="number" step="0.1" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" aria-label="Animation duration" />
            </div>
            <div>
              <label htmlFor={`${toolId}-scale`} className="block text-sm font-medium text-gray-700 mb-1">Scale Amount</label>
              <input id={`${toolId}-scale`} type="number" step="0.1" value={scaleAmount} onChange={(e) => setScaleAmount(e.target.value)} className="input-field" aria-label="Scale amount" />
            </div>
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (%)</label>
              <input id={`${toolId}-radius`} type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" aria-label="Border radius" />
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate Animation</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
              <div
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: `${borderRadius}%`,
                }}
                className="animate-pulse"
              />
            </div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded overflow-x-auto">{output}</pre>
            <CopyToClipboard text={cssCode} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
