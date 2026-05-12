'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GradientMeshGenerator - Generate CSS mesh gradient approximation.
 * Creates a multi-layered radial gradient that approximates a mesh gradient effect.
 */
export default function GradientMeshGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [colors, setColors] = useState(['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [output, setOutput] = useState('');

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 8) {
      setColors([...colors, '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const generate = () => {
    // Generate random positions for each color blob
    const blobs = colors.map((color) => {
      const x = Math.floor(Math.random() * 80 + 10);
      const y = Math.floor(Math.random() * 80 + 10);
      const size = Math.floor(Math.random() * 40 + 30);
      return { color, x, y, size };
    });

    const gradients = blobs.map(blob =>
      `radial-gradient(at ${blob.x}% ${blob.y}%, ${blob.color}40 0px, transparent ${blob.size}%)`
    );

    const css = `background-color: ${bgColor};\nbackground-image:\n  ${gradients.join(',\n  ')};`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mesh Colors (2-8)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(idx, e.target.value)}
                aria-label={`Color ${idx + 1} for ${toolName}`}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => updateColor(idx, e.target.value)}
                className="input-field text-xs flex-1 font-mono"
              />
              {colors.length > 2 && (
                <button onClick={() => removeColor(idx)} className="text-red-500 text-xs font-bold px-1" aria-label={`Remove color ${idx + 1}`}>×</button>
              )}
            </div>
          ))}
        </div>
        {colors.length < 8 && (
          <button onClick={addColor} className="text-sm text-blue-600 mt-2 hover:underline">+ Add Color</button>
        )}
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            aria-label="Background color"
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            id={`${toolId}-bg`}
            type="text"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="input-field flex-1 font-mono"
          />
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate mesh gradient" className="btn-primary">
        Generate Mesh Gradient
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div
              className="w-full h-48 rounded-lg border border-gray-200"
              style={{
                backgroundColor: bgColor,
                backgroundImage: output.split('background-image:\n')[1]?.replace(';', '') || '',
              }}
              aria-label="Mesh gradient preview"
            />
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">CSS Code</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
