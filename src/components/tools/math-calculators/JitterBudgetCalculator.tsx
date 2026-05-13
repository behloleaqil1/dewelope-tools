'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function JitterBudgetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dataRate, setDataRate] = useState('10');
  const [txDj, setTxDj] = useState('15');
  const [txRj, setTxRj] = useState('3');
  const [channelDj, setChannelDj] = useState('20');
  const [channelIsi, setChannelIsi] = useState('30');
  const [rxDj, setRxDj] = useState('10');
  const [rxRj, setRxRj] = useState('2');
  const [targetBer, setTargetBer] = useState('1e-12');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const dr = parseFloat(dataRate);
    const tDj = parseFloat(txDj);
    const tRj = parseFloat(txRj);
    const cDj = parseFloat(channelDj);
    const cIsi = parseFloat(channelIsi);
    const rDj = parseFloat(rxDj);
    const rRj = parseFloat(rxRj);
    const ber = parseFloat(targetBer);

    if ([dr, tDj, tRj, cDj, cIsi, rDj, rRj].some(isNaN) || isNaN(ber)) {
      setOutput('Please enter valid numeric values.');
      return;
    }

    const ui = 1000 / dr; // Unit interval in ps

    // BER multiplier (N factor for dual-dirac model)
    const nFactor = ber <= 1e-15 ? 15.7 : ber <= 1e-12 ? 14.07 : ber <= 1e-10 ? 12.72 : 11.4;

    // Total deterministic jitter (linear sum)
    const totalDj = tDj + cDj + cIsi + rDj;

    // Total random jitter (RSS)
    const totalRjRms = Math.sqrt(tRj * tRj + rRj * rRj);
    const totalRjPp = nFactor * totalRjRms;

    // Total jitter
    const totalJitter = totalDj + totalRjPp;

    // Margin
    const margin = ui - totalJitter;
    const marginPercent = (margin / ui) * 100;

    // Budget breakdown percentages
    const txDjPercent = (tDj / ui) * 100;
    const channelDjPercent = ((cDj + cIsi) / ui) * 100;
    const rxDjPercent = (rDj / ui) * 100;
    const rjPercent = (totalRjPp / ui) * 100;

    const results = `Jitter Budget Analysis for ${dr} Gbps Serial Link
═══════════════════════════════════════════════════

Link Parameters:
  Data Rate:        ${dr} Gbps
  Unit Interval:    ${ui.toFixed(2)} ps
  Target BER:       ${targetBer}
  N Factor:         ${nFactor.toFixed(2)}

Transmitter Jitter:
  TX Deterministic Jitter (DJ): ${tDj.toFixed(2)} ps (${txDjPercent.toFixed(1)}% UI)
  TX Random Jitter (RJ rms):    ${tRj.toFixed(2)} ps

Channel Jitter:
  Channel DJ:                   ${cDj.toFixed(2)} ps
  Inter-Symbol Interference:    ${cIsi.toFixed(2)} ps
  Channel Total:                ${(cDj + cIsi).toFixed(2)} ps (${channelDjPercent.toFixed(1)}% UI)

Receiver Jitter:
  RX Deterministic Jitter (DJ): ${rDj.toFixed(2)} ps (${rxDjPercent.toFixed(1)}% UI)
  RX Random Jitter (RJ rms):    ${rRj.toFixed(2)} ps

Jitter Budget Summary:
  ┌─────────────────────────────────────────────┐
  │ Total DJ (linear sum):    ${totalDj.toFixed(2).padStart(8)} ps     │
  │ Total RJ (rms):           ${totalRjRms.toFixed(2).padStart(8)} ps     │
  │ Total RJ (peak-peak):     ${totalRjPp.toFixed(2).padStart(8)} ps     │
  │ Total Jitter (TJ):        ${totalJitter.toFixed(2).padStart(8)} ps     │
  │ Unit Interval:            ${ui.toFixed(2).padStart(8)} ps     │
  │ Timing Margin:            ${margin.toFixed(2).padStart(8)} ps     │
  │ Margin:                   ${marginPercent.toFixed(1).padStart(7)}%       │
  └─────────────────────────────────────────────┘

Assessment: ${margin > 0 ? '✓ PASS' : '✗ FAIL'} - ${margin > ui * 0.2 ? 'Comfortable margin' : margin > 0 ? 'Tight margin, consider optimization' : 'Link will not meet BER target'}

Budget Allocation:
  TX DJ:      ${'█'.repeat(Math.round(txDjPercent / 2))}${'░'.repeat(Math.max(0, 50 - Math.round(txDjPercent / 2)))} ${txDjPercent.toFixed(1)}%
  Channel:    ${'█'.repeat(Math.round(channelDjPercent / 2))}${'░'.repeat(Math.max(0, 50 - Math.round(channelDjPercent / 2)))} ${channelDjPercent.toFixed(1)}%
  RX DJ:      ${'█'.repeat(Math.round(rxDjPercent / 2))}${'░'.repeat(Math.max(0, 50 - Math.round(rxDjPercent / 2)))} ${rxDjPercent.toFixed(1)}%
  RJ (p-p):   ${'█'.repeat(Math.round(rjPercent / 2))}${'░'.repeat(Math.max(0, 50 - Math.round(rjPercent / 2)))} ${rjPercent.toFixed(1)}%
  Margin:     ${'█'.repeat(Math.max(0, Math.round(marginPercent / 2)))}${'░'.repeat(Math.max(0, 50 - Math.max(0, Math.round(marginPercent / 2))))} ${marginPercent.toFixed(1)}%`;

    setOutput(results);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Data Rate (Gbps)</label>
            <input id={`${toolId}-rate`} type="number" value={dataRate} onChange={(e) => setDataRate(e.target.value)} className="input-field" aria-label={`Data rate for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-ber`} className="block text-sm font-medium text-gray-700 mb-1">Target BER</label>
            <select id={`${toolId}-ber`} value={targetBer} onChange={(e) => setTargetBer(e.target.value)} className="input-field" aria-label="Target BER">
              <option value="1e-9">1e-9</option>
              <option value="1e-10">1e-10</option>
              <option value="1e-12">1e-12</option>
              <option value="1e-15">1e-15</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-txdj`} className="block text-sm font-medium text-gray-700 mb-1">TX DJ (ps)</label>
            <input id={`${toolId}-txdj`} type="number" value={txDj} onChange={(e) => setTxDj(e.target.value)} className="input-field" aria-label="TX deterministic jitter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-txrj`} className="block text-sm font-medium text-gray-700 mb-1">TX RJ rms (ps)</label>
            <input id={`${toolId}-txrj`} type="number" value={txRj} onChange={(e) => setTxRj(e.target.value)} className="input-field" aria-label="TX random jitter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cdj`} className="block text-sm font-medium text-gray-700 mb-1">Channel DJ (ps)</label>
            <input id={`${toolId}-cdj`} type="number" value={channelDj} onChange={(e) => setChannelDj(e.target.value)} className="input-field" aria-label="Channel deterministic jitter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-isi`} className="block text-sm font-medium text-gray-700 mb-1">Channel ISI (ps)</label>
            <input id={`${toolId}-isi`} type="number" value={channelIsi} onChange={(e) => setChannelIsi(e.target.value)} className="input-field" aria-label="Channel ISI" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rxdj`} className="block text-sm font-medium text-gray-700 mb-1">RX DJ (ps)</label>
            <input id={`${toolId}-rxdj`} type="number" value={rxDj} onChange={(e) => setRxDj(e.target.value)} className="input-field" aria-label="RX deterministic jitter" />
          </div>
          <div>
            <label htmlFor={`${toolId}-rxrj`} className="block text-sm font-medium text-gray-700 mb-1">RX RJ rms (ps)</label>
            <input id={`${toolId}-rxrj`} type="number" value={rxRj} onChange={(e) => setRxRj(e.target.value)} className="input-field" aria-label="RX random jitter" />
          </div>
        </div>
        <button onClick={calculate} className="btn-primary mt-4">Calculate Jitter Budget</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Jitter Budget Analysis</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
