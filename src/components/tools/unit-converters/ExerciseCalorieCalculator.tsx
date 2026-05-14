'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ExerciseCalorieCalculator - Calculate calories burned during exercise.
 */
export default function ExerciseCalorieCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [weight, setWeight] = useState('70');
  const [duration, setDuration] = useState('30');
  const [exercise, setExercise] = useState('running');

  // MET values for common exercises
  const exercises: Record<string, { name: string; met: number }> = {
    running: { name: 'Running (8 km/h)', met: 8.3 },
    running_fast: { name: 'Running (12 km/h)', met: 11.5 },
    walking: { name: 'Walking (5 km/h)', met: 3.5 },
    cycling: { name: 'Cycling (moderate)', met: 6.8 },
    swimming: { name: 'Swimming (moderate)', met: 7.0 },
    yoga: { name: 'Yoga', met: 3.0 },
    weightlifting: { name: 'Weight Lifting', met: 5.0 },
    hiit: { name: 'HIIT', met: 12.0 },
    dancing: { name: 'Dancing', met: 5.5 },
    rowing: { name: 'Rowing', met: 7.0 },
    jump_rope: { name: 'Jump Rope', met: 11.0 },
    elliptical: { name: 'Elliptical', met: 5.0 },
    stair_climbing: { name: 'Stair Climbing', met: 9.0 },
    basketball: { name: 'Basketball', met: 6.5 },
    tennis: { name: 'Tennis', met: 7.3 },
  };

  const calculate = (): string => {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    if (isNaN(w) || isNaN(d) || w <= 0 || d <= 0) return '';

    const ex = exercises[exercise];
    if (!ex) return '';

    // Calories = MET × weight(kg) × duration(hours)
    const hours = d / 60;
    const calories = ex.met * w * hours;
    const caloriesPerMin = calories / d;

    // Compare with other exercises
    const comparisons = Object.entries(exercises)
      .filter(([key]) => key !== exercise)
      .slice(0, 5)
      .map(([, e]) => {
        const cal = e.met * w * hours;
        return `  ${e.name}: ${cal.toFixed(0)} cal`;
      });

    return `Exercise: ${ex.name}\nDuration: ${d} minutes\nWeight: ${w} kg\nMET value: ${ex.met}\n\nCalories Burned: ${calories.toFixed(0)} kcal\nCalories/minute: ${caloriesPerMin.toFixed(1)}\n\nComparison (same duration):\n${comparisons.join('\n')}`;
  };

  const result = calculate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-exercise`} className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
        <select id={`${toolId}-exercise`} value={exercise} onChange={(e) => setExercise(e.target.value)} aria-label={`Exercise for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {Object.entries(exercises).map(([key, ex]) => (
            <option key={key} value={key}>{ex.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input id={`${toolId}-weight`} type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" aria-label={`Weight for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
          <input id={`${toolId}-duration`} type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30" aria-label={`Duration for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
