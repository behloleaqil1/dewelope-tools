'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssBounceTextGenerator - Generate CSS bouncing text animation code.
 */
export default function CssBounceTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Bounce!');
  const [color, setColor] = useState('#3b82f6');
  const [duration, setDuration] = useState('1');
  const [height, setHeight] = useState('20');
  const [fontSize, setFontSize] = useState('48');
  const [output, setOutput] = useState('');

  const generate = () => {
    const chars = Array.from(text);
    const delayStep = parseFloat(duration) / chars.length;

    const html = `<div class="bounce-container">
${chars.map((char, i) => `  <span class="bounce-char" style="animation-delay: ${(i * delayStep).toFixed(2)}s">${char === ' ' ? '&nbsp;' : char}</span>`).join('\n')}
</div>`;

    const css = `.bounce-container {
  display: inline-flex;
  font-size: ${fontSize}px;
  font-weight: bold;
  color: ${color};
}

.bounce-char {
  display: inline-block;
  animation: bounce ${duration}s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-${height}px);
  }
}`;

    setOutput(`<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Text input for ${toolName}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="input-field h-10" aria-label="Text color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
              <input id={`${toolId}-duration`} type="number" step="0.1" min="0.3" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" aria-label="Animation duration" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Bounce Height (px)</label>
              <input id={`${toolId}-height`} type="number" min="5" max="100" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" aria-label="Bounce height" />
            </div>
            <div>
              <label htmlFor={`${toolId}-fontsize`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-fontsize`} type="number" min="12" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
            </div>
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Bounce Text CSS</button>
        </div>
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
