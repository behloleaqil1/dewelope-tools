'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: string;
}

/**
 * GpaCalculator - Calculates GPA from course grades and credit hours.
 * Supports standard 4.0 scale with A through F grades including +/- modifiers.
 */
export default function GpaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', grade: 'A', credits: '3' },
    { id: 2, name: '', grade: 'B+', credits: '3' },
    { id: 3, name: '', grade: 'A-', credits: '4' },
  ]);
  const [result, setResult] = useState<{ gpa: number; totalCredits: number; totalPoints: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const GRADE_POINTS: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  };

  let nextId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;

  function addCourse() {
    setCourses([...courses, { id: nextId++, name: '', grade: 'A', credits: '3' }]);
  }

  function removeCourse(id: number) {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  }

  function updateCourse(id: number, field: keyof Course, value: string) {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function calculate() {
    setError(undefined);
    setResult(null);

    let totalCredits = 0;
    let totalPoints = 0;

    for (const course of courses) {
      const credits = parseFloat(course.credits);
      if (isNaN(credits) || credits <= 0) {
        setError('All courses must have valid credit hours greater than 0');
        return;
      }
      const points = GRADE_POINTS[course.grade];
      if (points === undefined) {
        setError(`Invalid grade: ${course.grade}`);
        return;
      }
      totalCredits += credits;
      totalPoints += points * credits;
    }

    if (totalCredits === 0) {
      setError('Total credits cannot be zero');
      return;
    }

    setResult({ gpa: totalPoints / totalCredits, totalCredits, totalPoints });
  }

  const copyText = result
    ? `GPA: ${result.gpa.toFixed(2)} / 4.00\nTotal Credits: ${result.totalCredits}\nTotal Quality Points: ${result.totalPoints.toFixed(2)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-3" id={`${toolId}-label`}>
          Enter your courses for {toolName}
        </label>
        <div className="space-y-3" aria-labelledby={`${toolId}-label`}>
          {courses.map((course) => (
            <div key={course.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder="Course name (optional)"
                  aria-label="Course name"
                  className="input-field text-sm"
                />
              </div>
              <div className="w-24">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  aria-label="Grade"
                  className="input-field text-sm"
                >
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <input
                  type="text"
                  inputMode="decimal"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                  placeholder="Credits"
                  aria-label="Credit hours"
                  className="input-field text-sm"
                />
              </div>
              <button
                onClick={() => removeCourse(course.id)}
                disabled={courses.length <= 1}
                aria-label="Remove course"
                className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addCourse}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
          aria-label="Add another course"
        >
          + Add Course
        </button>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate GPA" className="btn-primary">
        Calculate GPA
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600">{result.gpa.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">GPA (4.0 scale)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.totalCredits}</div>
                <div className="text-xs text-gray-500 mt-1">Total Credits</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.totalPoints.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">Quality Points</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
