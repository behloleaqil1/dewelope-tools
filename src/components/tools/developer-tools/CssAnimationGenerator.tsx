'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssAnimationGenerator - Generate CSS keyframe animations with visual controls and live preview.
 * Supports common animation presets and custom keyframe editing.
 */
export default function CssAnimationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [animationName, setAnimationName] = useState('myAnimation');
  const [duration, setDuration] = useState(1);
  const [timingFunction, setTimingFunction] = useState('ease');
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState('infinite');
  const [direction, setDirection] = useState('normal');
  const [fillMode, setFillMode] = useState('none');
  const [preset, setPreset] = useState('fadeIn');

  const presets: Record<string, string> = {
    fadeIn: `@keyframes ${animationName} {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}`,
    fadeOut: `@keyframes ${animationName} {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}`,
    slideInLeft: `@keyframes ${animationName} {\n  from {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}`,
    slideInRight: `@keyframes ${animationName} {\n  from {\n    transform: translateX(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}`,
    slideInUp: `@keyframes ${animationName} {\n  from {\n    transform: translateY(100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateY(0);\n    opacity: 1;\n  }\n}`,
    bounce: `@keyframes ${animationName} {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  25% {\n    transform: translateY(-20px);\n  }\n  50% {\n    transform: translateY(0);\n  }\n  75% {\n    transform: translateY(-10px);\n  }\n}`,
    pulse: `@keyframes ${animationName} {\n  0% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.1);\n  }\n  100% {\n    transform: scale(1);\n  }\n}`,
    shake: `@keyframes ${animationName} {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  20% {\n    transform: translateX(-10px);\n  }\n  40% {\n    transform: translateX(10px);\n  }\n  60% {\n    transform: translateX(-10px);\n  }\n  80% {\n    transform: translateX(10px);\n  }\n}`,
    rotate: `@keyframes ${animationName} {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}`,
    zoomIn: `@keyframes ${animationName} {\n  from {\n    transform: scale(0);\n    opacity: 0;\n  }\n  to {\n    transform: scale(1);\n    opacity: 1;\n  }\n}`,
  };

  const keyframesCode = presets[preset] || presets.fadeIn;
  const animationProperty = `animation: ${animationName} ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode};`;
  const fullCode = `${keyframesCode}\n\n.animated-element {\n  ${animationProperty}\n}`;

  const previewStyle: React.CSSProperties = {
    animationName,
    animationDuration: `${duration}s`,
    animationTimingFunction: timingFunction,
    animationDelay: `${delay}s`,
    animationIterationCount: iterationCount,
    animationDirection: direction as React.CSSProperties['animationDirection'],
    animationFillMode: fillMode as React.CSSProperties['animationFillMode'],
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Animation Controls</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-preset`} className="block text-xs text-gray-500 mb-1">Preset</label>
            <select id={`${toolId}-preset`} value={preset} onChange={(e) => setPreset(e.target.value)} className="input-field" aria-label={`Animation preset for ${toolName}`}>
              <option value="fadeIn">Fade In</option>
              <option value="fadeOut">Fade Out</option>
              <option value="slideInLeft">Slide In Left</option>
              <option value="slideInRight">Slide In Right</option>
              <option value="slideInUp">Slide In Up</option>
              <option value="bounce">Bounce</option>
              <option value="pulse">Pulse</option>
              <option value="shake">Shake</option>
              <option value="rotate">Rotate</option>
              <option value="zoomIn">Zoom In</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-xs text-gray-500 mb-1">Animation Name</label>
            <input id={`${toolId}-name`} type="text" value={animationName} onChange={(e) => setAnimationName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))} className="input-field" aria-label="Animation name" placeholder="myAnimation" />
          </div>
          <div>
            <label htmlFor={`${toolId}-duration`} className="block text-xs text-gray-500 mb-1">Duration: {duration}s</label>
            <input id={`${toolId}-duration`} type="range" min="0.1" max="5" step="0.1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full" aria-label="Animation duration" />
          </div>
          <div>
            <label htmlFor={`${toolId}-delay`} className="block text-xs text-gray-500 mb-1">Delay: {delay}s</label>
            <input id={`${toolId}-delay`} type="range" min="0" max="5" step="0.1" value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="w-full" aria-label="Animation delay" />
          </div>
          <div>
            <label htmlFor={`${toolId}-timing`} className="block text-xs text-gray-500 mb-1">Timing Function</label>
            <select id={`${toolId}-timing`} value={timingFunction} onChange={(e) => setTimingFunction(e.target.value)} className="input-field" aria-label="Timing function">
              <option value="ease">ease</option>
              <option value="linear">linear</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-iteration`} className="block text-xs text-gray-500 mb-1">Iteration Count</label>
            <select id={`${toolId}-iteration`} value={iterationCount} onChange={(e) => setIterationCount(e.target.value)} className="input-field" aria-label="Iteration count">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="infinite">infinite</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-direction`} className="block text-xs text-gray-500 mb-1">Direction</label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field" aria-label="Animation direction">
              <option value="normal">normal</option>
              <option value="reverse">reverse</option>
              <option value="alternate">alternate</option>
              <option value="alternate-reverse">alternate-reverse</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-fill`} className="block text-xs text-gray-500 mb-1">Fill Mode</label>
            <select id={`${toolId}-fill`} value={fillMode} onChange={(e) => setFillMode(e.target.value)} className="input-field" aria-label="Fill mode">
              <option value="none">none</option>
              <option value="forwards">forwards</option>
              <option value="backwards">backwards</option>
              <option value="both">both</option>
            </select>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Preview</label>
          <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden min-h-[120px]">
            <style>{keyframesCode}</style>
            <div
              className="w-20 h-20 bg-blue-500 rounded-lg"
              style={previewStyle}
              aria-label="Animation preview"
            />
          </div>
          <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{fullCode}</pre>
          </div>
          <CopyToClipboard text={fullCode} />
        </div>
      </OutputArea>
    </div>
  );
}
