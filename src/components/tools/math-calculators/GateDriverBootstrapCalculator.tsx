'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GateDriverBootstrapCalculator - Calculate bootstrap capacitor for gate drivers.
 */
export default function GateDriverBootstrapCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gateCharge, setGateCharge] = useState('');
  const [quiescentCurrent, setQuiescentCurrent] = useState('');
  const [frequency, setFrequency] = useState('');
  const [vcc, setVcc] = useState('12');
  const [vDiodeDrop, setVDiodeDrop] = useState('0.5');
  const [vMin, setVMin] = useState('10');
  const [safetyFactor, setSafetyFactor] = useState('10');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const Qg = parseFloat(gateCharge) * 1e-9; // nC to C
    const Iqbs = parseFloat(quiescentCurrent) * 1e-6; // µA to A
    const f = parseFloat(frequency) * 1e3; // kHz to Hz
    const Vcc = parseFloat(vcc);
    const Vd = parseFloat(vDiodeDrop);
    const Vmin = parseFloat(vMin);
    const sf = parseFloat(safetyFactor);

    if (isNaN(Qg) || isNaN(f) || f === 0) {
      setOutput('Please enter valid gate charge and frequency values.');
      return;
    }

    const tOn = 1 / f; // max on-time (worst case 100% duty)
    const Qleakage = Iqbs * tOn;
    const Qtotal = Qg + Qleakage;
    const deltaV = Vcc - Vd - Vmin;

    if (deltaV <= 0) {
      setOutput('Error: VCC - Vdiode must be greater than Vmin. Increase VCC or reduce Vmin.');
      return;
    }

    const Cboot = (Qtotal / deltaV) * sf;
    const CbootUf = Cboot * 1e6;
    const CbootNf = Cboot * 1e9;

    const results = [
      '=== Bootstrap Capacitor Calculation ===',
      '',
      `Gate Charge (Qg): ${gateCharge} nC`,
      `Quiescent Current (Iqbs): ${quiescentCurrent || '0'} µA`,
      `Switching Frequency: ${frequency} kHz`,
      `VCC Supply: ${Vcc} V`,
      `Diode Forward Drop: ${Vd} V`,
      `Min Bootstrap Voltage: ${Vmin} V`,
      `Safety Factor: ${sf}x`,
      '',
      '--- Results ---',
      '',
      `Total Charge Required: ${(Qtotal * 1e9).toFixed(2)} nC`,
      `Available Voltage Swing (ΔV): ${deltaV.toFixed(2)} V`,
      `Minimum Bootstrap Capacitor: ${CbootNf.toFixed(2)} nF (${CbootUf.toFixed(4)} µF)`,
      '',
      `Recommended Value: ${CbootUf >= 0.1 ? (Math.ceil(CbootUf * 10) / 10).toFixed(1) + ' µF' : (Math.ceil(CbootNf / 10) * 10) + ' nF'}`,
      '',
      '--- Notes ---',
      '• Use a low-ESR ceramic capacitor (X5R or X7R)',
      '• Place capacitor close to the bootstrap pin',
      '• Use a fast-recovery diode for the bootstrap circuit',
      `• Actual duty cycle < 100% provides more refresh time`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gate Charge Qg (nC)</label>
              <input type="number" value={gateCharge} onChange={e => setGateCharge(e.target.value)} className="input-field" placeholder="e.g. 50" aria-label="Gate charge in nanocoulombs" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quiescent Current (µA)</label>
              <input type="number" value={quiescentCurrent} onChange={e => setQuiescentCurrent(e.target.value)} className="input-field" placeholder="e.g. 100" aria-label="Quiescent current in microamps" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Switching Frequency (kHz)</label>
              <input type="number" value={frequency} onChange={e => setFrequency(e.target.value)} className="input-field" placeholder="e.g. 100" aria-label="Switching frequency in kHz" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VCC Supply (V)</label>
              <input type="number" value={vcc} onChange={e => setVcc(e.target.value)} className="input-field" aria-label="VCC supply voltage" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diode Drop (V)</label>
              <input type="number" value={vDiodeDrop} onChange={e => setVDiodeDrop(e.target.value)} className="input-field" step="0.1" aria-label="Diode forward voltage drop" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Vboot (V)</label>
              <input type="number" value={vMin} onChange={e => setVMin(e.target.value)} className="input-field" aria-label="Minimum bootstrap voltage" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Safety Factor</label>
              <input type="number" value={safetyFactor} onChange={e => setSafetyFactor(e.target.value)} className="input-field" aria-label="Safety factor multiplier" />
            </div>
          </div>

          <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium" aria-label={`Calculate ${toolName}`}>
            Calculate Bootstrap Capacitor
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Calculation Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
