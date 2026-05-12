'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LedResistorCalculator - Calculate LED current-limiting resistor value.
 * Uses Ohm's law: R = (Vsource - Vled) / Iled
 */
export default function LedResistorCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [supplyVoltage, setSupplyVoltage] = useState('5');
  const [ledVoltage, setLedVoltage] = useState('2.0');
  const [ledCurrent, setLedCurrent] = useState('20');
  const [ledCount, setLedCount] = useState('1');
  const [connection, setConnection] = useState<'series' | 'parallel'>('series');
  const [output, setOutput] = useState('');

  const standardResistors = [
    10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82,
    100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820,
    1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200,
    10000, 15000, 22000, 33000, 47000, 68000, 100000,
  ];

  const findNearestStandard = (value: number): number => {
    let nearest = standardResistors[0];
    let minDiff = Math.abs(value - nearest);
    for (const r of standardResistors) {
      const diff = Math.abs(value - r);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = r;
      }
    }
    return nearest;
  };

  const formatResistance = (ohms: number): string => {
    if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(1)} MΩ`;
    if (ohms >= 1000) return `${(ohms / 1000).toFixed(1)} kΩ`;
    return `${ohms.toFixed(1)} Ω`;
  };

  const calculate = () => {
    const vs = parseFloat(supplyVoltage);
    const vled = parseFloat(ledVoltage);
    const iled = parseFloat(ledCurrent) / 1000; // mA to A
    const count = parseInt(ledCount) || 1;

    if (isNaN(vs) || isNaN(vled) || isNaN(iled) || iled <= 0) {
      setOutput('Please enter valid values.');
      return;
    }

    let totalVled: number;
    let totalCurrent: number;

    if (connection === 'series') {
      totalVled = vled * count;
      totalCurrent = iled;
    } else {
      totalVled = vled;
      totalCurrent = iled * count;
    }

    if (vs <= totalVled) {
      setOutput(`Error: Supply voltage (${vs}V) must be greater than total LED voltage drop (${totalVled}V).`);
      return;
    }

    const resistance = (vs - totalVled) / totalCurrent;
    const nearestStd = findNearestStandard(resistance);
    const actualCurrent = (vs - totalVled) / nearestStd;
    const powerDissipation = Math.pow(actualCurrent, 2) * nearestStd;

    const lines = [
      `Calculated Resistance: ${formatResistance(resistance)}`,
      `Nearest Standard Value: ${formatResistance(nearestStd)}`,
      ``,
      `With ${formatResistance(nearestStd)} resistor:`,
      `  Actual Current: ${(actualCurrent * 1000).toFixed(2)} mA`,
      `  Power Dissipation: ${(powerDissipation * 1000).toFixed(2)} mW`,
      `  Minimum Resistor Rating: ${powerDissipation < 0.125 ? '1/8W' : powerDissipation < 0.25 ? '1/4W' : powerDissipation < 0.5 ? '1/2W' : '1W'}`,
      ``,
      `Configuration: ${count} LED${count > 1 ? 's' : ''} in ${connection}`,
      `Formula: R = (${vs}V - ${totalVled}V) / ${(totalCurrent * 1000).toFixed(1)}mA`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-vs`} className="block text-sm font-medium text-gray-700 mb-1">Supply Voltage (V)</label>
            <input id={`${toolId}-vs`} type="number" step="0.1" value={supplyVoltage} onChange={(e) => setSupplyVoltage(e.target.value)} placeholder="5" aria-label={`Supply voltage for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-vled`} className="block text-sm font-medium text-gray-700 mb-1">LED Forward Voltage (V)</label>
            <input id={`${toolId}-vled`} type="number" step="0.1" value={ledVoltage} onChange={(e) => setLedVoltage(e.target.value)} placeholder="2.0" aria-label="LED forward voltage" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-iled`} className="block text-sm font-medium text-gray-700 mb-1">LED Current (mA)</label>
            <input id={`${toolId}-iled`} type="number" step="1" value={ledCurrent} onChange={(e) => setLedCurrent(e.target.value)} placeholder="20" aria-label="LED current in milliamps" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of LEDs</label>
            <input id={`${toolId}-count`} type="number" min="1" value={ledCount} onChange={(e) => setLedCount(e.target.value)} placeholder="1" aria-label="Number of LEDs" className="input-field" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`${toolId}-conn`} className="block text-sm font-medium text-gray-700 mb-1">Connection Type</label>
          <select id={`${toolId}-conn`} value={connection} onChange={(e) => setConnection(e.target.value as 'series' | 'parallel')} aria-label="Connection type" className="input-field w-48">
            <option value="series">Series</option>
            <option value="parallel">Parallel</option>
          </select>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Resistor</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
