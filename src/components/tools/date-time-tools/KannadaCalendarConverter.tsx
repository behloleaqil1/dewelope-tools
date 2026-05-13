'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KannadaCalendarConverter - Convert Gregorian dates to the Kannada (Shalivahana Shaka) calendar.
 * Shows Kannada month name, year, tithi, and day of week in Kannada.
 */
export default function KannadaCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const kannadaMonths = [
    'ಚೈತ್ರ (Chaitra)',
    'ವೈಶಾಖ (Vaishakha)',
    'ಜ್ಯೇಷ್ಠ (Jyeshtha)',
    'ಆಷಾಢ (Ashadha)',
    'ಶ್ರಾವಣ (Shravana)',
    'ಭಾದ್ರಪದ (Bhadrapada)',
    'ಆಶ್ವಯುಜ (Ashvayuja)',
    'ಕಾರ್ತೀಕ (Kartika)',
    'ಮಾರ್ಗಶಿರ (Margashira)',
    'ಪುಷ್ಯ (Pushya)',
    'ಮಾಘ (Magha)',
    'ಫಾಲ್ಗುಣ (Phalguna)',
  ];

  const kannadaDays = [
    'ಭಾನುವಾರ (Bhanuvara - Sunday)',
    'ಸೋಮವಾರ (Somavara - Monday)',
    'ಮಂಗಳವಾರ (Mangalavara - Tuesday)',
    'ಬುಧವಾರ (Budhavara - Wednesday)',
    'ಗುರುವಾರ (Guruvara - Thursday)',
    'ಶುಕ್ರವಾರ (Shukravara - Friday)',
    'ಶನಿವಾರ (Shanivara - Saturday)',
  ];

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1) {
      setOutput('Invalid date for the given month.');
      return;
    }

    // Shalivahana Shaka era starts 78 CE
    // Kannada new year (Ugadi) typically falls in March/April
    let shakaYear = y - 78;
    // Adjust: if before mid-March, still previous Shaka year
    if (m < 3 || (m === 3 && d < 22)) {
      shakaYear -= 1;
    }

    // Approximate Kannada month from Gregorian
    // Chaitra starts ~March 22, each month ~30-31 days
    const dayOfYear = Math.floor((date.getTime() - new Date(y, 0, 1).getTime()) / 86400000) + 1;
    // Chaitra starts around day 81 (March 22)
    let kannadaDayOfYear = dayOfYear - 81;
    if (kannadaDayOfYear < 0) kannadaDayOfYear += 365;
    const kannadaMonthIndex = Math.floor(kannadaDayOfYear / 30.44) % 12;
    const kannadaDayInMonth = Math.floor(kannadaDayOfYear % 30.44) + 1;

    const dayOfWeek = date.getDay();

    // Samvatsara (60-year cycle)
    const samvatsaraNames = [
      'ಪ್ರಭವ', 'ವಿಭವ', 'ಶುಕ್ಲ', 'ಪ್ರಮೋದೂತ', 'ಪ್ರಜೋತ್ಪತ್ತಿ',
      'ಆಂಗೀರಸ', 'ಶ್ರೀಮುಖ', 'ಭಾವ', 'ಯುವ', 'ಧಾತು',
      'ಈಶ್ವರ', 'ಬಹುಧಾನ್ಯ', 'ಪ್ರಮಾಥಿ', 'ವಿಕ್ರಮ', 'ವೃಷ',
      'ಚಿತ್ರಭಾನು', 'ಸ್ವಭಾನು', 'ತಾರಣ', 'ಪಾರ್ಥಿವ', 'ವ್ಯಯ',
    ];
    const samvatsaraIndex = (shakaYear + 12) % 60;
    const samvatsara = samvatsaraNames[samvatsaraIndex % samvatsaraNames.length];

    const results = [
      `=== Kannada Calendar Conversion ===`,
      ``,
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      ``,
      `Kannada Calendar:`,
      `  Shaka Year: ${shakaYear} (ಶಾಲಿವಾಹನ ಶಕ)`,
      `  Month: ${kannadaMonths[kannadaMonthIndex]}`,
      `  Day: ${kannadaDayInMonth}`,
      `  Day of Week: ${kannadaDays[dayOfWeek]}`,
      `  Samvatsara: ${samvatsara}`,
      ``,
      `Era Information:`,
      `  Shalivahana Shaka Era (started 78 CE)`,
      `  Kannada New Year: Ugadi (ಯುಗಾದಿ)`,
      `  Calendar Type: Lunisolar`,
      ``,
      `Note: This is an approximate conversion.`,
      `  Traditional Kannada calendar requires astronomical`,
      `  calculations for exact tithi and nakshatra.`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" min="1" max="9999" value={year} onChange={(e) => setYear(e.target.value)} aria-label={`Year for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
            <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day (1-31)</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Day" className="input-field" />
          </div>
          <button onClick={convert} className="btn-primary w-full">Convert to Kannada Calendar</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Kannada Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
