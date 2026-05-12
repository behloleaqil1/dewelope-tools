'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LunarCalendarConverter - Convert between Gregorian and approximate lunar calendar dates.
 * Uses astronomical new moon calculations to determine lunar months and days.
 */
export default function LunarCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gregorianDate, setGregorianDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    moonPhase: string;
    moonPhaseEmoji: string;
    daysInLunarMonth: number;
    julianDay: number;
  } | null>(null);

  // Calculate Julian Day Number from a date
  function toJulianDay(year: number, month: number, day: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  // Approximate new moon calculation (Meeus algorithm simplified)
  function getNewMoon(k: number): number {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    let JDE = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.000000150 * T3;

    const M = 2.5534 + 29.10535670 * k - 0.0000014 * T2;
    const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T2;
    const F = 160.7108 + 390.67050284 * k - 0.0016118 * T2;

    const Mrad = M * Math.PI / 180;
    const Mprad = Mp * Math.PI / 180;
    const Frad = F * Math.PI / 180;

    JDE += -0.40720 * Math.sin(Mprad)
         + 0.17241 * Math.sin(Mrad)
         + 0.01608 * Math.sin(2 * Mprad)
         + 0.01039 * Math.sin(2 * Frad);

    return JDE;
  }

  function getMoonPhase(dayInMonth: number, daysInMonth: number): { name: string; emoji: string } {
    const phase = dayInMonth / daysInMonth;
    if (phase < 0.03 || phase > 0.97) return { name: 'New Moon', emoji: '🌑' };
    if (phase < 0.22) return { name: 'Waxing Crescent', emoji: '🌒' };
    if (phase < 0.28) return { name: 'First Quarter', emoji: '🌓' };
    if (phase < 0.47) return { name: 'Waxing Gibbous', emoji: '🌔' };
    if (phase < 0.53) return { name: 'Full Moon', emoji: '🌕' };
    if (phase < 0.72) return { name: 'Waning Gibbous', emoji: '🌖' };
    if (phase < 0.78) return { name: 'Last Quarter', emoji: '🌗' };
    return { name: 'Waning Crescent', emoji: '🌘' };
  }

  function convert() {
    const newErrors: Record<string, string> = {};

    if (!gregorianDate) {
      newErrors.date = 'Please select a date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const [year, month, day] = gregorianDate.split('-').map(Number);
    const jd = toJulianDay(year, month, day);

    // Find the lunation number (k) for this date
    const decimalYear = year + (month - 1) / 12 + day / 365.25;
    const k0 = Math.floor((decimalYear - 2000) * 12.3685);

    // Find the new moon before this date
    let kPrev = k0;
    while (getNewMoon(kPrev) > jd) kPrev--;
    while (getNewMoon(kPrev + 1) <= jd) kPrev++;

    const newMoonJD = getNewMoon(kPrev);
    const nextNewMoonJD = getNewMoon(kPrev + 1);

    const lunarDay = Math.floor(jd - newMoonJD) + 1;
    const daysInLunarMonth = Math.round(nextNewMoonJD - newMoonJD);

    // Approximate lunar month/year (Chinese calendar style, simplified)
    // Lunar year starts around late January/early February
    const lunarMonthsSinceEpoch = kPrev;
    // Reference: Jan 2000 new moon is approximately month 12 of lunar year 4697
    const refLunarYear = 4697;
    const refMonth = 12;
    const monthsSinceRef = lunarMonthsSinceEpoch - (-1); // k=0 is Jan 2000
    const totalMonths = refMonth + monthsSinceRef;
    const lunarYear = refLunarYear + Math.floor((totalMonths - 1) / 12);
    const lunarMonth = ((totalMonths - 1) % 12) + 1;

    const { name: moonPhase, emoji: moonPhaseEmoji } = getMoonPhase(lunarDay - 1, daysInLunarMonth);

    setResult({
      lunarYear,
      lunarMonth,
      lunarDay,
      moonPhase,
      moonPhaseEmoji,
      daysInLunarMonth,
      julianDay: jd,
    });
  }

  const copyText = result
    ? `Gregorian: ${gregorianDate}\nLunar Date: Year ${result.lunarYear}, Month ${result.lunarMonth}, Day ${result.lunarDay}\nMoon Phase: ${result.moonPhaseEmoji} ${result.moonPhase}\nDays in Lunar Month: ${result.daysInLunarMonth}\nJulian Day: ${result.julianDay}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.date}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Gregorian Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={gregorianDate}
          onChange={(e) => { setGregorianDate(e.target.value); if (errors.date) setErrors({}); }}
          aria-label={`Gregorian date for ${toolName}`}
          className="input-field w-48"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert to lunar calendar" className="btn-primary">
        Convert to Lunar Calendar
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl mb-2">{result.moonPhaseEmoji}</div>
              <div className="text-lg font-bold text-gray-800">
                Lunar Year {result.lunarYear}, Month {result.lunarMonth}, Day {result.lunarDay}
              </div>
              <div className="text-sm text-gray-500 mt-1">{result.moonPhase}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-semibold text-blue-600">{result.lunarMonth}</div>
                <div className="text-xs text-gray-500">Lunar Month</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-semibold text-green-600">{result.lunarDay}</div>
                <div className="text-xs text-gray-500">Lunar Day</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-semibold text-purple-600">{result.daysInLunarMonth}</div>
                <div className="text-xs text-gray-500">Days in Month</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 italic">
              Note: This is an approximate lunar calendar conversion based on astronomical new moon calculations.
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
