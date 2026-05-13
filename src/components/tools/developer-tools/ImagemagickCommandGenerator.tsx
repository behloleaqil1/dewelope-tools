'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ImagemagickCommandGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [inputFile, setInputFile] = useState('input.png');
  const [outputFile, setOutputFile] = useState('output.jpg');
  const [operation, setOperation] = useState('resize');
  const [resizeWidth, setResizeWidth] = useState('800');
  const [resizeHeight, setResizeHeight] = useState('600');
  const [quality, setQuality] = useState('85');
  const [useMogrify, setUseMogrify] = useState(false);
  const [crop, setCrop] = useState('');
  const [rotate, setRotate] = useState('');
  const [blur, setBlur] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const cmd = useMogrify ? 'mogrify' : 'convert';
    const parts: string[] = [cmd];

    if (!useMogrify) {
      parts.push(inputFile);
    }

    if (operation === 'resize' && resizeWidth) {
      const dim = resizeHeight ? `${resizeWidth}x${resizeHeight}` : resizeWidth;
      parts.push(`-resize ${dim}`);
    }

    if (operation === 'crop' && crop) {
      parts.push(`-crop ${crop}`);
    }

    if (operation === 'rotate' && rotate) {
      parts.push(`-rotate ${rotate}`);
    }

    if (operation === 'blur' && blur) {
      parts.push(`-blur 0x${blur}`);
    }

    if (quality) {
      parts.push(`-quality ${quality}`);
    }

    if (operation === 'strip') {
      parts.push('-strip');
    }

    if (operation === 'grayscale') {
      parts.push('-colorspace Gray');
    }

    if (useMogrify) {
      parts.push(inputFile);
    } else {
      parts.push(outputFile);
    }

    setOutput(parts.join(' '));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          aria-label={`Operation for ${toolName}`}
          className="input-field mb-3"
        >
          <option value="resize">Resize</option>
          <option value="crop">Crop</option>
          <option value="rotate">Rotate</option>
          <option value="blur">Blur</option>
          <option value="strip">Strip Metadata</option>
          <option value="grayscale">Grayscale</option>
        </select>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input File</label>
            <input type="text" value={inputFile} onChange={(e) => setInputFile(e.target.value)} className="input-field" aria-label="Input file name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Output File</label>
            <input type="text" value={outputFile} onChange={(e) => setOutputFile(e.target.value)} className="input-field" aria-label="Output file name" disabled={useMogrify} />
          </div>
        </div>

        {operation === 'resize' && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
              <input type="number" value={resizeWidth} onChange={(e) => setResizeWidth(e.target.value)} className="input-field" aria-label="Resize width" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
              <input type="number" value={resizeHeight} onChange={(e) => setResizeHeight(e.target.value)} className="input-field" aria-label="Resize height" />
            </div>
          </div>
        )}

        {operation === 'crop' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Geometry (e.g. 300x200+50+50)</label>
            <input type="text" value={crop} onChange={(e) => setCrop(e.target.value)} className="input-field" aria-label="Crop geometry" />
          </div>
        )}

        {operation === 'rotate' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rotation Degrees</label>
            <input type="number" value={rotate} onChange={(e) => setRotate(e.target.value)} className="input-field" aria-label="Rotation degrees" />
          </div>
        )}

        {operation === 'blur' && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Blur Sigma</label>
            <input type="number" value={blur} onChange={(e) => setBlur(e.target.value)} className="input-field" aria-label="Blur sigma" />
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quality (1-100)</label>
          <input type="number" value={quality} onChange={(e) => setQuality(e.target.value)} min="1" max="100" className="input-field" aria-label="Output quality" />
        </div>

        <label className="flex items-center gap-2 mb-3">
          <input type="checkbox" checked={useMogrify} onChange={(e) => setUseMogrify(e.target.checked)} />
          <span className="text-sm text-gray-700">Use mogrify (in-place edit)</span>
        </label>

        <button onClick={generate} className="btn-primary">Generate Command</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Command</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
