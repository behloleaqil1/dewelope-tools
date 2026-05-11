'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTransformGenerator - Generate CSS transform with rotate, scale, translate, skew controls.
 */
export default function CssTransformGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);

  const buildTransform = () => {
    const parts: string[] = [];
    if (translateX !== 0 || translateY !== 0) parts.push(`translate(${translateX}px, ${translateY}px)`);
    if (rotateZ !== 0) parts.push(`rotate(${rotateZ}deg)`);
    if (rotateX !== 0) parts.push(`rotateX(${rotateX}deg)`);
    if (rotateY !== 0) parts.push(`rotateY(${rotateY}deg)`);
    if (scaleX !== 1 || scaleY !== 1) parts.push(`scale(${scaleX}, ${scaleY})`);
    if (skewX !== 0 || skewY !== 0) parts.push(`skew(${skewX}deg, ${skewY}deg)`);
    return parts.length > 0 ? parts.join(' ') : 'none';
  };

  const transformValue = buildTransform();
  const cssCode = `transform: ${transformValue};`;

  const reset = () => {
    setRotateX(0); setRotateY(0); setRotateZ(0);
    setScaleX(1); setScaleY(1);
    setTranslateX(0); setTranslateY(0);
    setSkewX(0); setSkewY(0);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Translate</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-tx`} className="text-xs text-gray-500">X (px)</label>
                <input id={`${toolId}-tx`} type="number" value={translateX} onChange={(e) => setTranslateX(Number(e.target.value))} aria-label={`Translate X for ${toolName}`} className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-ty`} className="text-xs text-gray-500">Y (px)</label>
                <input id={`${toolId}-ty`} type="number" value={translateY} onChange={(e) => setTranslateY(Number(e.target.value))} aria-label={`Translate Y for ${toolName}`} className="input-field" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rotate (deg)</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor={`${toolId}-rx`} className="text-xs text-gray-500">X</label>
                <input id={`${toolId}-rx`} type="number" value={rotateX} onChange={(e) => setRotateX(Number(e.target.value))} aria-label="Rotate X" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-ry`} className="text-xs text-gray-500">Y</label>
                <input id={`${toolId}-ry`} type="number" value={rotateY} onChange={(e) => setRotateY(Number(e.target.value))} aria-label="Rotate Y" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-rz`} className="text-xs text-gray-500">Z</label>
                <input id={`${toolId}-rz`} type="number" value={rotateZ} onChange={(e) => setRotateZ(Number(e.target.value))} aria-label="Rotate Z" className="input-field" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scale</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-sx`} className="text-xs text-gray-500">X</label>
                <input id={`${toolId}-sx`} type="number" step="0.1" value={scaleX} onChange={(e) => setScaleX(Number(e.target.value))} aria-label="Scale X" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-sy`} className="text-xs text-gray-500">Y</label>
                <input id={`${toolId}-sy`} type="number" step="0.1" value={scaleY} onChange={(e) => setScaleY(Number(e.target.value))} aria-label="Scale Y" className="input-field" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skew (deg)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-skx`} className="text-xs text-gray-500">X</label>
                <input id={`${toolId}-skx`} type="number" value={skewX} onChange={(e) => setSkewX(Number(e.target.value))} aria-label="Skew X" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-sky`} className="text-xs text-gray-500">Y</label>
                <input id={`${toolId}-sky`} type="number" value={skewY} onChange={(e) => setSkewY(Number(e.target.value))} aria-label="Skew Y" className="input-field" />
              </div>
            </div>
          </div>
        </div>
      </InputArea>

      <div className="flex gap-2">
        <button onClick={reset} aria-label="Reset transform" className="btn-primary bg-gray-600 hover:bg-gray-700">
          Reset
        </button>
      </div>

      <OutputArea hasContent={transformValue !== 'none'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="bg-gray-100 p-8 rounded-lg border border-gray-200 flex items-center justify-center min-h-[200px]">
              <div
                className="w-24 h-24 bg-blue-500 rounded-lg shadow-lg"
                style={{ transform: transformValue }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CSS Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{cssCode}</pre>
          </div>
          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
