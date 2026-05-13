'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MosfetGateDriverCalculator - Calculate MOSFET gate charge and driver requirements.
 * Computes gate drive current, power loss, and switching times.
 */
export default function MosfetGateDriverCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [totalGateCharge, setTotalGateCharge] = useState('');
  const [gateVoltage, setGateVoltage] = useState('10');
  const [switchingFreq, setSwitchingFreq] = useState('');
  const [riseTime, setRiseTime] = useState('');
  const [fallTime, setFallTime] = useState('');
  const [gateResistance, setGateResistance] = useState('');
  const [gateThreshold, setGateThreshold] = useState('');
  const [numMosfets, setNumMosfets] = useState('1');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const qg = parseFloat(totalGateCharge); // nC
    const vgs = parseFloat(gateVoltage);
    const fSw = parseFloat(switchingFreq); // kHz
    const tRise = parseFloat(riseTime || '0'); // ns
    const tFall = parseFloat(fallTime || '0'); // ns
    const rGate = parseFloat(gateResistance || '0'); // Ω
    const vth = parseFloat(gateThreshold || '0');
    const nMos = parseInt(numMosfets) || 1;

    if (isNaN(qg) || isNaN(vgs) || isNaN(fSw)) {
      setOutput('Please enter gate charge (Qg), gate voltage (Vgs), and switching frequency.');
      return;
    }

    const qgTotal = qg * nMos; // nC
    const fSwHz = fSw * 1000; // Hz

    // Gate drive current: Ig = Qg * f
    const igAvg = (qgTotal * 1e-9) * fSwHz; // A
    // Gate drive power: Pg = Qg * Vgs * f
    const pgDrive = (qgTotal * 1e-9) * vgs * fSwHz; // W

    // Peak gate current (if rise/fall time given)
    let igPeakRise = 0;
    let igPeakFall = 0;
    if (tRise > 0) {
      igPeakRise = (qgTotal * 1e-9) / (tRise * 1e-9); // A
    }
    if (tFall > 0) {
      igPeakFall = (qgTotal * 1e-9) / (tFall * 1e-9); // A
    }

    // Gate capacitance estimate: Ciss ≈ Qg / Vgs
    const ciss = (qgTotal * 1e-9) / vgs; // F

    // Time constant with gate resistor
    let tauRC = 0;
    if (rGate > 0) {
      tauRC = rGate * ciss; // seconds
    }

    // Power dissipated in gate resistor
    if (rGate > 0) {
      // Simplified: P = 0.5 * Ciss * Vgs^2 * f (for each transition)
      // Total switching power (shared between driver and Rg)
    }

    let result = '=== MOSFET Gate Driver Requirements ===\n\n';
    result += `--- Input Parameters ---\n`;
    result += `Total Gate Charge (Qg):  ${qg} nC${nMos > 1 ? ` × ${nMos} = ${qgTotal} nC` : ''}\n`;
    result += `Gate Drive Voltage:      ${vgs} V\n`;
    result += `Switching Frequency:     ${fSw} kHz (${fSwHz.toLocaleString()} Hz)\n`;
    if (rGate > 0) result += `Gate Resistance:         ${rGate} Ω\n`;
    if (vth > 0) result += `Gate Threshold (Vth):    ${vth} V\n`;
    if (nMos > 1) result += `Number of MOSFETs:       ${nMos}\n`;

    result += `\n--- Gate Drive Requirements ---\n`;
    result += `Average Gate Current:    ${(igAvg * 1000).toFixed(3)} mA\n`;
    result += `Gate Drive Power:        ${(pgDrive * 1000).toFixed(3)} mW\n`;
    result += `Gate Capacitance (est):  ${(ciss * 1e12).toFixed(1)} pF\n`;

    if (tRise > 0) {
      result += `\n--- Switching Times ---\n`;
      result += `Rise Time:               ${tRise} ns\n`;
      result += `Peak Current (turn-on):  ${igPeakRise.toFixed(3)} A (${(igPeakRise * 1000).toFixed(1)} mA)\n`;
    }
    if (tFall > 0) {
      result += `Fall Time:               ${tFall} ns\n`;
      result += `Peak Current (turn-off): ${igPeakFall.toFixed(3)} A (${(igPeakFall * 1000).toFixed(1)} mA)\n`;
    }

    if (rGate > 0) {
      result += `\n--- Gate Resistor Analysis ---\n`;
      result += `RC Time Constant:        ${(tauRC * 1e9).toFixed(2)} ns\n`;
      result += `Gate Power (Ciss×V²×f):  ${(ciss * vgs * vgs * fSwHz * 1000).toFixed(3)} mW\n`;
    }

    result += `\n--- Driver Selection Guide ---\n`;
    const peakCurrent = Math.max(igPeakRise, igPeakFall, igAvg * 10);
    if (peakCurrent > 4) {
      result += `• Need high-current driver (>4A peak): e.g., UCC27524, MCP14700\n`;
    } else if (peakCurrent > 1) {
      result += `• Need medium-current driver (1-4A peak): e.g., TC4427, IR2110\n`;
    } else {
      result += `• Low-current driver sufficient (<1A): e.g., MCP1407, TPS2829\n`;
    }
    if (fSw > 500) {
      result += `• High frequency (${fSw} kHz) - minimize gate resistance for fast switching\n`;
    }
    if (pgDrive > 0.1) {
      result += `• Significant gate drive power (${(pgDrive * 1000).toFixed(1)} mW) - ensure driver thermal rating\n`;
    }

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-qg`} className="block text-sm font-medium text-gray-700 mb-1">Total Gate Charge Qg (nC)</label>
              <input id={`${toolId}-qg`} type="number" step="0.1" value={totalGateCharge} onChange={(e) => setTotalGateCharge(e.target.value)} placeholder="25" className="input-field" aria-label={`Gate charge for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-vgs`} className="block text-sm font-medium text-gray-700 mb-1">Gate Voltage Vgs (V)</label>
              <input id={`${toolId}-vgs`} type="number" step="0.5" value={gateVoltage} onChange={(e) => setGateVoltage(e.target.value)} placeholder="10" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Switching Frequency (kHz)</label>
              <input id={`${toolId}-freq`} type="number" step="1" value={switchingFreq} onChange={(e) => setSwitchingFreq(e.target.value)} placeholder="100" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-nmos`} className="block text-sm font-medium text-gray-700 mb-1">Number of MOSFETs</label>
              <input id={`${toolId}-nmos`} type="number" min="1" max="20" value={numMosfets} onChange={(e) => setNumMosfets(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-trise`} className="block text-sm font-medium text-gray-700 mb-1">Desired Rise Time (ns)</label>
              <input id={`${toolId}-trise`} type="number" step="1" value={riseTime} onChange={(e) => setRiseTime(e.target.value)} placeholder="20" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-tfall`} className="block text-sm font-medium text-gray-700 mb-1">Desired Fall Time (ns)</label>
              <input id={`${toolId}-tfall`} type="number" step="1" value={fallTime} onChange={(e) => setFallTime(e.target.value)} placeholder="15" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-rg`} className="block text-sm font-medium text-gray-700 mb-1">Gate Resistance (Ω)</label>
              <input id={`${toolId}-rg`} type="number" step="0.1" value={gateResistance} onChange={(e) => setGateResistance(e.target.value)} placeholder="4.7" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-vth`} className="block text-sm font-medium text-gray-700 mb-1">Gate Threshold Vth (V)</label>
              <input id={`${toolId}-vth`} type="number" step="0.1" value={gateThreshold} onChange={(e) => setGateThreshold(e.target.value)} placeholder="2.5" className="input-field" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Calculate Driver Requirements</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">MOSFET Gate Driver Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
