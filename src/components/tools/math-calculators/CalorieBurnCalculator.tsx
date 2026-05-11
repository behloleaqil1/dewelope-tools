'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CalorieBurnCalculator - Estimate calories burned based on activity, weight, and duration.
 * Uses MET (Metabolic Equivalent of Task) values for estimation.
 */

const ACTIVITIES = [
  { name: 'Walking (3.5 mph)', met: 4.3 },
  { name: 'Running (6 mph)', met: 9.8 },
  { name: 'Running (8 mph)', met: 11.8 },
  { name: 'Cycling (moderate)', met: 8.0 },
  { name: 'Cycling (vigorous)', met: 12.0 },
  { name: 'Swimming (moderate)', met: 7.0 },
  { name: 'Swimming (vigorous)', met: 10.0 },
  { name: 'Jump Rope', met: 12.3 },
  { name: 'Yoga', met: 3.0 },
  { name: 'Weight Training', met: 5.0 },
  { name: 'HIIT', met: 12.0 },
  { name: 'Dancing', met: 5.5 },
  { name: 'Hiking', met: 6.0 },
  { name: 'Rowing (moderate)', met: 7.0 },
  { name: 'Elliptical Trainer', met: 5.0 },
  { name: 'Stair Climbing', met: 9.0 },
];

export default function CalorieBurnCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [duration, setDuration] = useState('');
  const [activityIndex, setActivityIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ calories: number; activity: string; duration: number; weightKg: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }

    const d = parseFloat(duration);
    if (isNaN(d) || d <= 0) {
      newErrors.duration = 'Please enter a valid duration in minutes';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const weightKg = weightUnit === 'lbs' ? w * 0.453592 : w;
    const activity = ACTIVITIES[activityIndex];
    // Calories = MET × weight(kg) × duration(hours)
    const hours = d / 60;
    const calories = activity.met * weightKg * hours;

    setResult({
      calories,
      activity: activity.name,
      duration: d,
      weightKg,
    });
  };

  const copyText = result
    ? `Activity: ${result.activity}\nDuration: ${result.duration} minutes\nWeight: ${result.weightKg.toFixed(1)} kg\nCalories Burned: ${result.calories.toFixed(0)} kcal\nMET Value: ${ACTIVITIES[activityIndex].met}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.weight}>
          <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">Body Weight</label>
          <div className="flex gap-2">
            <input
              id={`${toolId}-weight`}
              type="text"
              inputMode="decimal"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                if (errors.weight) setErrors((prev) => ({ ...prev, weight: '' }));
              }}
              placeholder="e.g. 70"
              aria-label={`Body weight for ${toolName}`}
              className="input-field flex-1"
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
              className="input-field w-20 text-sm"
              aria-label="Weight unit"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-activity`} className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
          <select
            id={`${toolId}-activity`}
            value={activityIndex}
            onChange={(e) => setActivityIndex(parseInt(e.target.value))}
            className="input-field text-sm"
            aria-label="Activity selection"
          >
            {ACTIVITIES.map((act, i) => (
              <option key={i} value={i}>{act.name} (MET: {act.met})</option>
            ))}
          </select>
        </InputArea>

        <InputArea error={errors.duration}>
          <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input
            id={`${toolId}-duration`}
            type="text"
            inputMode="decimal"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' }));
            }}
            placeholder="e.g. 30"
            aria-label="Exercise duration in minutes"
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate calories burned" className="btn-primary">
        Calculate Calories
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-orange-600">{result.calories.toFixed(0)}</div>
              <div className="text-xs text-gray-500 mt-1">Calories Burned (kcal)</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Formula: MET × Weight(kg) × Duration(hours) = {ACTIVITIES[activityIndex].met} × {result.weightKg.toFixed(1)} × {(result.duration / 60).toFixed(3)} = {result.calories.toFixed(1)} kcal
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
