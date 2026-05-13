'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssWaveTextGenerator - Generate CSS wavy text animation
 * with configurable text, colors, animation duration, and wave amplitude.
 */
export default function CssWaveTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Wave Text');
  const [color, setColor] = useState('#3b82f6');
  const [duration, setDuration] = useState('2');
  const [amplitude, setAmplitude] = useState('20');
  const [fontSize, setFontSize] = useState('48');
  const [output, setOutput] = useState('');

  const generate = () => {
    const chars = text.split('');
    const delayStep = parseFloat(duration) / chars.length;

    const htmlSpans = chars.map((char, i) => {
      const delay = (i * delayStep).toFixed(2);
      return `  <span style="animation-delay: ${delay}s">${char === ' ' ? '&nbsp;' : char}</span>`;
    }).join('\n');

    const css = `.wave-text {
  display: inline-flex;
  font-size: ${fontSize}px;
  font-weight: bold;
  color: ${color};
}

.wave-text span {
  display: inline-block;
  animation: wave ${duration}s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-${amplitude}px);
  }
}`;

    const html = `<div class="wave-text">
${htmlSpans}
</div>`;

    const result = `CSS Wavy Text Animation
════════════════════════════════════════

HTML:
${html}

CSS:
${css}`;

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Text input for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="input-field h-10" aria-label="Text color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
            <input id={`${toolId}-duration`} type="number" step="0.1" min="0.5" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" aria-label="Animation duration" />
          </div>
          <div>
            <label htmlFor={`${toolId}-amp`} className="block text-sm font-medium text-gray-700 mb-1">Wave Amplitude (px)</label>
            <input id={`${toolId}-amp`} type="number" min="5" max="100" value={amplitude} onChange={(e) => setAmplitude(e.target.value)} className="input-field" aria-label="Wave amplitude" />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-size`} type="number" min="12" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Wave Text CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
