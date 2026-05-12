'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MonteCarloSimulator - Simple Monte Carlo simulation for probability estimation.
 * Supports common scenarios like dice rolls, coin flips, and custom probability events.
 */
export default function MonteCarloSimulator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [scenario, setScenario] = useState<'pi' | 'dice' | 'coin' | 'custom'>('pi');
  const [iterations, setIterations] = useState('10000');
  const [customProbability, setCustomProbability] = useState('0.5');
  const [customThreshold, setCustomThreshold] = useState('3');
  const [diceTarget, setDiceTarget] = useState('6');
  const [coinHeads, setCoinHeads] = useState('3');
  const [coinFlips, setCoinFlips] = useState('5');
  const [result, setResult] = useState<{ estimate: number; iterations: number; description: string } | null>(null);

  const simulate = () => {
    const n = Math.min(Math.max(parseInt(iterations) || 1000, 100), 1000000);

    let successes = 0;
    let description = '';

    switch (scenario) {
      case 'pi': {
        // Estimate Pi using random points in a unit square
        for (let i = 0; i < n; i++) {
          const x = Math.random();
          const y = Math.random();
          if (x * x + y * y <= 1) successes++;
        }
        const piEstimate = (successes / n) * 4;
        setResult({
          estimate: piEstimate,
          iterations: n,
          description: `π ≈ ${piEstimate.toFixed(6)} (actual: 3.141593). ${successes} of ${n} random points fell inside the quarter circle.`,
        });
        return;
      }
      case 'dice': {
        const target = parseInt(diceTarget) || 6;
        for (let i = 0; i < n; i++) {
          const roll = Math.floor(Math.random() * 6) + 1;
          if (roll === target) successes++;
        }
        description = `Rolling a ${target}: ${successes} successes out of ${n} rolls.`;
        break;
      }
      case 'coin': {
        const targetHeads = parseInt(coinHeads) || 3;
        const flips = parseInt(coinFlips) || 5;
        for (let i = 0; i < n; i++) {
          let heads = 0;
          for (let j = 0; j < flips; j++) {
            if (Math.random() < 0.5) heads++;
          }
          if (heads >= targetHeads) successes++;
        }
        description = `Getting ${targetHeads}+ heads in ${flips} flips: ${successes} successes out of ${n} trials.`;
        break;
      }
      case 'custom': {
        const prob = parseFloat(customProbability) || 0.5;
        const threshold = parseInt(customThreshold) || 3;
        for (let i = 0; i < n; i++) {
          let count = 0;
          for (let j = 0; j < 10; j++) {
            if (Math.random() < prob) count++;
          }
          if (count >= threshold) successes++;
        }
        description = `P(event)=${prob}, getting ${threshold}+ successes in 10 trials: ${successes} out of ${n} simulations.`;
        break;
      }
    }

    const probability = successes / n;
    setResult({
      estimate: probability,
      iterations: n,
      description,
    });
  };

  const copyText = result
    ? `Monte Carlo Simulation\nScenario: ${scenario}\nEstimated Probability: ${result.estimate.toFixed(6)}\nIterations: ${result.iterations}\n${result.description}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-scenario`} className="block text-sm font-medium text-gray-700 mb-1">
          Simulation Scenario
        </label>
        <select
          id={`${toolId}-scenario`}
          value={scenario}
          onChange={(e) => setScenario(e.target.value as 'pi' | 'dice' | 'coin' | 'custom')}
          aria-label={`Scenario for ${toolName}`}
          className="input-field"
        >
          <option value="pi">Estimate π (Pi)</option>
          <option value="dice">Dice Roll Probability</option>
          <option value="coin">Coin Flip Probability</option>
          <option value="custom">Custom Probability Event</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-iter`} className="block text-sm font-medium text-gray-700 mb-1">
          Number of Iterations (100 - 1,000,000)
        </label>
        <input
          id={`${toolId}-iter`}
          type="text"
          inputMode="numeric"
          value={iterations}
          onChange={(e) => setIterations(e.target.value)}
          placeholder="e.g., 10000"
          aria-label={`Iterations for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      {scenario === 'dice' && (
        <InputArea>
          <label htmlFor={`${toolId}-dice`} className="block text-sm font-medium text-gray-700 mb-1">
            Target Number (1-6)
          </label>
          <input
            id={`${toolId}-dice`}
            type="text"
            inputMode="numeric"
            value={diceTarget}
            onChange={(e) => setDiceTarget(e.target.value)}
            placeholder="e.g., 6"
            aria-label={`Dice target for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      )}

      {scenario === 'coin' && (
        <div className="space-y-3">
          <InputArea>
            <label htmlFor={`${toolId}-flips`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Flips
            </label>
            <input id={`${toolId}-flips`} type="text" inputMode="numeric" value={coinFlips} onChange={(e) => setCoinFlips(e.target.value)} placeholder="e.g., 5" aria-label={`Coin flips for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-heads`} className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Heads Required
            </label>
            <input id={`${toolId}-heads`} type="text" inputMode="numeric" value={coinHeads} onChange={(e) => setCoinHeads(e.target.value)} placeholder="e.g., 3" aria-label={`Min heads for ${toolName}`} className="input-field" />
          </InputArea>
        </div>
      )}

      {scenario === 'custom' && (
        <div className="space-y-3">
          <InputArea>
            <label htmlFor={`${toolId}-prob`} className="block text-sm font-medium text-gray-700 mb-1">
              Event Probability (0-1)
            </label>
            <input id={`${toolId}-prob`} type="text" inputMode="decimal" value={customProbability} onChange={(e) => setCustomProbability(e.target.value)} placeholder="e.g., 0.5" aria-label={`Probability for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea>
            <label htmlFor={`${toolId}-thresh`} className="block text-sm font-medium text-gray-700 mb-1">
              Success Threshold (out of 10 trials)
            </label>
            <input id={`${toolId}-thresh`} type="text" inputMode="numeric" value={customThreshold} onChange={(e) => setCustomThreshold(e.target.value)} placeholder="e.g., 3" aria-label={`Threshold for ${toolName}`} className="input-field" />
          </InputArea>
        </div>
      )}

      <button onClick={simulate} aria-label="Run simulation" className="btn-primary">
        Run Simulation
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {scenario === 'pi' ? result.estimate.toFixed(6) : (result.estimate * 100).toFixed(2) + '%'}
                </div>
                <div className="text-xs text-gray-500 mt-1">{scenario === 'pi' ? 'π Estimate' : 'Estimated Probability'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-800">{result.iterations.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">Iterations</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">{result.description}</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
