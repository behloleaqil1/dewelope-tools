'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssGradientAnimator - Generates animated CSS gradient code.
 * Creates smooth gradient animations with customizable colors, speed, and direction.
 */
export default function CssGradientAnimator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [colors, setColors] = useState(['#ee7752', '#e73c7e', '#23a6d5', '#23d5ab']);
  const [duration, setDuration] = useState(15);
  const [direction, setDirection] = useState('135deg');
  const [animationType, setAnimationType] = useState<'shift' | 'rotate'>('shift');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const addColor = () => {
    if (colors.length >= 8) return;
    setColors([...colors, '#ffffff']);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, value: string) => {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  };

  const generate = () => {
    if (colors.length < 2) {
      setError('At least 2 colors are required');
      setOutput('');
      return;
    }
    if (duration <= 0 || duration > 120) {
      setError('Duration must be between 1 and 120 seconds');
      setOutput('');
      return;
    }
    setError(undefined);

    const colorList = colors.join(', ');
    let css = '';

    if (animationType === 'shift') {
      css = `.animated-gradient {
  background: linear-gradient(${direction}, ${colorList});
  background-size: 400% 400%;
  animation: gradientShift ${duration}s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}`;
    } else {
      css = `.animated-gradient {
  background: conic-gradient(from 0deg, ${colorList});
  animation: gradientRotate ${duration}s linear infinite;
}

@keyframes gradientRotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}`;
    }

    setOutput(css);
  };

  const previewStyle = output ? (animationType === 'shift' ? {
    background: `linear-gradient(${direction}, ${colors.join(', ')})`,
    backgroundSize: '400% 400%',
    animation: `gradientShift ${duration}s ease infinite`,
  } : {
    background: `conic-gradient(from 0deg, ${colors.join(', ')})`,
    animation: `gradientRotate ${duration}s linear infinite`,
  }) : {};

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      {output && (
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes gradientRotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
        `}</style>
      )}

      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gradient Colors</label>
        <div className="space-y-2">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(idx, e.target.value)}
                aria-label={`Color ${idx + 1}`}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => updateColor(idx, e.target.value)}
                aria-label={`Color ${idx + 1} hex value`}
                className="input-field flex-1 font-mono"
              />
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(idx)}
                  aria-label={`Remove color ${idx + 1}`}
                  className="text-red-500 hover:text-red-700 text-sm px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {colors.length < 8 && (
            <button onClick={addColor} className="text-sm text-blue-600 hover:text-blue-800">
              + Add Color
            </button>
          )}
        </div>
      </InputArea>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">
            Duration (seconds)
          </label>
          <input
            id={`${toolId}-duration`}
            type="number"
            min={1}
            max={120}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
            aria-label={`Animation duration for ${toolName}`}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Animation Type</label>
          <select
            value={animationType}
            onChange={(e) => setAnimationType(e.target.value as 'shift' | 'rotate')}
            aria-label="Animation type"
            className="input-field"
          >
            <option value="shift">Background Shift</option>
            <option value="rotate">Hue Rotate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            aria-label="Gradient direction"
            className="input-field"
            disabled={animationType === 'rotate'}
          >
            <option value="135deg">135° (diagonal)</option>
            <option value="90deg">90° (horizontal)</option>
            <option value="180deg">180° (vertical)</option>
            <option value="45deg">45° (diagonal up)</option>
            <option value="270deg">270° (bottom to top)</option>
          </select>
        </div>
      </div>

      <button onClick={generate} aria-label="Generate animated gradient CSS" className="btn-primary">
        Generate CSS
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div
              className="w-full h-32 rounded-lg border border-gray-200"
              style={previewStyle}
              aria-label="Gradient animation preview"
            />
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">CSS Code</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
