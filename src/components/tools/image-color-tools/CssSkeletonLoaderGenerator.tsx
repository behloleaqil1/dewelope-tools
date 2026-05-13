'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssSkeletonLoaderGenerator - Generate CSS skeleton loading animation.
 * Creates customizable skeleton loader CSS with shimmer animation.
 */
export default function CssSkeletonLoaderGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#e0e0e0');
  const [shimmerColor, setShimmerColor] = useState('#f5f5f5');
  const [borderRadius, setBorderRadius] = useState('4');
  const [animationDuration, setAnimationDuration] = useState('1.5');
  const [lines, setLines] = useState('3');
  const [showAvatar, setShowAvatar] = useState(true);
  const [cardWidth, setCardWidth] = useState('300');
  const [output, setOutput] = useState('');

  const generate = () => {
    const numLines = parseInt(lines) || 3;
    const radius = parseInt(borderRadius) || 4;
    const duration = parseFloat(animationDuration) || 1.5;
    const width = parseInt(cardWidth) || 300;

    const lineElements = Array.from({ length: numLines }, (_, i) => {
      const w = i === numLines - 1 ? '60%' : '100%';
      return `  <div class="skeleton-line" style="width: ${w}"></div>`;
    }).join('\n');

    const css = `.skeleton-container {
  width: ${width}px;
  padding: 16px;
  border-radius: ${radius}px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${baseColor};
  position: relative;
  overflow: hidden;
}

.skeleton-title {
  height: 14px;
  width: 60%;
  background: ${baseColor};
  border-radius: ${radius}px;
  position: relative;
  overflow: hidden;
}

.skeleton-line {
  height: 12px;
  background: ${baseColor};
  border-radius: ${radius}px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.skeleton-avatar::after,
.skeleton-title::after,
.skeleton-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    ${shimmerColor},
    transparent
  );
  animation: shimmer ${duration}s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}`;

    const html = `<div class="skeleton-container">
  <div class="skeleton-header">
${showAvatar ? '    <div class="skeleton-avatar"></div>\n' : ''}    <div class="skeleton-title"></div>
  </div>
${lineElements}
</div>`;

    setOutput(`/* CSS Skeleton Loader */\n\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
                Base Color
              </label>
              <input
                id={`${toolId}-base`}
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                placeholder="#e0e0e0"
                aria-label={`Base color for ${toolName}`}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-shimmer`} className="block text-sm font-medium text-gray-700 mb-1">
                Shimmer Color
              </label>
              <input
                id={`${toolId}-shimmer`}
                type="text"
                value={shimmerColor}
                onChange={(e) => setShimmerColor(e.target.value)}
                placeholder="#f5f5f5"
                aria-label="Shimmer color"
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius (px)
              </label>
              <input
                id={`${toolId}-radius`}
                type="number"
                min="0"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                aria-label="Border radius"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">
                Duration (s)
              </label>
              <input
                id={`${toolId}-duration`}
                type="number"
                step="0.1"
                min="0.5"
                value={animationDuration}
                onChange={(e) => setAnimationDuration(e.target.value)}
                aria-label="Animation duration"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-lines`} className="block text-sm font-medium text-gray-700 mb-1">
                Lines
              </label>
              <input
                id={`${toolId}-lines`}
                type="number"
                min="1"
                max="10"
                value={lines}
                onChange={(e) => setLines(e.target.value)}
                aria-label="Number of lines"
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
                Card Width (px)
              </label>
              <input
                id={`${toolId}-width`}
                type="number"
                min="100"
                value={cardWidth}
                onChange={(e) => setCardWidth(e.target.value)}
                aria-label="Card width"
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={showAvatar}
                  onChange={(e) => setShowAvatar(e.target.checked)}
                  aria-label="Show avatar placeholder"
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Show Avatar</span>
              </label>
            </div>
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate Skeleton Loader
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS & HTML</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
