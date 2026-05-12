'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssProgressBarGenerator - Generate CSS progress bar styles.
 * Creates customizable CSS progress bars with various styles, colors, and animations.
 */
export default function CssProgressBarGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [percentage, setPercentage] = useState(65);
  const [height, setHeight] = useState(20);
  const [borderRadius, setBorderRadius] = useState(10);
  const [bgColor, setBgColor] = useState('#e0e0e0');
  const [fillColor, setFillColor] = useState('#4CAF50');
  const [animated, setAnimated] = useState(true);
  const [striped, setStriped] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const css: string[] = [];
    css.push('.progress-container {');
    css.push(`  width: 100%;`);
    css.push(`  height: ${height}px;`);
    css.push(`  background-color: ${bgColor};`);
    css.push(`  border-radius: ${borderRadius}px;`);
    css.push(`  overflow: hidden;`);
    css.push(`  position: relative;`);
    css.push('}');
    css.push('');
    css.push('.progress-bar {');
    css.push(`  width: ${percentage}%;`);
    css.push(`  height: 100%;`);
    css.push(`  background-color: ${fillColor};`);
    css.push(`  border-radius: ${borderRadius}px;`);
    if (animated) {
      css.push(`  transition: width 0.6s ease-in-out;`);
    }
    if (striped) {
      css.push(`  background-image: linear-gradient(`);
      css.push(`    45deg,`);
      css.push(`    rgba(255, 255, 255, 0.15) 25%,`);
      css.push(`    transparent 25%,`);
      css.push(`    transparent 50%,`);
      css.push(`    rgba(255, 255, 255, 0.15) 50%,`);
      css.push(`    rgba(255, 255, 255, 0.15) 75%,`);
      css.push(`    transparent 75%,`);
      css.push(`    transparent`);
      css.push(`  );`);
      css.push(`  background-size: 1rem 1rem;`);
      if (animated) {
        css.push(`  animation: progress-stripes 1s linear infinite;`);
      }
    }
    css.push('}');

    if (showLabel) {
      css.push('');
      css.push('.progress-label {');
      css.push(`  position: absolute;`);
      css.push(`  top: 50%;`);
      css.push(`  left: 50%;`);
      css.push(`  transform: translate(-50%, -50%);`);
      css.push(`  font-size: ${Math.max(height - 6, 10)}px;`);
      css.push(`  font-weight: bold;`);
      css.push(`  color: #333;`);
      css.push('}');
    }

    if (striped && animated) {
      css.push('');
      css.push('@keyframes progress-stripes {');
      css.push('  from { background-position: 1rem 0; }');
      css.push('  to { background-position: 0 0; }');
      css.push('}');
    }

    css.push('');
    css.push('/* HTML */');
    css.push('<!--');
    css.push('<div class="progress-container">');
    css.push(`  <div class="progress-bar"></div>`);
    if (showLabel) {
      css.push(`  <span class="progress-label">${percentage}%</span>`);
    }
    css.push('</div>');
    css.push('-->');

    setOutput(css.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-pct`} className="block text-sm font-medium text-gray-700 mb-1">
              Percentage: {percentage}%
            </label>
            <input
              id={`${toolId}-pct`}
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              className="w-full"
              aria-label={`Progress percentage for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
              Height: {height}px
            </label>
            <input
              id={`${toolId}-height`}
              type="range"
              min="8"
              max="60"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="w-full"
              aria-label="Bar height"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius: {borderRadius}px
            </label>
            <input
              id={`${toolId}-radius`}
              type="range"
              min="0"
              max="30"
              value={borderRadius}
              onChange={(e) => setBorderRadius(parseInt(e.target.value))}
              className="w-full"
              aria-label="Border radius"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
                Background
              </label>
              <input
                id={`${toolId}-bg`}
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-8 cursor-pointer"
                aria-label="Background color"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-fill`} className="block text-sm font-medium text-gray-700 mb-1">
                Fill Color
              </label>
              <input
                id={`${toolId}-fill`}
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="w-12 h-8 cursor-pointer"
                aria-label="Fill color"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={animated} onChange={(e) => setAnimated(e.target.checked)} />
            <span className="text-sm text-gray-700">Animated</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={striped} onChange={(e) => setStriped(e.target.checked)} />
            <span className="text-sm text-gray-700">Striped</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} />
            <span className="text-sm text-gray-700">Show Label</span>
          </label>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div
            style={{ width: '100%', height: `${height}px`, backgroundColor: bgColor, borderRadius: `${borderRadius}px`, overflow: 'hidden', position: 'relative' }}
          >
            <div
              style={{ width: `${percentage}%`, height: '100%', backgroundColor: fillColor, borderRadius: `${borderRadius}px`, transition: animated ? 'width 0.6s ease-in-out' : 'none' }}
            />
            {showLabel && (
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: `${Math.max(height - 6, 10)}px`, fontWeight: 'bold', color: '#333' }}>
                {percentage}%
              </span>
            )}
          </div>
        </div>

        <button
          onClick={generate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate CSS
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
