'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerBlProductCalculator - Calculate speaker BL (force factor) product.
 * BL product = magnetic flux density (B) × voice coil length (l).
 */
export default function SpeakerBlProductCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [fluxDensity, setFluxDensity] = useState('');
  const [coilLength, setCoilLength] = useState('');
  const [coilDiameter, setCoilDiameter] = useState('');
  const [turns, setTurns] = useState('');
  const [mode, setMode] = useState<'direct' | 'coil'>('direct');
  const [output, setOutput] = useState('');

  const calculate = () => {
    if (mode === 'direct') {
      const B = parseFloat(fluxDensity);
      const l = parseFloat(coilLength);

      if (isNaN(B) || isNaN(l) || B <= 0 || l <= 0) {
        setOutput('Please enter valid flux density and coil length values.');
        return;
      }

      const BL = B * l;
      const result = `Speaker BL Product (Direct)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Magnetic Flux Density (B): ${B} T
Voice Coil Length (l):     ${l} m

BL Product:                ${BL.toFixed(4)} T·m (N/A)

Rating:
${BL < 5 ? '  Low force factor - suitable for tweeters/small drivers' : BL < 15 ? '  Medium force factor - suitable for mid-range drivers' : '  High force factor - suitable for woofers/subwoofers'}`;
      setOutput(result);
    } else {
      const B = parseFloat(fluxDensity);
      const d = parseFloat(coilDiameter);
      const n = parseFloat(turns);

      if (isNaN(B) || isNaN(d) || isNaN(n) || B <= 0 || d <= 0 || n <= 0) {
        setOutput('Please enter valid values for all fields.');
        return;
      }

      const circumference = Math.PI * (d / 1000);
      const totalLength = circumference * n;
      const BL = B * totalLength;

      const result = `Speaker BL Product (From Coil Geometry)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Magnetic Flux Density (B):  ${B} T
Voice Coil Diameter:        ${d} mm
Number of Turns:            ${n}

Coil Circumference:         ${(circumference * 1000).toFixed(2)} mm
Total Wire Length:           ${totalLength.toFixed(4)} m
BL Product:                 ${BL.toFixed(4)} T·m (N/A)

Rating:
${BL < 5 ? '  Low force factor - suitable for tweeters/small drivers' : BL < 15 ? '  Medium force factor - suitable for mid-range drivers' : '  High force factor - suitable for woofers/subwoofers'}`;
      setOutput(result);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={mode === 'direct'} onChange={() => setMode('direct')} aria-label="Direct BL calculation" /> Direct (B × l)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={mode === 'coil'} onChange={() => setMode('coil')} aria-label="From coil geometry" /> From Coil Geometry
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-flux`} className="block text-sm font-medium text-gray-700 mb-1">Flux Density B (Tesla)</label>
            <input id={`${toolId}-flux`} type="number" step="0.01" value={fluxDensity} onChange={(e) => setFluxDensity(e.target.value)} placeholder="1.2" aria-label="Magnetic flux density in Tesla" className="input-field" />
          </div>
          {mode === 'direct' ? (
            <div>
              <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Coil Length l (meters)</label>
              <input id={`${toolId}-length`} type="number" step="0.001" value={coilLength} onChange={(e) => setCoilLength(e.target.value)} placeholder="6.5" aria-label="Voice coil wire length in meters" className="input-field" />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">Coil Diameter (mm)</label>
                <input id={`${toolId}-diameter`} type="number" step="0.1" value={coilDiameter} onChange={(e) => setCoilDiameter(e.target.value)} placeholder="50" aria-label="Voice coil diameter in mm" className="input-field" />
              </div>
              <div>
                <label htmlFor={`${toolId}-turns`} className="block text-sm font-medium text-gray-700 mb-1">Number of Turns</label>
                <input id={`${toolId}-turns`} type="number" step="1" value={turns} onChange={(e) => setTurns(e.target.value)} placeholder="40" aria-label="Number of coil turns" className="input-field" />
              </div>
            </>
          )}
        </div>
        <button onClick={calculate} className="btn-primary mt-3" aria-label="Calculate BL product">
          Calculate BL Product
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">BL Product Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
