'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTimelineGenerator - Generate CSS vertical timeline styles.
 * Creates customizable CSS for vertical timeline components.
 */
export default function CssTimelineGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [lineColor, setLineColor] = useState('#3B82F6');
  const [dotColor, setDotColor] = useState('#3B82F6');
  const [dotSize, setDotSize] = useState('16');
  const [lineWidth, setLineWidth] = useState('3');
  const [spacing, setSpacing] = useState('40');
  const [cardBg, setCardBg] = useState('#FFFFFF');
  const [cardBorder, setCardBorder] = useState('#E5E7EB');
  const [cardRadius, setCardRadius] = useState('8');
  const [alternating, setAlternating] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const dotSizePx = parseInt(dotSize) || 16;
    const lineWidthPx = parseInt(lineWidth) || 3;
    const spacingPx = parseInt(spacing) || 40;
    const radiusPx = parseInt(cardRadius) || 8;

    const css = `.timeline {
  position: relative;
  padding: 20px 0;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: ${alternating ? '50%' : `${dotSizePx / 2}px`};
  transform: ${alternating ? 'translateX(-50%)' : 'none'};
  top: 0;
  bottom: 0;
  width: ${lineWidthPx}px;
  background: ${lineColor};
}

.timeline-item {
  position: relative;
  margin-bottom: ${spacingPx}px;
  ${alternating ? 'width: 50%;' : `padding-left: ${dotSizePx + 20}px;`}
}
${alternating ? `
.timeline-item:nth-child(odd) {
  left: 0;
  padding-right: ${dotSizePx + 20}px;
  text-align: right;
}

.timeline-item:nth-child(even) {
  left: 50%;
  padding-left: ${dotSizePx + 20}px;
  text-align: left;
}` : ''}

.timeline-dot {
  position: absolute;
  width: ${dotSizePx}px;
  height: ${dotSizePx}px;
  background: ${dotColor};
  border-radius: 50%;
  top: 5px;
  ${alternating ? '' : `left: 0;`}
  z-index: 1;
}
${alternating ? `
.timeline-item:nth-child(odd) .timeline-dot {
  right: -${dotSizePx / 2}px;
}

.timeline-item:nth-child(even) .timeline-dot {
  left: -${dotSizePx / 2}px;
}` : ''}

.timeline-card {
  background: ${cardBg};
  border: 1px solid ${cardBorder};
  border-radius: ${radiusPx}px;
  padding: 16px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.timeline-card h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
}

.timeline-card p {
  margin: 0;
  font-size: 0.875rem;
  color: #6B7280;
}

.timeline-date {
  font-size: 0.75rem;
  color: #9CA3AF;
  margin-bottom: 4px;
}`;

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-linecolor`} className="block text-sm font-medium text-gray-700 mb-1">Line Color</label>
              <input id={`${toolId}-linecolor`} type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="input-field h-10" aria-label={`Line color for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-dotcolor`} className="block text-sm font-medium text-gray-700 mb-1">Dot Color</label>
              <input id={`${toolId}-dotcolor`} type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="input-field h-10" aria-label="Dot color" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-dotsize`} className="block text-sm font-medium text-gray-700 mb-1">Dot Size (px)</label>
              <input id={`${toolId}-dotsize`} type="number" value={dotSize} onChange={(e) => setDotSize(e.target.value)} className="input-field" aria-label="Dot size" />
            </div>
            <div>
              <label htmlFor={`${toolId}-linewidth`} className="block text-sm font-medium text-gray-700 mb-1">Line Width (px)</label>
              <input id={`${toolId}-linewidth`} type="number" value={lineWidth} onChange={(e) => setLineWidth(e.target.value)} className="input-field" aria-label="Line width" />
            </div>
            <div>
              <label htmlFor={`${toolId}-spacing`} className="block text-sm font-medium text-gray-700 mb-1">Spacing (px)</label>
              <input id={`${toolId}-spacing`} type="number" value={spacing} onChange={(e) => setSpacing(e.target.value)} className="input-field" aria-label="Item spacing" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-cardbg`} className="block text-sm font-medium text-gray-700 mb-1">Card Background</label>
              <input id={`${toolId}-cardbg`} type="color" value={cardBg} onChange={(e) => setCardBg(e.target.value)} className="input-field h-10" aria-label="Card background" />
            </div>
            <div>
              <label htmlFor={`${toolId}-cardborder`} className="block text-sm font-medium text-gray-700 mb-1">Card Border</label>
              <input id={`${toolId}-cardborder`} type="color" value={cardBorder} onChange={(e) => setCardBorder(e.target.value)} className="input-field h-10" aria-label="Card border color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
              <input id={`${toolId}-radius`} type="number" value={cardRadius} onChange={(e) => setCardRadius(e.target.value)} className="input-field" aria-label="Border radius" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id={`${toolId}-alt`} type="checkbox" checked={alternating} onChange={(e) => setAlternating(e.target.checked)} className="rounded" aria-label="Alternating layout" />
            <label htmlFor={`${toolId}-alt`} className="text-sm font-medium text-gray-700">Alternating layout (left/right)</label>
          </div>
          <button onClick={generate} className="btn-primary">Generate Timeline CSS</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
