'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function EarthAgeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [output, setOutput] = useState('');

  const calculate = () => {
    const earthAgeYears = 4.54e9; // 4.54 billion years
    const earthAgeMonths = earthAgeYears * 12;
    const earthAgeDays = earthAgeYears * 365.25;
    const earthAgeHours = earthAgeDays * 24;
    const earthAgeMinutes = earthAgeHours * 60;
    const earthAgeSeconds = earthAgeMinutes * 60;
    const earthAgeMilliseconds = earthAgeSeconds * 1000;

    // Fun comparisons
    const humanLifespan = 80;
    const humanLifetimes = earthAgeYears / humanLifespan;
    const moonOrbits = earthAgeDays / 27.3; // lunar orbital period
    const earthOrbits = earthAgeYears; // one orbit per year
    const daysInEarthAge = earthAgeDays;

    const formatNum = (n: number): string => {
      if (n >= 1e18) return (n / 1e18).toFixed(2) + ' quintillion';
      if (n >= 1e15) return (n / 1e15).toFixed(2) + ' quadrillion';
      if (n >= 1e12) return (n / 1e12).toFixed(2) + ' trillion';
      if (n >= 1e9) return (n / 1e9).toFixed(2) + ' billion';
      if (n >= 1e6) return (n / 1e6).toFixed(2) + ' million';
      return n.toLocaleString();
    };

    const results = [
      `Earth's Age Calculator`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `Earth's estimated age: 4.54 billion years`,
      `(Based on radiometric dating of meteorites)`,
      ``,
      `In Various Time Units:`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `  Years:        ${formatNum(earthAgeYears)}`,
      `  Months:       ${formatNum(earthAgeMonths)}`,
      `  Days:         ${formatNum(earthAgeDays)}`,
      `  Hours:        ${formatNum(earthAgeHours)}`,
      `  Minutes:      ${formatNum(earthAgeMinutes)}`,
      `  Seconds:      ${formatNum(earthAgeSeconds)}`,
      `  Milliseconds: ${formatNum(earthAgeMilliseconds)}`,
      ``,
      `Fun Comparisons:`,
      `━━━━━━━━━━━━━━━━`,
      `  Human lifetimes (80yr): ${formatNum(humanLifetimes)}`,
      `  Moon orbits:            ${formatNum(moonOrbits)}`,
      `  Earth orbits (sun):     ${formatNum(earthOrbits)}`,
      `  Total days:             ${formatNum(daysInEarthAge)}`,
      ``,
      `Timeline Milestones:`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `  4.54 Ga - Earth forms`,
      `  3.80 Ga - First life (prokaryotes)`,
      `  2.40 Ga - Great Oxidation Event`,
      `  0.54 Ga - Cambrian Explosion`,
      `  0.23 Ga - First dinosaurs`,
      `  0.066 Ga - Dinosaur extinction`,
      `  0.0003 Ga - Modern humans`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Calculate Earth&apos;s age (4.54 billion years) expressed in various time units with fun comparisons and timeline milestones.</p>
          <button onClick={calculate} className="btn-primary" aria-label={`Calculate for ${toolName}`}>Calculate Earth&apos;s Age</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
