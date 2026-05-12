'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SolarPanelOutputCalculator - Calculate solar panel energy output.
 * Estimates daily and annual energy production based on panel specs and location.
 */
export default function SolarPanelOutputCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [panelWattage, setPanelWattage] = useState('400');
  const [numPanels, setNumPanels] = useState('10');
  const [sunHours, setSunHours] = useState('5');
  const [efficiency, setEfficiency] = useState('80');
  const [electricityRate, setElectricityRate] = useState('0.12');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const watts = parseFloat(panelWattage) || 0;
    const panels = parseInt(numPanels) || 0;
    const hours = parseFloat(sunHours) || 0;
    const eff = parseFloat(efficiency) / 100 || 0.8;
    const rate = parseFloat(electricityRate) || 0.12;

    const totalCapacity = watts * panels;
    const dailyOutput = (totalCapacity * hours * eff) / 1000; // kWh
    const monthlyOutput = dailyOutput * 30;
    const annualOutput = dailyOutput * 365;
    const dailySavings = dailyOutput * rate;
    const monthlySavings = monthlyOutput * rate;
    const annualSavings = annualOutput * rate;

    const lines = [
      `━━━ System Specifications ━━━`,
      `Panel Wattage: ${watts} W`,
      `Number of Panels: ${panels}`,
      `Total System Capacity: ${(totalCapacity / 1000).toFixed(2)} kW`,
      `Peak Sun Hours/Day: ${hours} h`,
      `System Efficiency: ${(eff * 100).toFixed(0)}%`,
      ``,
      `━━━ Energy Production ━━━`,
      `Daily Output: ${dailyOutput.toFixed(2)} kWh`,
      `Monthly Output: ${monthlyOutput.toFixed(1)} kWh`,
      `Annual Output: ${annualOutput.toFixed(0)} kWh`,
      ``,
      `━━━ Cost Savings (at $${rate}/kWh) ━━━`,
      `Daily Savings: $${dailySavings.toFixed(2)}`,
      `Monthly Savings: $${monthlySavings.toFixed(2)}`,
      `Annual Savings: $${annualSavings.toFixed(2)}`,
      ``,
      `━━━ Environmental Impact ━━━`,
      `CO₂ Offset (annual): ${(annualOutput * 0.42).toFixed(0)} kg`,
      `Equivalent Trees Planted: ${Math.round(annualOutput * 0.42 / 21)}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-wattage`} className="block text-sm font-medium text-gray-700 mb-1">Panel Wattage (W)</label>
            <input id={`${toolId}-wattage`} type="number" value={panelWattage} onChange={(e) => setPanelWattage(e.target.value)} className="input-field" aria-label={`Panel wattage for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-panels`} className="block text-sm font-medium text-gray-700 mb-1">Number of Panels</label>
            <input id={`${toolId}-panels`} type="number" value={numPanels} onChange={(e) => setNumPanels(e.target.value)} className="input-field" aria-label="Number of panels" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sun`} className="block text-sm font-medium text-gray-700 mb-1">Peak Sun Hours/Day</label>
            <input id={`${toolId}-sun`} type="number" step="0.1" value={sunHours} onChange={(e) => setSunHours(e.target.value)} className="input-field" aria-label="Peak sun hours per day" />
          </div>
          <div>
            <label htmlFor={`${toolId}-eff`} className="block text-sm font-medium text-gray-700 mb-1">System Efficiency (%)</label>
            <input id={`${toolId}-eff`} type="number" min={1} max={100} value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="input-field" aria-label="System efficiency percentage" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Electricity Rate ($/kWh)</label>
            <input id={`${toolId}-rate`} type="number" step="0.01" value={electricityRate} onChange={(e) => setElectricityRate(e.target.value)} className="input-field" aria-label="Electricity rate per kWh" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Output</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Solar Panel Output Estimate</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
