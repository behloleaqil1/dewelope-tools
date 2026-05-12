'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssSwitchToggleGenerator - Generate CSS toggle switch styles.
 * Creates customizable CSS-only toggle switch components with preview.
 */
export default function CssSwitchToggleGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('50');
  const [height, setHeight] = useState('26');
  const [bgOff, setBgOff] = useState('#cccccc');
  const [bgOn, setBgOn] = useState('#4CAF50');
  const [knobColor, setKnobColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState('13');
  const [transition, setTransition] = useState('0.3');
  const [output, setOutput] = useState('');
  const [isOn, setIsOn] = useState(false);

  const generate = () => {
    const w = parseInt(width) || 50;
    const h = parseInt(height) || 26;
    const br = parseInt(borderRadius) || 13;
    const trans = parseFloat(transition) || 0.3;
    const knobSize = h - 4;
    const translateX = w - knobSize - 4;

    const css = `.switch {
  position: relative;
  display: inline-block;
  width: ${w}px;
  height: ${h}px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${bgOff};
  transition: ${trans}s;
  border-radius: ${br}px;
}

.slider:before {
  position: absolute;
  content: "";
  height: ${knobSize}px;
  width: ${knobSize}px;
  left: 2px;
  bottom: 2px;
  background-color: ${knobColor};
  transition: ${trans}s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: ${bgOn};
}

input:checked + .slider:before {
  transform: translateX(${translateX}px);
}

input:focus + .slider {
  box-shadow: 0 0 1px ${bgOn};
}`;

    const html = `<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
              Width (px)
            </label>
            <input
              id={`${toolId}-width`}
              type="number"
              min="30"
              max="120"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="input-field"
              aria-label={`Toggle width for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <input
              id={`${toolId}-height`}
              type="number"
              min="16"
              max="60"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input-field"
              aria-label="Toggle height"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-bgoff`} className="block text-sm font-medium text-gray-700 mb-1">
              Background (Off)
            </label>
            <input
              id={`${toolId}-bgoff`}
              type="color"
              value={bgOff}
              onChange={(e) => setBgOff(e.target.value)}
              className="input-field h-10"
              aria-label="Off state background color"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-bgon`} className="block text-sm font-medium text-gray-700 mb-1">
              Background (On)
            </label>
            <input
              id={`${toolId}-bgon`}
              type="color"
              value={bgOn}
              onChange={(e) => setBgOn(e.target.value)}
              className="input-field h-10"
              aria-label="On state background color"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-knob`} className="block text-sm font-medium text-gray-700 mb-1">
              Knob Color
            </label>
            <input
              id={`${toolId}-knob`}
              type="color"
              value={knobColor}
              onChange={(e) => setKnobColor(e.target.value)}
              className="input-field h-10"
              aria-label="Knob color"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius (px)
            </label>
            <input
              id={`${toolId}-radius`}
              type="number"
              min="0"
              max="50"
              value={borderRadius}
              onChange={(e) => setBorderRadius(e.target.value)}
              className="input-field"
              aria-label="Border radius"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-trans`} className="block text-sm font-medium text-gray-700 mb-1">
              Transition (seconds)
            </label>
            <input
              id={`${toolId}-trans`}
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={transition}
              onChange={(e) => setTransition(e.target.value)}
              className="input-field"
              aria-label="Transition duration"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-gray-600">Preview:</span>
          <button
            onClick={() => setIsOn(!isOn)}
            className="relative inline-block cursor-pointer"
            style={{ width: `${parseInt(width) || 50}px`, height: `${parseInt(height) || 26}px` }}
            aria-label="Toggle preview"
          >
            <span
              className="absolute inset-0 rounded-full transition-colors"
              style={{
                backgroundColor: isOn ? bgOn : bgOff,
                borderRadius: `${parseInt(borderRadius) || 13}px`,
                transition: `${parseFloat(transition) || 0.3}s`,
              }}
            />
            <span
              className="absolute rounded-full transition-transform"
              style={{
                width: `${(parseInt(height) || 26) - 4}px`,
                height: `${(parseInt(height) || 26) - 4}px`,
                left: '2px',
                bottom: '2px',
                backgroundColor: knobColor,
                transform: isOn ? `translateX(${(parseInt(width) || 50) - (parseInt(height) || 26) + 0}px)` : 'translateX(0)',
                transition: `${parseFloat(transition) || 0.3}s`,
              }}
            />
          </button>
          <span className="text-sm text-gray-500">{isOn ? 'ON' : 'OFF'}</span>
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
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
