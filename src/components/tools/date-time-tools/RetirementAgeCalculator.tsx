'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RetirementAgeCalculator - Calculate years and days until retirement
 * based on birth date and target retirement age.
 */
export default function RetirementAgeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [birthDate, setBirthDate] = useState('');
  const [retirementAge, setRetirementAge] = useState('65');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    retirementDate: string;
    yearsLeft: number;
    monthsLeft: number;
    daysLeft: number;
    totalDaysLeft: number;
    currentAge: number;
    alreadyRetired: boolean;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (!birthDate) newErrors.birthDate = 'Please select your birth date';
    const age = parseInt(retirementAge);
    if (!retirementAge.trim() || isNaN(age) || age < 1 || age > 120) {
      newErrors.retirementAge = 'Enter a valid age (1-120)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const birth = new Date(birthDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const retireDate = new Date(birth);
    retireDate.setFullYear(birth.getFullYear() + age);

    const currentAgeMs = today.getTime() - birth.getTime();
    const currentAge = Math.floor(currentAgeMs / (365.25 * 24 * 60 * 60 * 1000));

    if (retireDate <= today) {
      setResult({
        retirementDate: retireDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        yearsLeft: 0,
        monthsLeft: 0,
        daysLeft: 0,
        totalDaysLeft: 0,
        currentAge,
        alreadyRetired: true,
      });
      return;
    }

    const diffMs = retireDate.getTime() - today.getTime();
    const totalDaysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let years = retireDate.getFullYear() - today.getFullYear();
    let months = retireDate.getMonth() - today.getMonth();
    let days = retireDate.getDate() - today.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(retireDate.getFullYear(), retireDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setResult({
      retirementDate: retireDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      yearsLeft: years,
      monthsLeft: months,
      daysLeft: days,
      totalDaysLeft,
      currentAge,
      alreadyRetired: false,
    });
  };

  const copyText = result
    ? result.alreadyRetired
      ? `You have already reached retirement age!\nRetirement date: ${result.retirementDate}\nCurrent age: ${result.currentAge}`
      : `Retirement date: ${result.retirementDate}\nTime until retirement: ${result.yearsLeft} years, ${result.monthsLeft} months, ${result.daysLeft} days\nTotal days remaining: ${result.totalDaysLeft}\nCurrent age: ${result.currentAge}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.birthDate}>
          <label htmlFor={`${toolId}-birth`} className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
          <input id={`${toolId}-birth`} type="date" value={birthDate} onChange={(e) => { setBirthDate(e.target.value); if (errors.birthDate) setErrors((p) => ({ ...p, birthDate: '' })); }} aria-label={`Birth date for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.retirementAge}>
          <label htmlFor={`${toolId}-age`} className="block text-sm font-medium text-gray-700 mb-1">Target Retirement Age</label>
          <input id={`${toolId}-age`} type="text" inputMode="numeric" value={retirementAge} onChange={(e) => { setRetirementAge(e.target.value); if (errors.retirementAge) setErrors((p) => ({ ...p, retirementAge: '' })); }} placeholder="e.g. 65" aria-label={`Retirement age for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate retirement" className="btn-primary">
        Calculate Retirement
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            {result.alreadyRetired ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-xl font-bold text-green-600">🎉 Already Retired!</div>
                <div className="text-sm text-gray-600 mt-1">You reached retirement age on {result.retirementDate}</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.yearsLeft}y {result.monthsLeft}m {result.daysLeft}d</div>
                    <div className="text-xs text-gray-500 mt-1">Time Until Retirement</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.totalDaysLeft.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">Total Days Left</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
                  <p><strong>Current age:</strong> {result.currentAge} years</p>
                  <p><strong>Retirement date:</strong> {result.retirementDate}</p>
                </div>
              </>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
