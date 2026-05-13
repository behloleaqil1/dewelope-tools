'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SpeakerPortTuningCalculator - Calculate bass reflex port dimensions.
 * Computes port length for circular and rectangular ports given tuning frequency and box volume.
 */
export default function SpeakerPortTuningCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [tuningFreq, setTuningFreq] = useState('35');
  const [boxVolume, setBoxVolume] = useState('50');
  const [portDiameter, setPortDiameter] = useState('7.5');
  const [portShape, setPortShape] = useState('circular');
  const [portWidth, setPortWidth] = useState('10');
  const [portHeight, setPortHeight] = useState('5');
  const [numPorts, setNumPorts] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const fb = parseFloat(tuningFreq);
    const Vb = parseFloat(boxVolume) / 1000; // liters to m³
    const n = parseInt(numPorts) || 1;

    if (isNaN(fb) || isNaN(Vb) || fb <= 0 || Vb <= 0) {
      setOutput('Please enter valid positive values.');
      return;
    }

    let portArea: number;
    let portLabel: string;

    if (portShape === 'circular') {
      const d = parseFloat(portDiameter) / 100; // cm to m
      if (isNaN(d) || d <= 0) {
        setOutput('Please enter a valid port diameter.');
        return;
      }
      portArea = Math.PI * (d / 2) * (d / 2);
      portLabel = `Circular port: ${(d * 100).toFixed(1)} cm diameter`;
    } else {
      const w = parseFloat(portWidth) / 100; // cm to m
      const h = parseFloat(portHeight) / 100;
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
        setOutput('Please enter valid port dimensions.');
        return;
      }
      portArea = w * h;
      portLabel = `Rectangular port: ${(w * 100).toFixed(1)} × ${(h * 100).toFixed(1)} cm`;
    }

    const totalArea = portArea * n;

    // Port length formula: Lv = (23562.5 * Sv * n) / (fb² * Vb) - 0.732 * sqrt(Sv)
    // Using standard formula: L = (c² * S) / (4 * π² * fb² * Vb) - 0.825 * sqrt(S/π) for end correction
    const c = 343; // speed of sound m/s
    const Lv = (c * c * totalArea) / (4 * Math.PI * Math.PI * fb * fb * Vb) - 0.825 * Math.sqrt(portArea / Math.PI);

    // Air velocity check (recommended < 5% speed of sound at 1W)
    const _portVelocity = (Vb * 2 * Math.PI * fb) / totalArea; // simplified estimate

    // Minimum port diameter recommendation
    const minDiameter = Math.sqrt((4 * totalArea) / Math.PI) * 100;

    const results = [
      `═══ Bass Reflex Port Calculation ═══`,
      ``,
      `Tuning Frequency: ${fb} Hz`,
      `Box Volume: ${(Vb * 1000).toFixed(1)} liters`,
      `Number of Ports: ${n}`,
      `${portLabel}`,
      ``,
      `── Results ──`,
      `Port Length: ${(Lv * 100).toFixed(2)} cm (${(Lv * 100 / 2.54).toFixed(2)} inches)`,
      `Port Area (each): ${(portArea * 10000).toFixed(2)} cm²`,
      `Total Port Area: ${(totalArea * 10000).toFixed(2)} cm²`,
      ``,
      `── Recommendations ──`,
      `Min. equivalent diameter: ${minDiameter.toFixed(1)} cm`,
      Lv <= 0 ? `⚠️ Port length is negative — increase port area or lower tuning frequency.` : `✓ Port length is valid.`,
      ``,
      `── Notes ──`,
      `• End correction applied (one flanged, one free end)`,
      `• Keep port velocity below 17 m/s to avoid chuffing`,
      `• Flare port ends to reduce turbulence`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Tuning Frequency (Hz)</label>
              <input id={`${toolId}-freq`} type="number" value={tuningFreq} onChange={(e) => setTuningFreq(e.target.value)} className="input-field" aria-label="Tuning frequency" />
            </div>
            <div>
              <label htmlFor={`${toolId}-volume`} className="block text-sm font-medium text-gray-700 mb-1">Box Volume (liters)</label>
              <input id={`${toolId}-volume`} type="number" value={boxVolume} onChange={(e) => setBoxVolume(e.target.value)} className="input-field" aria-label="Box volume" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">Port Shape</label>
            <select id={`${toolId}-shape`} value={portShape} onChange={(e) => setPortShape(e.target.value)} className="input-field" aria-label="Port shape">
              <option value="circular">Circular</option>
              <option value="rectangular">Rectangular</option>
            </select>
          </div>
          {portShape === 'circular' ? (
            <div>
              <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">Port Diameter (cm)</label>
              <input id={`${toolId}-diameter`} type="number" value={portDiameter} onChange={(e) => setPortDiameter(e.target.value)} className="input-field" aria-label="Port diameter" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Port Width (cm)</label>
                <input id={`${toolId}-width`} type="number" value={portWidth} onChange={(e) => setPortWidth(e.target.value)} className="input-field" aria-label="Port width" />
              </div>
              <div>
                <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Port Height (cm)</label>
                <input id={`${toolId}-height`} type="number" value={portHeight} onChange={(e) => setPortHeight(e.target.value)} className="input-field" aria-label="Port height" />
              </div>
            </div>
          )}
          <div>
            <label htmlFor={`${toolId}-num-ports`} className="block text-sm font-medium text-gray-700 mb-1">Number of Ports</label>
            <input id={`${toolId}-num-ports`} type="number" value={numPorts} onChange={(e) => setNumPorts(e.target.value)} min="1" max="4" className="input-field" aria-label="Number of ports" />
          </div>
          <button onClick={calculate} className="btn-primary w-full">Calculate Port Length</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
