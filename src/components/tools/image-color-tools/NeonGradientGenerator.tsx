'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NeonGradientGenerator - Generate neon glow gradient combinations.
 * Creates vibrant neon-style gradients with glow effects for dark backgrounds.
 */
export default function NeonGradientGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('electric');
  const [direction, setDirection] = useState('to right');
  const [gradient, setGradient] = useState<{ colors: string[]; css: string; glow: string } | null>(null);

  const neonStyles: Record<string, { name: string; palettes: string[][] }> = {
    electric: {
      name: 'Electric Blue',
      palettes: [
        ['#00f5ff', '#0066ff', '#7b2dff'],
        ['#00e5ff', '#2979ff', '#651fff'],
        ['#18ffff', '#448aff', '#7c4dff'],
      ],
    },
    hotPink: {
      name: 'Hot Pink',
      palettes: [
        ['#ff0080', '#ff00ff', '#8000ff'],
        ['#ff1493', '#ff00de', '#9400d3'],
        ['#ff006e', '#c300ff', '#7400b8'],
      ],
    },
    limeGreen: {
      name: 'Toxic Lime',
      palettes: [
        ['#39ff14', '#00ff87', '#00e5ff'],
        ['#76ff03', '#00e676', '#1de9b6'],
        ['#ccff00', '#69f0ae', '#00bfa5'],
      ],
    },
    sunset: {
      name: 'Neon Sunset',
      palettes: [
        ['#ff0000', '#ff6600', '#ffff00'],
        ['#ff1744', '#ff9100', '#ffea00'],
        ['#f50057', '#ff6d00', '#ffd600'],
      ],
    },
    synthwave: {
      name: 'Synthwave',
      palettes: [
        ['#ff00ff', '#00ffff', '#ff0080'],
        ['#f700ff', '#00f7ff', '#ff0066'],
        ['#e100ff', '#00e1ff', '#ff0099'],
      ],
    },
    aurora: {
      name: 'Neon Aurora',
      palettes: [
        ['#00ff88', '#00aaff', '#aa00ff'],
        ['#00ff66', '#0088ff', '#cc00ff'],
        ['#00ffaa', '#0066ff', '#8800ff'],
      ],
    },
  };

  const generate = () => {
    const config = neonStyles[style];
    const palette = config.palettes[Math.floor(Math.random() * config.palettes.length)];
    const css = `background: linear-gradient(${direction}, ${palette.join(', ')});`;
    const glow = `box-shadow: 0 0 20px ${palette[0]}80, 0 0 40px ${palette[1]}40, 0 0 60px ${palette[2]}20;`;

    setGradient({ colors: palette, css, glow });
  };

  const copyText = gradient
    ? `/* Neon Gradient: ${neonStyles[style].name} */\n${gradient.css}\n\n/* Neon Glow Effect */\n${gradient.glow}\n\n/* Full Example */\n.neon-element {\n  ${gradient.css}\n  ${gradient.glow}\n  border-radius: 8px;\n  padding: 20px;\n}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
            Neon Style
          </label>
          <select
            id={`${toolId}-style`}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            aria-label={`Neon style for ${toolName}`}
            className="input-field"
          >
            {Object.entries(neonStyles).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">
            Gradient Direction
          </label>
          <select
            id={`${toolId}-direction`}
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            aria-label={`Gradient direction for ${toolName}`}
            className="input-field"
          >
            <option value="to right">Left to Right</option>
            <option value="to left">Right to Left</option>
            <option value="to bottom">Top to Bottom</option>
            <option value="to bottom right">Diagonal ↘</option>
            <option value="45deg">45°</option>
            <option value="135deg">135°</option>
          </select>
        </div>
      </div>

      <button onClick={generate} className="btn-primary" aria-label="Generate neon gradient">
        Generate Neon Gradient
      </button>

      <OutputArea hasContent={gradient !== null}>
        {gradient && (
          <div className="space-y-3">
            <div
              className="h-32 rounded-lg"
              style={{
                background: `linear-gradient(${direction}, ${gradient.colors.join(', ')})`,
                boxShadow: `0 0 20px ${gradient.colors[0]}80, 0 0 40px ${gradient.colors[1]}40`,
              }}
            />
            <div className="bg-gray-900 p-4 rounded-lg">
              <div
                className="h-16 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(${direction}, ${gradient.colors.join(', ')})`,
                  boxShadow: `0 0 20px ${gradient.colors[0]}80, 0 0 40px ${gradient.colors[1]}40, 0 0 60px ${gradient.colors[2]}20`,
                }}
              >
                <span className="text-white font-bold text-sm">With Glow on Dark</span>
              </div>
            </div>
            <div className="flex gap-2">
              {gradient.colors.map((color, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="h-8 rounded" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap">{copyText}</pre>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
