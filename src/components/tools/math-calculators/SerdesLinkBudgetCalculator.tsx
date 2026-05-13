'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SerdesLinkBudgetCalculator - Calculate SerDes high-speed link budget.
 * Computes total channel loss, margin, and eye opening for high-speed serial links.
 */
export default function SerdesLinkBudgetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dataRate, setDataRate] = useState('25');
  const [txAmplitude, setTxAmplitude] = useState('800');
  const [channelLoss, setChannelLoss] = useState('20');
  const [connectorLoss, setConnectorLoss] = useState('2');
  const [viaLoss, setViaLoss] = useState('1.5');
  const [txJitter, setTxJitter] = useState('15');
  const [rxSensitivity, setRxSensitivity] = useState('50');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const rate = parseFloat(dataRate);
    const txAmp = parseFloat(txAmplitude);
    const chLoss = parseFloat(channelLoss);
    const connLoss = parseFloat(connectorLoss);
    const vLoss = parseFloat(viaLoss);
    const jitter = parseFloat(txJitter);
    const rxSens = parseFloat(rxSensitivity);

    if ([rate, txAmp, chLoss, connLoss, vLoss, jitter, rxSens].some(isNaN)) {
      setOutput('Error: Please enter valid numeric values for all fields.');
      return;
    }

    const totalLoss = chLoss + connLoss + vLoss;
    const txAmpV = txAmp / 1000; // mV to V
    const rxSignal = txAmpV * Math.pow(10, -totalLoss / 20);
    const rxSignalMv = rxSignal * 1000;
    const margin = rxSignalMv - rxSens;
    const ui = 1e12 / (rate * 1e9); // Unit interval in ps
    const jitterRatio = jitter / ui * 100;
    const eyeWidth = ui - jitter;
    const eyeHeight = rxSignalMv * 2;

    const results = [
      `=== SerDes Link Budget Analysis ===`,
      `Data Rate: ${rate} Gbps`,
      `Unit Interval (UI): ${ui.toFixed(2)} ps`,
      ``,
      `--- Loss Budget ---`,
      `Channel Loss: ${chLoss} dB`,
      `Connector Loss: ${connLoss} dB`,
      `Via Loss: ${vLoss} dB`,
      `Total Insertion Loss: ${totalLoss.toFixed(2)} dB`,
      ``,
      `--- Signal Levels ---`,
      `TX Amplitude: ${txAmp} mVpp`,
      `RX Signal (after loss): ${rxSignalMv.toFixed(2)} mVpp`,
      `RX Sensitivity: ${rxSens} mV`,
      `Voltage Margin: ${margin.toFixed(2)} mV ${margin > 0 ? '✓' : '✗ FAIL'}`,
      ``,
      `--- Timing ---`,
      `TX Jitter: ${jitter} ps`,
      `Jitter as % of UI: ${jitterRatio.toFixed(1)}%`,
      `Eye Width: ${eyeWidth.toFixed(2)} ps`,
      `Eye Height: ${eyeHeight.toFixed(2)} mV`,
      ``,
      `--- Verdict ---`,
      margin > 0 && jitterRatio < 30 ? `✓ Link budget PASSES with ${margin.toFixed(1)} mV margin` : `✗ Link budget FAILS - ${margin <= 0 ? 'insufficient voltage margin' : 'excessive jitter'}`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">Data Rate (Gbps)</label>
              <input id={`${toolId}-rate`} type="number" value={dataRate} onChange={e => setDataRate(e.target.value)} className="input-field" aria-label={`Data rate for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-tx`} className="block text-sm font-medium text-gray-700 mb-1">TX Amplitude (mVpp)</label>
              <input id={`${toolId}-tx`} type="number" value={txAmplitude} onChange={e => setTxAmplitude(e.target.value)} className="input-field" aria-label="TX amplitude" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-ch`} className="block text-sm font-medium text-gray-700 mb-1">Channel Loss (dB)</label>
              <input id={`${toolId}-ch`} type="number" value={channelLoss} onChange={e => setChannelLoss(e.target.value)} className="input-field" aria-label="Channel loss" />
            </div>
            <div>
              <label htmlFor={`${toolId}-conn`} className="block text-sm font-medium text-gray-700 mb-1">Connector Loss (dB)</label>
              <input id={`${toolId}-conn`} type="number" value={connectorLoss} onChange={e => setConnectorLoss(e.target.value)} className="input-field" aria-label="Connector loss" />
            </div>
            <div>
              <label htmlFor={`${toolId}-via`} className="block text-sm font-medium text-gray-700 mb-1">Via Loss (dB)</label>
              <input id={`${toolId}-via`} type="number" value={viaLoss} onChange={e => setViaLoss(e.target.value)} className="input-field" aria-label="Via loss" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-jitter`} className="block text-sm font-medium text-gray-700 mb-1">TX Jitter (ps)</label>
              <input id={`${toolId}-jitter`} type="number" value={txJitter} onChange={e => setTxJitter(e.target.value)} className="input-field" aria-label="TX jitter" />
            </div>
            <div>
              <label htmlFor={`${toolId}-rx`} className="block text-sm font-medium text-gray-700 mb-1">RX Sensitivity (mV)</label>
              <input id={`${toolId}-rx`} type="number" value={rxSensitivity} onChange={e => setRxSensitivity(e.target.value)} className="input-field" aria-label="RX sensitivity" />
            </div>
          </div>
          <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]">Calculate Link Budget</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Link Budget Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
