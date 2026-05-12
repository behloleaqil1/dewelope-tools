'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DreamspellCalendarConverter - Convert Gregorian to Dreamspell/13 Moon calendar.
 * The Dreamspell calendar uses 13 moons of 28 days each plus a Day Out of Time.
 */
export default function DreamspellCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [output, setOutput] = useState('');

  const solarSeals = [
    'Red Dragon', 'White Wind', 'Blue Night', 'Yellow Seed', 'Red Serpent',
    'White World-Bridger', 'Blue Hand', 'Yellow Star', 'Red Moon', 'White Dog',
    'Blue Monkey', 'Yellow Human', 'Red Skywalker', 'White Wizard', 'Blue Eagle',
    'Yellow Warrior', 'Red Earth', 'White Mirror', 'Blue Storm', 'Yellow Sun',
  ];

  const galacticTones = [
    'Magnetic', 'Lunar', 'Electric', 'Self-Existing', 'Overtone',
    'Rhythmic', 'Resonant', 'Galactic', 'Solar', 'Planetary',
    'Spectral', 'Crystal', 'Cosmic',
  ];

  const moonNames = [
    'Magnetic Moon', 'Lunar Moon', 'Electric Moon', 'Self-Existing Moon',
    'Overtone Moon', 'Rhythmic Moon', 'Resonant Moon', 'Galactic Moon',
    'Solar Moon', 'Planetary Moon', 'Spectral Moon', 'Crystal Moon', 'Cosmic Moon',
  ];

  const calculate = () => {
    if (!dateInput) {
      setOutput('Please select a date.');
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setOutput('Invalid date.');
      return;
    }

    // Dreamspell year starts July 26
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const day = date.getDate();

    // Calculate day of Dreamspell year (July 26 = day 1)
    let yearStart = new Date(year, 6, 26); // July 26 of current year
    if (date < yearStart) {
      yearStart = new Date(year - 1, 6, 26); // Previous year's July 26
    }

    const diffMs = date.getTime() - yearStart.getTime();
    const dayOfYear = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    // Check for Day Out of Time (July 25)
    const isDayOutOfTime = month === 6 && day === 25;

    let moonNumber = 0;
    let dayOfMoon = 0;

    if (isDayOutOfTime) {
      // Day Out of Time - not part of any moon
    } else if (dayOfYear <= 364) {
      moonNumber = Math.ceil(dayOfYear / 28);
      dayOfMoon = ((dayOfYear - 1) % 28) + 1;
    } else {
      // Leap day handling (Feb 29 in Gregorian = 0.0 Hunab Ku day)
      moonNumber = 0;
      dayOfMoon = 0;
    }

    // Calculate Kin number (1-260 Tzolkin cycle)
    // Reference: July 26, 2023 = Kin 64 (Yellow Crystal Seed)
    const refDate = new Date(2023, 6, 26);
    const refKin = 64;
    const daysDiff = Math.floor((date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
    let kin = ((refKin - 1 + daysDiff) % 260);
    if (kin < 0) kin += 260;
    kin += 1;

    const sealIndex = (kin - 1) % 20;
    const toneIndex = (kin - 1) % 13;

    const results: string[] = [];
    results.push('=== Dreamspell / 13 Moon Calendar ===');
    results.push('');
    results.push(`Gregorian Date: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    results.push('');

    if (isDayOutOfTime) {
      results.push('🌀 DAY OUT OF TIME');
      results.push('This day exists outside the 13 Moon calendar.');
      results.push('It is a day of celebration and forgiveness.');
    } else {
      results.push(`13 Moon Date: ${moonNames[moonNumber - 1] || 'Unknown'}, Day ${dayOfMoon}`);
      results.push(`Day of Year: ${dayOfYear} / 365`);
    }

    results.push('');
    results.push('--- Galactic Signature ---');
    results.push(`Kin: ${kin}`);
    results.push(`Tone: ${galacticTones[toneIndex]} (${toneIndex + 1})`);
    results.push(`Seal: ${solarSeals[sealIndex]}`);
    results.push(`Full Signature: ${galacticTones[toneIndex]} ${solarSeals[sealIndex]}`);
    results.push('');
    results.push('--- Wavespell ---');
    const wavespellStart = Math.floor((kin - 1) / 13) * 13 + 1;
    const wavespellSeal = solarSeals[(wavespellStart - 1) % 20];
    results.push(`Wavespell: ${wavespellSeal} (Kin ${wavespellStart}-${wavespellStart + 12})`);
    results.push(`Position in Wavespell: ${((kin - 1) % 13) + 1} / 13`);

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="input-field"
          aria-label={`Date input for ${toolName}`}
        />

        <button
          onClick={calculate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Convert to Dreamspell
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dreamspell Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
