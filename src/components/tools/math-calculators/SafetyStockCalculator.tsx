'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SafetyStockCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [avgDemand, setAvgDemand] = useState('');
  const [maxDemand, setMaxDemand] = useState('');
  const [avgLeadTime, setAvgLeadTime] = useState('');
  const [maxLeadTime, setMaxLeadTime] = useState('');
  const [serviceLevel, setServiceLevel] = useState('95');
  const [output, setOutput] = useState('');

  const getZScore = (level: number): number => {
    const zScores: Record<number, number> = { 90: 1.28, 95: 1.65, 97: 1.88, 99: 2.33, 99.9: 3.09 };
    return zScores[level] || 1.65;
  };

  const calculate = () => {
    const avgD = parseFloat(avgDemand);
    const maxD = parseFloat(maxDemand);
    const avgLT = parseFloat(avgLeadTime);
    const maxLT = parseFloat(maxLeadTime);
    const sl = parseFloat(serviceLevel);

    if (isNaN(avgD) || isNaN(maxD) || isNaN(avgLT) || isNaN(maxLT)) {
      setOutput('Please enter all required values.');
      return;
    }

    // Basic method: (Max Daily Usage × Max Lead Time) - (Avg Daily Usage × Avg Lead Time)
    const safetyStockBasic = (maxD * maxLT) - (avgD * avgLT);

    // Statistical method using Z-score
    const zScore = getZScore(sl);
    const demandStdDev = (maxD - avgD) / 3; // approximate
    const leadTimeStdDev = (maxLT - avgLT) / 3; // approximate
    const safetyStockStat = zScore * Math.sqrt(
      (avgLT * Math.pow(demandStdDev, 2)) + (Math.pow(avgD, 2) * Math.pow(leadTimeStdDev, 2))
    );

    const reorderPoint = (avgD * avgLT) + safetyStockStat;

    const lines = [
      `=== Safety Stock Calculation ===`,
      ``,
      `Inputs:`,
      `  Average Daily Demand: ${avgD} units`,
      `  Maximum Daily Demand: ${maxD} units`,
      `  Average Lead Time: ${avgLT} days`,
      `  Maximum Lead Time: ${maxLT} days`,
      `  Service Level: ${sl}% (Z-score: ${zScore})`,
      ``,
      `--- Basic Method ---`,
      `Safety Stock: ${safetyStockBasic.toFixed(0)} units`,
      `Formula: (MaxDemand × MaxLT) - (AvgDemand × AvgLT)`,
      ``,
      `--- Statistical Method ---`,
      `Safety Stock: ${safetyStockStat.toFixed(0)} units`,
      `Reorder Point: ${reorderPoint.toFixed(0)} units`,
      ``,
      `Recommendation: Maintain at least ${Math.ceil(safetyStockStat)} units as safety stock`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-avgd`} className="block text-sm font-medium text-gray-700 mb-1">Avg Daily Demand</label>
            <input id={`${toolId}-avgd`} type="number" value={avgDemand} onChange={(e) => setAvgDemand(e.target.value)} className="input-field" placeholder="e.g. 50" aria-label={`Average demand for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-maxd`} className="block text-sm font-medium text-gray-700 mb-1">Max Daily Demand</label>
            <input id={`${toolId}-maxd`} type="number" value={maxDemand} onChange={(e) => setMaxDemand(e.target.value)} className="input-field" placeholder="e.g. 80" aria-label="Maximum daily demand" />
          </div>
          <div>
            <label htmlFor={`${toolId}-avglt`} className="block text-sm font-medium text-gray-700 mb-1">Avg Lead Time (days)</label>
            <input id={`${toolId}-avglt`} type="number" value={avgLeadTime} onChange={(e) => setAvgLeadTime(e.target.value)} className="input-field" placeholder="e.g. 5" aria-label="Average lead time" />
          </div>
          <div>
            <label htmlFor={`${toolId}-maxlt`} className="block text-sm font-medium text-gray-700 mb-1">Max Lead Time (days)</label>
            <input id={`${toolId}-maxlt`} type="number" value={maxLeadTime} onChange={(e) => setMaxLeadTime(e.target.value)} className="input-field" placeholder="e.g. 8" aria-label="Maximum lead time" />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-sl`} className="block text-sm font-medium text-gray-700 mb-1">Service Level</label>
          <select id={`${toolId}-sl`} value={serviceLevel} onChange={(e) => setServiceLevel(e.target.value)} className="input-field w-40" aria-label="Service level">
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="97">97%</option>
            <option value="99">99%</option>
          </select>
        </div>
        <button onClick={calculate} className="btn-primary mt-3">Calculate Safety Stock</button>
      </InputArea>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Safety Stock Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
