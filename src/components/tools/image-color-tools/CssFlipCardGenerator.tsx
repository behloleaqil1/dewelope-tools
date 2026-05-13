'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssFlipCardGenerator - Generate CSS 3D flip card animation.
 * Creates ready-to-use HTML and CSS for a 3D card flip effect.
 */
export default function CssFlipCardGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('300');
  const [height, setHeight] = useState('200');
  const [duration, setDuration] = useState('0.6');
  const [trigger, setTrigger] = useState('hover');
  const [direction, setDirection] = useState('horizontal');
  const [frontBg, setFrontBg] = useState('#ffffff');
  const [backBg, setBackBg] = useState('#2563eb');
  const [frontText, setFrontText] = useState('Front Side');
  const [backText, setBackText] = useState('Back Side');
  const [borderRadius, setBorderRadius] = useState('8');
  const [output, setOutput] = useState('');

  const generate = () => {
    const rotateAxis = direction === 'horizontal' ? 'rotateY' : 'rotateX';
    const triggerSelector = trigger === 'hover' ? '.flip-card:hover .flip-card-inner' : '.flip-card.flipped .flip-card-inner';

    const css = `/* Flip Card CSS */
.flip-card {
  width: ${width}px;
  height: ${height}px;
  perspective: 1000px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform ${duration}s;
  transform-style: preserve-3d;
}

${triggerSelector} {
  transform: ${rotateAxis}(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: ${borderRadius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flip-card-front {
  background-color: ${frontBg};
  color: #333;
}

.flip-card-back {
  background-color: ${backBg};
  color: #fff;
  transform: ${rotateAxis}(180deg);
}`;

    const html = `<!-- Flip Card HTML -->
<div class="flip-card"${trigger === 'click' ? ' onclick="this.classList.toggle(\'flipped\')"' : ''}>
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <p>${frontText}</p>
    </div>
    <div class="flip-card-back">
      <p>${backText}</p>
    </div>
  </div>
</div>`;

    setOutput(`${css}\n\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="input-field" aria-label={`Card width for ${toolName}`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} step="0.1" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
            <input type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
            <select value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field">
              <option value="hover">Hover</option>
              <option value="click">Click</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flip Direction</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field">
              <option value="horizontal">Horizontal (Y-axis)</option>
              <option value="vertical">Vertical (X-axis)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Front Background</label>
            <input type="color" value={frontBg} onChange={(e) => setFrontBg(e.target.value)} className="input-field h-10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Back Background</label>
            <input type="color" value={backBg} onChange={(e) => setBackBg(e.target.value)} className="input-field h-10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Front Text</label>
            <input type="text" value={frontText} onChange={(e) => setFrontText(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Back Text</label>
            <input type="text" value={backText} onChange={(e) => setBackText(e.target.value)} className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-3">Generate Flip Card</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSS &amp; HTML Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
